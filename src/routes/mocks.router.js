// mocks.router.js
const express = require('express');
const router = express.Router();
const { generateMockUsers } = require('../Utils/mocking'); 
const UserRepository = require('../Services/user.services');
const CartRepository = require('../Services/cart.services');

// Ruta POST /generateData
router.post('/generateData', async (req, res) => {
  const { users, carts } = req.body; // Aquí recibimos el número de usuarios y carritos

  try {
    // Genera los usuarios de prueba y les asignamos carritos
    const { users: mockUsers } = await generateMockUsers(users, carts);

    const createdUsers = [];
    for (let i = 0; i < mockUsers.length; i++) {
      const user = await UserRepository.save(mockUsers[i]); 
      createdUsers.push(user);

      // Asigna un carrito ya creado (sin crear uno nuevo)
      user.cart = mockUsers[i].cart; // Asignar el carrito ya generado
      await user.save();
    }

    res.status(201).json({
      message: 'Mock users created successfully',
      users: createdUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error generating mock data',
      details: error.message,
    });
  }
});

// Ruta GET /mockingusers
router.get('/mockingusers', async (req, res) => {
  try {
    // Generar siempre 50 usuarios y 50 carritos (en memoria, sin guardar en DB)
    const mockUsers = await generateMockUsers(50, 50, true); // El true indica que estamos en un GET, no en un POST

    // Devolver los usuarios sin almacenarlos en la base de datos
    res.status(200).json({ status: 'success', users: mockUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error generating mock users', details: error.message });
  }
});

module.exports = router;








//Buenas ultimamente no e tenido mucho tiempo para darle al curso por motivos laborales , intente ajustar la consigna a el proyecto que ya tenia del anterior curso para ahorrar tiempo por lo mismo
//Disculpen si esta medio desordenado lo tuve que hacer a las apuradas, el proyecto final va a estar hecho con mucho mas cuidado al detalle. Gracias :)


