const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        req.uid = uid;

        const usuario = await Usuario.findById(uid);

        //validar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la BD'
            })
        }

        //validar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            })
        }


        req.usuario = usuario;





        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'token no valido'
        })
    }

}



module.exports = {
    validarJWT
}