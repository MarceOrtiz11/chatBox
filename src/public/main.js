console.log('Js desde el cliente')
const title = document.querySelector('#title-welcome');
const chatBox = document.querySelector('#send');
const socket = io();
let user = '';

Swal.fire({
    title: 'ingrese Nickname',
    input: 'text',
    text: 'Identificacion para ingresar al chat',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && 'ingresa un nick'
    }
}).then((result) => {
    user = result.value
    title.innerText = 'Bienvenido al chat ' + user
    socket.emit('nuevoUsuario', { user });

})


chatBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        console.log('HOLA')
        socket.emit('mensaje', { user, mensaje: event.target.value })
        chatBox.value = ''
    }
})

socket.on('conversacion', (data) => {
    const contenedorChat = document.querySelector('#contenedor-chat');
    contenedorChat.innerHTML = ''
    data.forEach(chat => {
        const div = document.createElement('div');
        const nombre = document.createElement('p');
        const mensaje = document.createElement('p');
        nombre.innerText = chat.user === user ? 'Yo: ' : chat.user + ': ';
        mensaje.innerText = chat.mensaje;
        div.appendChild(nombre);
        div.appendChild(mensaje);
        contenedorChat.appendChild(div);
    })
})

socket.on('conectados', (listaUsuarios) => {
    const conectadosContainer = document.querySelector('#conectados');
    conectadosContainer.innerHTML = '';
    listaUsuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.innerText = usuario.user === user ? user + ' - (Yo)' : usuario.user;
        conectadosContainer.appendChild(li);
    })
})

// window.addEventListener('beforeunload', () => {
//     socket.emit('disconect', {user})
// })