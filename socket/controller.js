const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");

const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async(socket = new Socket, io) => {

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect();
    }
    //agregar Usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensaje', chatMensajes.ultimos10)

    //unir usuario a sala especial
    socket.join(usuario.id);

    //Limpiar usuario desconectado
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        console.log(uid);

        if (uid) {
            //mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimos10);
        }
    })

}


module.exports = {
    socketController
}