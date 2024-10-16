import ldap from 'ldapjs';
import express from 'express';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json()); // Para procesar solicitudes JSON

// Configuración del cliente LDAP
const client = ldap.createClient({
    url: process.env.LDAP_URL
});

// Función de autenticación LDAP
function authenticate(username, password, callback) {
    const userDN = `CN=${username},${process.env.LDAP_BASE_DN}`;

    // Intentar la conexión con las credenciales del usuario
    client.bind(userDN, password, (err) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, `Usuario ${username} autenticado exitosamente.`);
        }
    });
}

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    // Llamar a la función de autenticación
    authenticate(username, password, (err, success) => {
        if (err) {
            return res.status(401).json({ message: 'Error de autenticación' });
        } else {
            return res.status(200).json({ message: success });
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});