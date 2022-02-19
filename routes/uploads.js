const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El ID tiene que ser de Mongo').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El ID tiene que ser de Mongo').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)



module.exports = router;