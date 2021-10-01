const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const index = async (req, res, next) => {
  return res.status(200).json(res.paginatedResults);
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);
  await newUser.save();
  return res.status(201).json({ user: newUser });
};

const getUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const updateUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true, newUser: result });
};

const replaceUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true, newUser: result });
};

const getUserProducts = async (req, res, next) => {
  const { userID } = req.value.params;
  const queryString = req.query;
  const page = parseInt(queryString.page);
  const limit = parseInt(queryString.limit);
  const skip = (page - 1) * limit;
  const totalItems = await Product.countDocuments({ owner: userID });
  //Get user
  const user = await User.findById(userID).populate({
    path: 'products',
    populate: { path: 'category', select: 'name' },
    options: {
      limit,
      skip,
    },
  });
  return res.status(200).json({
    products: user.products,
    meta: {
      currentPage: page || 1,
      itemsPerPage: 5,
      next: page + 1,
      previous: page - 1,
      totalItems,
    },
  });
};

const newUserProduct = async (req, res, next) => {
  const { userID } = req.value.params;
  const { category } = req.value.body;
  //Create a new product
  const newProduct = new Product(req.value.body);
  const foundCategory = await Category.findById(category);
  // Get user
  const user = await User.findById(userID);
  //Assign user as a product's owner
  newProduct.owner = user;
  newProduct.category = foundCategory;

  //Save the product
  if (foundCategory) await newProduct.save();
  //Add product to user's product
  user.products.push(newProduct._id);
  foundCategory.products.push(newProduct._id);
  //Save the user
  await user.save();
  await foundCategory.save();
  return res.status(201).json({ products: newProduct });
};

module.exports = {
  index,
  newUser,
  getUser,
  updateUser,
  replaceUser,
  getUserProducts,
  newUserProduct,
};
