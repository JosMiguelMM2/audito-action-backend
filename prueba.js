const ldap = require('ldapjs');

// Configuración de los parámetros del servidor LDAP y las credenciales del usuario
const username = 'csuescun'; // Nombre de usuario que deseas verificar
const password = 'cliente2024*'; // Contraseña que deseas verificar

// Crear cliente LDAP
const client = ldap.createClient({
    url: 'ldap://infosecure.com:389' // URL del servidor LDAP
});

// Función para autenticar el usuario
function authenticate(username, password, callback) {
    // Construir el DN del usuario (Distinguished Name)
    const userDN = `CN=${username},DC=INFOSECURE,DC=COM`; // DN basado en el nombre de usuario y el dominio

    // Intentar enlazar (bind) usando las credenciales del usuario
    client.bind(userDN, password, (err) => {
        if (err) {
            callback(err, null); // Error en la autenticación
        } else {
            callback(null, `Credenciales correctas para el usuario: ${username}`); // Autenticación exitosa
        }
    });
}

// Llamar a la función de autenticación
authenticate(username, password, (err, result) => {
    if (err) {
        console.log(`Credenciales incorrectas para el usuario: ${username}`);
    } else {
        console.log(result);
    }

    // Cerrar la conexión con el servidor LDAP
    client.unbind();
});
