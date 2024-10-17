const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors
const app = express();

// configuracion de cors
app.use(cors({
    origin:    '*',  
    methods: 'GET,POST', 
    allowedHeaders: 'Content-Type', 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configuracion con el dominio de la maquina con el puerto configurado
const LDAP_URL = 'ldap://infosecure.com';

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Usuario y contraseña son requeridos.');
    }


    const client = ldap.createClient({
        url: LDAP_URL
    });
    console.log(`Usuario: ${username}, Contraseña: ${password}`);
    const userDN = `INFOSECURE0\\${username}`; 

    console.log("usuario ", userDN)

    // se autentica el usuario
    client.bind(userDN, password, (err) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return res.status(403).send({mensage:'Credenciales inválidas.'});
        }

        res.status(200).send({mensaje:'Autenticación exitosa'});
        
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
