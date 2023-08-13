const { Op } = require("sequelize");
const { Cars, ProductsInCar, Orders, ProductsInOrder } = require("../models");

const addProductToCar = async (req, res, next) => {
  try {
    // por el body debe venir la sig info
    // { productId, quantity, price }
    const carId = req.params.id;
    const { productId, quantity, price } = req.body;

    // quiero que si el producto ya existe en el carrito entonces sume la cantidad y no cree uno nuevo
    // verificar si el carrido con el id  ya tiene un producto con el productoId
    // entonces sumamos - si no existe lo creamos

    const productInCar = await ProductsInCar.findAll({
      where: {
        [Op.and]: [{ carId }, { productId }],
      },
    }); // si el carId y productId
    console.log(productInCar);
    if (productInCar.length < 1) {
      await ProductsInCar.create({ carId, productId, quantity, price });
    }

    if (productInCar.length > 0) {
      await ProductsInCar.increment({ quantity }, { where: { carId } });
    }

    // si agrego un producto
    // debo actualizar el total del carrito
    // multiplico el price * quantity
    await Cars.increment({ total: quantity * price }, { where: { id: carId } });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const buyProductsInCar = async (req, res, next) => {
  try {

    const { cardId,userId, products } = req.body;
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.quantity;
    });

    await ProductsInCar.update({purchased: true}, {where: {carId: cardId }})

    const order = await Orders.create({ userId, total });

    const productsWithOrder = products.map((product) => ({
      ...product,
      orderId: order.id,
    }));
    await ProductsInOrder.bulkCreate(productsWithOrder);

    // decrement en quantity de cada producto

    res.status(201).json({
      orderId: order.id,
      total: order.total,
      products: productsWithOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProductToCar,
  buyProductsInCar,
};
