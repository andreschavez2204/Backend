import express from 'express';
import { login, register } from '../controllers/auth';
import { body } from 'express-validator';



const router = express.Router();

// Validación de los datos de registro
const registerValidationRules = [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .trim()
        .escape()

];


module.exports = router;