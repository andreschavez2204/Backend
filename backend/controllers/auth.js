import User from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';



export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;

    // Validación utilizando express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //validacion
    if (!name) {
      return res.status(400).send("El nombre es obligatorio");
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(
          "La contraseña es obligatoria y debe tener al menos 6 caracteres"
        );
    }

    let userExist = await User.findOne({ email }).exec();

    if (userExist) {
      return res.status(400).send("El email ya existe");
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //registro
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.json({ ok: true });


  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Intenta de nuevo.");
  }
};


export const login = async (req, res) => {

  try {
    // console.log(req.body);
    //Revisar si el usuario existe
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).send("No existe el usuario");
    }
    //Revisamos la contraseña
    const match = await comparePassword(password, user.password);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Retornamos el token y el usuario
    user.password = undefined;
    //Enviamos el token en una cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, //solo funciona en https
    });

    //Enviamos el usuario como json
    res.json(user);

  }

  catch (err) {
    console.log(err);
    return res.status(400).send("Error. Intenta de nuevo.");
  }
};