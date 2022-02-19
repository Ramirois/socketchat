const express = require("express");
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require("../databases/config");
const { socketController } = require("../socket/controller");

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            usuario: '/api/usuarios',
            productos: '/api/productos',
            uploads: '/api/uploads'
        }

        //Conexion a la base de datos
        this.conectarDB();

        //middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();

        //socket.io
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //CORs
        this.app.use(cors());

        //lectura y parseo del body

        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));

        // FileUpload - carga de archivos 
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));

        this.app.use(this.paths.usuario, require('../routes/user'));

        this.app.use(this.paths.categorias, require('../routes/categorias'));

        this.app.use(this.paths.productos, require('../routes/productos'));

        this.app.use(this.paths.buscar, require('../routes/buscar'));

        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('el servidor esta escuchando en el puerto', this.port);
        })
    }

}

module.exports = Server