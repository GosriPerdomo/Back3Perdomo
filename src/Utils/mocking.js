// utils/mocking.js
const { faker } = require('@faker-js/faker');  //faker.js para los datos ficticios 
const Cart = require('../models/cart');

async function generateMockUsers(numUsers = 0, numCarts = 0, isGetRequest = false) {
  if (numUsers <= 0 || numCarts <= 0) {
    throw new Error('Both users and carts parameters must be greater than 0.');
  }

  // generacion de usuario
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 60 }),
      password: "coder123",  // Contraseña en texto plano (se encripta automaticamente por el model)
      role: Math.random() < 0.5 ? "user" : "admin",
    };

    
    const cart = new Cart({ products: [] });
    if (!isGetRequest) {
   
      await cart.save();
      user.cart = cart._id; 
    } else {
      user.cart = cart; 
    }

    users.push(user);
  }


  const remainingCarts = numCarts - numUsers; // A;adi la parte del calculo porque al usuario ya crearse con un carrito me pasaba que si en el body pedia 3 carts creaba 4 
  const additionalCarts = [];
  for (let i = 0; i < remainingCarts; i++) {
    const cart = new Cart({ products: [] });
    if (!isGetRequest) {
      await cart.save(); 
    }
    additionalCarts.push(cart._id); 
  }

  return { users, additionalCarts }; 
}

module.exports = { generateMockUsers };


//Segundo commit para dejar las notaciones mas claras 















