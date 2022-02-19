const { response } = require("express");
const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Validar si el email existe

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / password no son correctos - correo"
            })
        }


        //verificar que el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / password no son correctos - estado: false"
            })
        }

        //validar contraseña

        const validarPass = bcrypt.compareSync(password, usuario.password);
        if (!validarPass) {
            return res.status(400).json({
                msg: "Usuario / password no son correctos - password"
            })
        }

        //generar JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

};


const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}


const renovarToken = async(req, res = response) => {
    const { usuario } = req;

    //generar JWT

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}



module.exports = {
    login,
    googleSignIn,
    renovarToken
}