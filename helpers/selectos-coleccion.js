const { Usuario, Producto, Categoria } = require('../models')



const seleccionarColeccion = async(res, id, coleccion) => {
    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe el usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe el producto con el id ${id}`
                })
            }
            break;
        case 'categorias':
            modelo = await Categoria.findById(id);
            if (!modelo) {
                return res.status(500).json({
                    msg: `No existe la categoria con el id ${id}`
                })
            }
            break;

        default:
            res.status(500).json({ msg: 'Se me olvidó validar esto' })
            break;
    }

    return modelo;
}


module.exports = {
    seleccionarColeccion
}