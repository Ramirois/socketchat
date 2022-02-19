const {
    Categoria,
    Usuario,
    Role,
    Producto
} = require('../models');

const esRoleValido = async(rol = '') => {
    const existRol = await Role.findOne({ rol });
    if (!existRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la BD`)
    }
}

const emailExiste = async(correo) => {
    const existEmail = await Usuario.findOne({ correo });
    if (existEmail) {
        throw new Error(`El E-mail ${correo} ya esta registrado`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existUsuario = await Usuario.findById(id);
    if (!existUsuario) {
        throw new Error(`El ID ${id} no existe`);
    }
}

const existeCategoriaPorId = async(id) => {
    const existCategoria = await Categoria.findById(id);
    if (!existCategoria) {
        throw new Error(`El ID ${id} no existe`);
    }
}

const existeProductoPorId = async(id) => {
    const existProducto = await Producto.findById(id);
    if (!existProducto) {
        throw new Error(`El ID ${id} no existe`);
    }
}

const validarColeccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no esta permitida - ${colecciones}`)
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    validarColeccionesPermitidas
}