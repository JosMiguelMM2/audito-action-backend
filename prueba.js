const ldap = require('ldapjs');
const util = require('util');

// Configuración
const config = {
    url: 'ldap://infosecure.com:389',
    baseDN: 'DC=INFOSECURE,DC=COM',
    username: 'csuescun',
    password: 'cliente2024*'
};

// Crear cliente LDAP
const client = ldap.createClient({
    url: config.url,
    timeout: 5000,
    connectTimeout: 10000
});

// Promisificar funciones del cliente LDAP
const bindAsync = util.promisify(client.bind).bind(client);
const searchAsync = util.promisify(client.search).bind(client);

async function authenticate(username, password) {
    try {
        // Primero, buscamos el DN completo del usuario
        await bindAsync(config.username, config.password);
        
        const searchOptions = {
            filter: `(sAMAccountName=${username})`,
            scope: 'sub',
            attributes: ['dn']
        };

        const result = await searchAsync(config.baseDN, searchOptions);
        
        return new Promise((resolve, reject) => {
            result.on('searchEntry', (entry) => {
                const userDN = entry.objectName;
                // Intentamos autenticar con el DN encontrado y la contraseña proporcionada
                client.bind(userDN, password, (err) => {
                    if (err) {
                        reject(new Error(`Autenticación fallida para ${username}: ${err.message}`));
                    } else {
                        resolve(`Autenticación exitosa para ${username}`);
                    }
                });
            });
            
            result.on('error', (err) => {
                reject(new Error(`Error en la búsqueda: ${err.message}`));
            });
            
            result.on('end', (result) => {
                if (result.status !== 0) {
                    reject(new Error('Usuario no encontrado'));
                }
            });
        });
    } catch (error) {
        throw new Error(`Error de conexión o búsqueda: ${error.message}`);
    } finally {
        client.unbind();
    }
}

// Uso
authenticate(config.username, config.password)
    .then(console.log)
    .catch(console.error)
    .finally(() => process.exit());