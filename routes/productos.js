const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/bd-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');



const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerProductos);


//obtener unacategorias por ID - publico
router.get('/:id', [
    check('id', 'No es un ID válido de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerProducto);


//crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id válido de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto);

//eliminar categoria - privado - cualquier persona con un token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router;