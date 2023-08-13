const { Op } = require("sequelize");
const { Products } = require("../models");




const createProduct = async (req, res, next) => {
  try {
    const {file, body} = req;
    const url =
    process.env.NODE_ENV === "production"
      ? `${process.env.URL}/imagesp/${file.filename}`
      : `${process.env.URL}:9000/imagesp/${file.filename}`;
    const products = await Products.create({
      name: body.name,
      availableQty: body.availableQty,
      price: Number(body.price),
      userId: body.userId,
      productImage: url
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};


const editproduct = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {description} = req.body;

    const product = await Products.update({description: description}, {where: {id: id}});

    res.json(product);
  } catch (error) {
    next(error)
  }
}




const getAllProducts = async (req, res, next) => {
  try {
    // pedir todos los productos al modelo Products
    const products = await Products.findAll({
      where: {
        availableQty: {
          [Op.gt]: 0,
        },
      },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  editproduct,
};
