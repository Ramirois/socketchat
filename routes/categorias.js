const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearCategoria,
    obtenerCategorias,
    obetenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/bd-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');



const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias)


//obtener unacategorias por ID - publico
router.get('/:id', [
    check('id', 'No es un ID válido de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obetenerCategoria)


//crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    actualizarCategoria)

//eliminar categoria - privado - cualquier persona con un token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria)


module.exports = router;