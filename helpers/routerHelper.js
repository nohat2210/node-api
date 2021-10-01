const Joi = require('@hapi/joi');

const validateBody = schema => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body);
    if (validateResult.error) {
      return res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value['body']) req.value.body = {};
      req.value.body = validateResult.value;
      next();
    }
  };
};

const validateParams = (schema, name) => {
  return (req, res, next) => {
    const validateResult = schema.validate({ params: req.params[name] });
    if (validateResult.error) {
      return res.status(400).json(validateResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value['params']) req.value.params = {};
      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const schemas = {
  idSchema: Joi.object().keys({
    params: Joi.string()
      .regex(/^[0-9a-zA-Z]{24}$/)
      .required(),
  }),
  //auth
  authRegisterSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  authLoginSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  //user
  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
  }),
  userOptionalSchema: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email(),
  }),
  //product
  productSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
  }),
  newProductSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    owner: Joi.string()
      .regex(/^[0-9a-zA-Z]{24}$/)
      .required(),
  }),
  productOptionalSchema: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    category: Joi.string(),
    price: Joi.number(),
    owner: Joi.string().regex(/^[0-9a-zA-Z]{24}$/),
  }),
  //category
  categorySchema: Joi.object().keys({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(10).required(),
  }),
  categoryOptionSchema: Joi.object().keys({
    name: Joi.string().min(2),
    description: Joi.string().min(10),
  }),
  notificationSchema: Joi.object().keys({
    title: Joi.string().min(2).required(),
    content: Joi.string().min(10).required(),
  }),
  // order
  orderSchema: Joi.object().keys({
    orderItems: Joi.array().required(),
    status: Joi.string().required(),
    totalPrice: Joi.number().required(),
    owner: Joi.string()
      .regex(/^[0-9a-zA-Z]{24}$/)
      .required(),
  }),
  orderOptionalSchema: Joi.object().keys({
    orderItems: Joi.array(),
    status: Joi.string(),
    totalPrice: Joi.number(),
    owner: Joi.string().regex(/^[0-9a-zA-Z]{24}$/),
  }),
};

module.exports = { validateBody, validateParams, schemas };
