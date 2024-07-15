import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import ViewRouters from './routes/viewsRouters.route.js';
import { Server } from 'socket.io';

const app = express();
const PORT = 8080 || 3000

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', ViewRouters);

const httpServer = app.listen(PORT, () => {
    console.log('listo el server http');
})

const io = new Server(httpServer);
const conversacion = [];
const usuarios = [];

io.on('connection', (socket) => {

    socket.on('mensaje', (data) => {
        conversacion.push(data);
        io.emit('conversacion', conversacion);
    })

    socket.on('nuevoUsuario', (nuevoUsuario) => {
        usuarios.push(nuevoUsuario)
        socket.emit('conversacion', conversacion);
        io.emit('conectados', usuarios);
    })

    socket.on('disconect', usuario => {
        //falta buscar usuario y borrarlo cuando se desconecta
    })

})