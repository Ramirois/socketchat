const bdValidators = require('../helpers/bd-validators');
const generarJTW = require('../helpers/generar-jwt');
const googleVerify = require('../helpers/google-verify');
const subirArchivo = require('../helpers/subir-archivo');
const seleccionarColeccion = require('../helpers/selectos-coleccion');

module.exports = {
    ...bdValidators,
    ...generarJTW,
    ...googleVerify,
    ...subirArchivo,
    ...seleccionarColeccion

}