const { Client } = require('pg');
const client = new Client({ user: 'admin', password: 'admin', host: '127.0.0.1', port: 5436, database: 'vet_db' });
client.connect()
  .then(() => client.query("UPDATE usuarios SET rol = 'veterinario' WHERE email = 'testuser@vetalmy.com'"))
  .then(res => { console.log('Update result:', res.rowCount); client.end(); })
  .catch(err => { console.error(err); client.end(); });
