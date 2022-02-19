const path = require('path')
const fs = require('fs');

const { response, request } = require("express");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo, seleccionarColeccion } = require("../helpers");


const cargarArchivo = async(req = request, res = response) => {


    try {
        const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre: pathCompleto
        })

    } catch (msg) {
        res.status(400).json({ msg });
    }


}

// const actualizarImagen = async(req = request, res = response) => {
//     const { id, coleccion } = req.params;

//     let modelo = await seleccionarColeccion(res, id, coleccion);

//     //Eliminar imagen anterior
//     if (modelo.img) {
//         const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
//         if (fs.existsSync(pathImagen)) {
//             fs.unlinkSync(pathImagen);
//         }
//     }

//     const pathCompleto = await subirArchivo(req.files, undefined, coleccion);
//     modelo.img = pathCompleto;

//     await modelo.save();


//     res.json({ modelo })
// }



const actualizarImagenCloudinary = async(req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo = await seleccionarColeccion(res, id, coleccion);

    //Eliminar imagen anterior
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }


    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();


    res.json(modelo);

}








const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo = seleccionarColeccion(res, id, coleccion);

    //Mostrar imagen
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    //Mostrar placeholder
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    }



}



module.exports = {
    cargarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary
}