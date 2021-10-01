const Category = require('../models/Category');
const Product = require('../models/Product');

const index = async (req, res, next) => {
  return res.status(200).json(res.paginatedResults);
};

const newCategory = async (req, res, next) => {
  const { name, description, icon } = req.value.body;
  const foundCategory = await Category.findOne({ name });
  if (foundCategory)
    res.status(403).json({ error: { message: 'Category already exists' } });
  const newCategory = new Category({ name, description, icon });
  await newCategory.save();
  return res.status(201).json({ category: newCategory });
};

const getCategory = async (req, res, next) => {
  const { categoryID } = req.value.params;
  const category = await Category.findById(categoryID);
  return res.status(200).json({ category });
};

const updateCategory = async (req, res, next) => {
  const { categoryID } = req.value.params;
  const newCategory = req.value.body;
  const result = await Category.findByIdAndUpdate(categoryID, newCategory);

  return res.status(200).json({ success: true });
};

const replaceCategory = async (req, res, next) => {
  const { categoryID } = req.value.params;
  const newCategory = req.value.body;
  const result = await Category.findByIdAndUpdate(categoryID, newCategory);

  return res.status(200).json({ success: true });
};

const deleteCategory = async (req, res, next) => {
  // get category
  const { categoryID } = req.value.params;
  const category = await Category.findById(categoryID);
  //get product's category
  const products = await Product.find({ category });
  // remove category
  await category.remove();
  products.category.pull(category);
  await products.save();
  return res.status(200).json({ success: true });
};

const getProductCategory = async (req, res, next) => {
  const { categoryID } = req.value.params;
  //Get category
  const category = await Category.findById(categoryID)
    .populate('products')
    .exec();
  return res.status(200).json({ products: category.products });
};

module.exports = {
  index,
  newCategory,
  getCategory,
  updateCategory,
  replaceCategory,
  deleteCategory,
  getProductCategory,
};
