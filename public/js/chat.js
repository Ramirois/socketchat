let usuario = null;
let socket = null;

//html referencias

const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensaje = document.querySelector('#ulMensaje')
const btnSalir = document.querySelector('#btnSalir')

const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8080/api/auth/' :
    'https://socketchatpui.herokuapp.com/api/auth/'


const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });



    socket.on('recibir-mensaje', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
    });
}


const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';

    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
            <h5 class="text-success">${nombre}</h5>
            <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { uid, mensaje });

    txtMensaje.value = '';

})

const dibujarMensajes = (mensajes = []) => {
    let mensajeHtml = '';

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajeHtml += `
        <li>
            <p>
            <span class="text-primary">${nombre}: </span>
            <span>${mensaje}</span>
            </p>
        </li>
        `;
    });
    ulMensaje.innerHTML = mensajeHtml;
}

const main = async() => {

    //validar JWT

    await validarJWT();

}






main();
