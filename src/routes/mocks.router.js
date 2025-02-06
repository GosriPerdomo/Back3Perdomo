// mocks.router.js
const express = require('express');
const router = express.Router();
const { generateMockUsers } = require('../Utils/mocking'); 
const UserRepository = require('../Services/user.services');
const CartRepository = require('../Services/cart.services');

// Ruta POST /generateData
router.post('/generateData', async (req, res) => {
  const { users, carts } = req.body; // Body de la request 

  try {
    // Genera los usuarios de prueba y les asignamos carritos
    const { users: mockUsers } = await generateMockUsers(users, carts);

    const createdUsers = [];
    for (let i = 0; i < mockUsers.length; i++) {
      const user = await UserRepository.save(mockUsers[i]); 
      createdUsers.push(user);

      // Asigna un carrito ya creado (sin crear uno nuevo)
      user.cart = mockUsers[i].cart; 
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

  const mockUsers = await generateMockUsers(50, 50, true); 

  res.status(200).json({ status: 'success', users: mockUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error generating mock users', details: error.message });
  }
});

module.exports = router;








//Buenas ultimamente no e tenido mucho tiempo para darle al curso por motivos laborales , intente ajustar la consigna a el proyecto que ya tenia del anterior curso para ahorrar tiempo por lo mismo
//Disculpen si esta medio desordenado lo tuve que hacer a las apuradas, el proyecto final va a estar hecho con mucho mas cuidado al detalle. Gracias :)


