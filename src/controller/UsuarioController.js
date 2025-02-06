const UserRepository = require('../Services/user.services'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const Cart = require('../models/cart'); 
const UserDTO = require('../dto/userDTO'); 
const mongoose = require('mongoose');


const secretKey = process.env.JWT_SECRET_KEY || 'tareacoder';

class UsuarioController {
  // Obtener todos los usuarios
  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UserRepository.findAll();
      const usuariosDTO = usuarios.map(usuario => new UserDTO(usuario)); 
      res.json(usuariosDTO);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
  }

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await UserRepository.findById(req.user._id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const usuarioDTO = new UserDTO(usuario); 
      res.json(usuarioDTO);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
    }
  }

  // Registrar un nuevo usuario
  async registrarUsuario(req, res) {
    const { email, password, first_name, last_name, age, role = 'user' } = req.body;

    try {
      const usuarioExistente = await UserRepository.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const nuevoCarrito = await Cart.create({ products: [], owner: null });

      const nuevoUsuario = await UserRepository.save({
        email,
        password,
        first_name,
        last_name,
        age,
        role,
        cart: nuevoCarrito._id, 
      });

      nuevoCarrito.owner = nuevoUsuario._id; 
      await nuevoCarrito.save(); 

      const usuarioDTO = new UserDTO(nuevoUsuario); 
      res.status(201).json({ message: 'Usuario creado con éxito', user: usuarioDTO });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
  }

  async loginUsuario(req, res) {
    const { email, password } = req.body;
  
    try {
      // Buscamos al usuario en la base de datos
      const usuario = await UserRepository.findByEmail(email);
      
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas: Usuario no encontrado' });
      }
  
      // Log: Verificar qué contraseña estamos comparando
      console.log('Contraseña proporcionada:', password);
      console.log('Contraseña guardada en la base de datos (hash):', usuario.password);
  
      // Validamos la contraseña
      const isPasswordValid = bcrypt.compareSync(password, usuario.password);
  
      // Log: Verificar el resultado de la comparación
      console.log('Resultado de la comparación:', isPasswordValid);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciales inválidas: Contraseña incorrecta' });
      }
  
      // Si la contraseña es válida, creamos el token JWT
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email, role: usuario.role, cart: usuario.cart },
        secretKey,
        { expiresIn: '1h' }
      );
  
      // Devolvemos el token de autenticación
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
      res.json({
        status: "success",
        message: "Logged in",
        cartId: usuario.cart  // Aquí devolvemos el ID del carrito
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
  }

// Obtener un usuario por ID
async obtenerUsuarioPorId(req, res) {
  try {
    // Verifica que req.params.uid está definido
    const userId = req.params.uid;
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }

    // Buscar el usuario por el ID proporcionado en la URL
    const usuario = await UserRepository.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioDTO = new UserDTO(usuario);
    res.json(usuarioDTO);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
  }
}

  // Actualizar un usuario
  async actualizarUsuario(req, res) {
    try {
      const usuarioActualizado = await UserRepository.update(req.params.id, req.body);
      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const usuarioDTO = new UserDTO(usuarioActualizado); 
      res.json(usuarioDTO);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario', details: error.message });
    }
  }

  // Eliminar un usuario
  async eliminarUsuario(req, res) {
    try {
      const usuarioEliminado = await UserRepository.delete(req.params.id);
      if (!usuarioEliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
    }
  }
}

module.exports = new UsuarioController();










