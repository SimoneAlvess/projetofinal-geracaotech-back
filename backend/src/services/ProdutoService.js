const Produto = require("../models/Produto");
const OpcaoProduto = require("../models/OpcaoProduto");
const ImagemProduto = require("../models/ImagemProduto");
const ProdutoCategoria = require("../models/ProdutoCategoria");
const Categoria = require("../models/Categoria");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const e = require("express");

const getProdutos = async (req, res) => {
  const { limit = 12, page = 1, fields, match, category_ids, "price-range": priceRange, ...options } = req.query;

  // Converte os parâmetros limit e page para números
  const limitValue = parseInt(limit, 10);
  const pageValue = parseInt(page, 10);
  const offset = (pageValue - 1) * limitValue;

  // Seleciona os campos especificados na query
  const selectedFields = fields ? fields.split(",") : null;

  // Monta a condição de busca
  const whereConditions = {};

  // Filtro por termo de busca (match)
  if (match) {
    whereConditions[Op.or] = [{ name: { [Op.like]: `%${match}%` } }, { description: { [Op.like]: `%${match}%` } }];
  }

  // Filtro por faixa de preço
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    whereConditions.price = { [Op.between]: [minPrice, maxPrice] };
  }

  try {
    const produtos = await Produto.findAll({
      where: whereConditions,
      limit: limitValue === -1 ? undefined : limitValue,
      offset: limitValue === -1 ? undefined : offset,
      attributes: selectedFields,
      include: [
        { 
          model: ImagemProduto, 
          attributes: ["id", "path"] 
        },
        {
          model: OpcaoProduto,
          attributes: ["id", "title", "values"],
        },
        {
          model: Categoria,
          through: { attributes: [] },
          ...(category_ids && {
            where: {
              id: { [Op.in]: category_ids.split(",").map(Number) },
            },
          }),
        },
      ],
    });

    const response = {
      data: produtos.map((produto) => ({
        id: produto.id,
        enabled: produto.enabled,
        name: produto.name,
        slug: produto.slug,
        stock: produto.stock,
        description: produto.description,
        price: produto.price,
        price_with_discount: produto.price_with_discount,
        category_ids: produto.Categoria.map((categoria) => categoria.id),
        images: produto.ImagemProdutos.map((imagem) => ({
          id: imagem.id,
          content: imagem.path,
        })),
        options: produto.OpcoesProdutos.map((opcao) => ({
          id: opcao.id,
          title: opcao.title,
          values: opcao.values.split(","),
        })),
      })),
      total: produtos.length,
      limit: limitValue,
      page: pageValue,
    };
 
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
   
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//LISTAGEM DE PRODUTOS POR ID
const getProdutoById = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findByPk(id, {
      include: [
        {
          model: Categoria,
        },
        ImagemProduto,
        OpcaoProduto,
      ],
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const resposta = {
      id: produto.id,
      enabled: produto.enabled,
      name: produto.name,
      slug: produto.slug,
      stock: produto.stock,
      description: produto.description,
      price: produto.price,
      price_with_discount: produto.price_with_discount,
      category_ids: produto.Categoria.map((c) => c.id),
      images: produto.ImagemProdutos.map((i) => ({
        id: i.id,
        content: `https://store.com/media/product-${produto.id}/${i.path}`,
      })),
      options: produto.OpcoesProdutos.map((o) => ({
        id: o.id,
        title: o.title,
        shape: o.shape,
        radius: o.radius,
        type: o.type,
        values: o.values.split(","),
      })),
    };
    res.status(200).json(resposta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//FUNÇÃO PARA SALVAR IMAGEM
const saveImage = async (base64Data) => {
  const base64Header = base64Data.split(";")[0];
  const imageType = base64Header.split("/")[1];
  const data = base64Data.replace(`data:image/${imageType};base64,`, "");

  const fileName = `${Date.now()}.${imageType}`;
  const filePath = path.join(__dirname, "../../uploads", fileName);
  fs.writeFileSync(filePath, data, { encoding: "base64" });

  return fileName;
};

//CRIAR PRODUTO
const createProduto = async (req, res) => {
  try {
    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

    const produto = await Produto.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    });

    if (category_ids && category_ids.length > 0) {
      await Promise.all(category_ids.map((category_id) => ProdutoCategoria.create({ produto_id: produto.id, categoria_id: category_id })));
    }

    if (options && options.length > 0) {
      await Promise.all(
        options.map((option) => {
          OpcaoProduto.create({
            produto_id: produto.id,
            title: option.title,
            shape: option.shape,
            radius: option.radius,
            type: option.type,
            values: option.value ? option.value.join(",") : option.values.join(","),
          });
        })
      );
    }

    if (images && images.length > 0) {
      await Promise.all(
        images.map(async (image) => {
          const imageName = await saveImage(image.content);
          return ImagemProduto.create({
            produto_id: produto.id,
            path: imageName,
            enabled: true,
          });
        })
      );
    }
    res.status(201).json({ message: "Produto criado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

//ATUALIZAR PRODUTO
const updateProduto = async (req, res) => {
  const { id } = req.params;
  const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    produto.enabled = enabled;
    produto.name = name;
    produto.slug = slug;
    produto.stock = stock;
    produto.description = description;
    produto.price = price;
    produto.price_with_discount = price_with_discount;

    await ProdutoCategoria.destroy({ where: { produto_id: id } });
    if (category_ids && category_ids.length > 0) {
      await Promise.all(category_ids.map((category_id) => ProdutoCategoria.create({ produto_id: id, categoria_id: category_id })));
    }

    if (images && images.length > 0) {
      await ImagemProduto.destroy({
        where: {
          produto_id: id,
          id: images.filter((img) => img.deleted).map((img) => img.id),
        },
      });

      await Promise.all(
        images.map(async (img) => {
          if (img.deleted) return;
          if (img.id) {
            const imageProduct = await ImagemProduto.findByPk(img.id);
            if (imageProduct) {
              imageProduct.path = await saveImage(img.content);
              await imageProduct.save();
            }
          } else {
            const imageName = await saveImage(img.content);
            await ImagemProduto.create({
              produto_id: id,
              path: imageName,
              enabled: true,
            });
          }
        })
      );
    }

    if (options && options.length > 0) {
      await OpcaoProduto.destroy({
        where: {
          produto_id: id,
          id: options.filter((opt) => opt.deleted).map((opt) => opt.id),
        },
      });
      await Promise.all(
        options.map(async (opt) => {
          if (opt.deleted) return;

          if (opt.id) {
            const productOption = await OpcaoProduto.findByPk(opt.id);
            if (productOption) {
              if (opt.title !== undefined) {
                productOption.title = opt.title;
              }
              if (opt.shape !== undefined) {
                productOption.shape = opt.shape;
              }
              if (opt.radius !== undefined) {
                productOption.radius = opt.radius;
              }
              if (opt.type !== undefined) {
                productOption.type = opt.type;
              }
              if (opt.value !== undefined) {
                productOption.values = opt.value.join(",");
              }
              await productOption.save();
            }
          } else {
            if (!opt.title) {
              throw new Error("Opção deve ter um título.");
            }
            await OpcaoProduto.create({
              produto_id: id,
              title: opt.title,
              shape: opt.shape,
              radius: opt.radius,
              type: opt.type,
              values: opt.values ? opt.values.join(",") : "",
            });
          }
        })
      );
    }
    await produto.save();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Dados de requisição inválidos" });
  }
};

//DELETAR PRODUTO
const deleteProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    await produto.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { getProdutos, getProdutoById, createProduto, updateProduto, deleteProduto };
