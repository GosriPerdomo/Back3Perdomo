// utils/mocking.js
const { faker } = require('@faker-js/faker');
const Cart = require('../models/cart');

async function generateMockUsers(numUsers = 0, numCarts = 0, isGetRequest = false) {
  if (numUsers <= 0 || numCarts <= 0) {
    throw new Error('Both users and carts parameters must be greater than 0.');
  }

  // Primero generamos los usuarios
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 60 }),
      password: "coder123",  // Contraseña en texto plano
      role: Math.random() < 0.5 ? "user" : "admin",
    };

    // Creamos el carrito para cada usuario
    const cart = new Cart({ products: [] });
    if (!isGetRequest) {
      // Si no es una petición GET, guardamos el carrito en la base de datos
      await cart.save();
      user.cart = cart._id; // Asignamos el carrito al usuario
    } else {
      user.cart = cart; // En GET no guardamos el carrito en DB
    }

    users.push(user);
  }

  // Si necesitamos más carritos, creamos los adicionales
  const remainingCarts = numCarts - numUsers; // Cálculo de cuántos carritos adicionales necesitamos
  const additionalCarts = [];
  for (let i = 0; i < remainingCarts; i++) {
    const cart = new Cart({ products: [] });
    if (!isGetRequest) {
      await cart.save(); // Guardamos los carritos adicionales solo si es una petición POST
    }
    additionalCarts.push(cart._id); // Solo guardamos los ObjectIds
  }

  return { users, additionalCarts }; // Devolvemos usuarios con carritos y los carritos adicionales
}

module.exports = { generateMockUsers };















