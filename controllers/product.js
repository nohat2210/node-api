const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const index = async (req, res, next) => {
  return res.status(200).json(res.paginatedResults);
};

const newProduct = async (req, res, next) => {
  // Find owner
  const { categoryID, ownerID } = req.value.body;
  const owner = await User.findById(ownerID);
  const foundCategory = await Category.findById(categoryID);
  // Create a new product
  const product = req.value.body;
  delete product.owner;
  delete product.category;
  product.owner = owner._id;
  product.category = foundCategory._id;

  const newProduct = new Product(product);
  if (foundCategory) await newProduct.save();

  //Add newly created product to the actual product
  owner.products.push(newProduct._id);
  foundCategory.products.push(newProduct._id);
  await owner.save();

  return res.status(201).json({ product: newProduct });
};

const getProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const product = await Product.findById(productID).populate(
    'category',
    'name'
  );
  return res.status(200).json({ product });
};

const replaceProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const product = await Product.findById(productID);
  const newProduct = req.value.body;
  const result = await Product.findByIdAndUpdate(productID, newProduct);
  //Check if put user, category, remove product in user's model, category's model
  const ownerID = product.owner;

  const currentOwner = await User.findById(ownerID);
  currentOwner.products.pull(product);
  await currentOwner.save();

  const categoryID = product.category;
  const currentCategory = await Category.findById(categoryID);
  currentCategory.products.pull(product);
  await currentCategory.save();

  const newOwnerID = newProduct.owner;
  const newOwner = await User.findById(newOwnerID);

  newOwner.products.push(result._id);
  await newOwner.save();

  const newCategory = await Category.findById(newProduct.category);
  newCategory.products.push(result._id);
  await newCategory.save();

  return res.status(200).json({ success: true });
};

const updateProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const product = await Product.findById(productID);
  const newProduct = req.value.body;
  const result = await Product.findByIdAndUpdate(productID, newProduct);
  //Check if put user, category, remove product in user's model, category's model
  const ownerID = product.owner;

  const currentOwner = await User.findById(ownerID);
  currentOwner.products.pull(product);
  await currentOwner.save();

  const categoryID = product.category;
  const currentCategory = await Category.findById(categoryID);
  currentCategory.products.pull(product);
  await currentCategory.save();

  const newOwnerID = newProduct.owner;
  const newOwner = await User.findById(newOwnerID);
  newOwner.products.push(result._id);
  await newOwner.save();

  const newCategory = await Category.findById(newProduct.category);
  newCategory.products.push(result._id);
  await newCategory.save();

  return res.status(200).json({ success: true });
};

const deleteProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  //get a product
  const product = await Product.findById(productID);
  const ownerID = product.owner;
  const categoryID = product.category;
  //get a owner
  const owner = await User.findById(ownerID);
  const category = await Category.findById(categoryID);
  //Remove the product
  await product.remove();
  //Remove product from owner's product list
  owner.products.pull(product);
  category.products.pull(product);
  await owner.save();
  await category.save();
  return res.status(200).json({ success: true });
};

module.exports = {
  index,
  newProduct,
  getProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
