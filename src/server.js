const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors

const app = express();
app.use(cors({
    origin:    'ldap://infosecure.com',  //'http://exptech.local', // Permitir solicitudes desde este origen
    methods: 'GET,POST', // Métodos permitidos
    allowedHeaders: 'Content-Type', // Encabezados permitidos
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del servidor LDAP (modificar según tu dominio y servidor AD)
const LDAP_URL = 'ldap://INFOSECURE0.infosecure.com';
const LDAP_BASE_DN = 'dc=infosecure,dc=com';

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validación simple de entrada
    if (!username || !password) {
        return res.status(400).send('Usuario y contraseña son requeridos.');
    }

    // Crear un cliente LDAP
    const client = ldap.createClient({
        url: LDAP_URL
    });
    console.log(`Usuario: ${username}, Contraseña: ${password}`);
    const userDN = `infosecure\\${username}`; // Usar la barra invertida doble para escapar

    console.log("usuario ", userDN)
    // Intentar autenticar al usuario
    client.bind(userDN, password, (err) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return res.status(401).send({mensage:'Credenciales inválidas.'}); // Mensaje genérico
        }

        // Si la autenticación es exitosa
        res.status(200).send({mensaje:'Autenticación exitosa'});
        
        // Desconectar del cliente LDAP después de la autenticación
        client.unbind((unbindErr) => {
            if (unbindErr) {
                console.error('Error al desconectar del cliente LDAP:', unbindErr);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
