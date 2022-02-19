class Mensaje {
    constructor(uid, nombre, mensaje) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes {
    constructor() {
        this.mensaje = [];
        this.usuarios = {}

    }

    get ultimos10() {
        this.mensaje = this.mensaje.splice(0, 10);
        return this.mensaje;
    }

    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    enviarMensaje(uid, nombre, mensaje) {
        this.mensaje.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario(usuario) {
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario(id) {
        delete this.usuarios[id];
    }
}



module.exports = ChatMensajes;