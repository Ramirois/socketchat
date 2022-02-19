const { response } = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');


const usuariosGet = async(req = request, res = response) => {

    // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find()
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {


    const { nombre, correo, rol, password } = req.body;
    const usuario = new Usuario({ nombre, correo, rol, password });
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar usuario
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, correo, google, ...resto } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;
    //Eliminacion fisica
    // const usuario = await Usuario.findByIdAndDelete(id)

    //Eliminacion logica



    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAuntenticado = req.usuario;


    res.json({
        usuario,
        usuarioAuntenticado
    });
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosPost,
    usuariosDelete
}