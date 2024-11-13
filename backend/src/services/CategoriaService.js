const Categoria = require("../models/Categoria");

//LISTAGEM DE CATEGORIAS
const getCategoria = async (req, res) => {
  const { limit = 12, page = 1, fields, use_in_menu } = req.query;

  let limitValue = parseInt(limit);
  let pageValue = parseInt(page);

  if (isNaN(limitValue) || limitValue < -1) {
    return res.status(400).json({ error: "Limite inválido" });
  }

  if (isNaN(pageValue) || pageValue < 1) {
    return res.status(400).json({ error: "Página inválida" });
  }

  try {
    const queryOptions = {
      where: {},
      limit: limitValue === -1 ? undefined : limitValue,
      offset: limitValue === -1 ? 0 : (pageValue - 1) * limitValue,
    };

    if (use_in_menu) {
      queryOptions.where.use_in_menu = use_in_menu === "true";
    }

    const categorias = await Categoria.findAndCountAll(queryOptions);

    const camposSelecionados = fields ? fields.split(",") : ["id", "name", "slug", "use_in_menu"];
    const resultado = categorias.rows.map((categoria) => {
      const cat = {};
      camposSelecionados.forEach((campo) => {
        cat[campo] = categoria[campo];
      });
      return cat;
    });

    res.status(200).json({
      data: resultado,
      total: categorias.count,
      limit: limitValue,
      page: pageValue,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//LISTAGEM POR ID
const getCategoriaById = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria nao encontrada" });
    }

    res.status(200).json({
      id: categoria.id,
      name: categoria.name,
      slug: categoria.slug,
      use_in_menu: categoria.use_in_menu,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//CRIAR CATEGORIA
const createCategoria = async (req, res) => {
  const { name, slug, use_in_menu } = req.body;

  if (!name || !slug || use_in_menu === undefined) {
    return res.status(400).json({ error: "Dados de requisição inválidos" });
  }
  try {
    const categoria = await Categoria.create({ name, slug, use_in_menu });
    res.status(201).json({
      name: categoria.name,
      slug: categoria.slug,
      use_in_menu: categoria.use_in_menu,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//ATUALIZAR CATEGORIA
const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { name, slug, use_in_menu } = req.body;

  if (!name || !slug || use_in_menu === undefined) {
    return res.status(400).json({ error: "Dados de requisição inválidos" });

  } try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    categoria.name = name;
    categoria.slug = slug;
    categoria.use_in_menu = use_in_menu;
    await categoria.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

//DELETAR CATEGORIA
const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    await categoria.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { getCategoria, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
