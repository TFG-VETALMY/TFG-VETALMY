const { Client } = require('pg');

const usersToCreate = [
  { nombre: 'Laura', apellido1: 'Gómez', email: 'laura.gomez@vetalmy.com', contrasenia: '123456', rol: 'veterinario' },
  { nombre: 'Carlos', apellido1: 'Ruiz', email: 'carlos.ruiz@vetalmy.com', contrasenia: '123456', rol: 'veterinario' },
  { nombre: 'Marta', apellido1: 'Sánchez', email: 'marta.sanchez@ejemplo.com', contrasenia: '123456', rol: 'cliente' },
  { nombre: 'Jorge', apellido1: 'López', email: 'jorge.lopez@ejemplo.com', contrasenia: '123456', rol: 'cliente' }
];

async function seed() {
  const db = new Client({ user: 'admin', password: 'admin', host: '127.0.0.1', port: 5436, database: 'vet_db' });
  await db.connect();

  console.log('--- Insertando usuarios ---');
  for (const user of usersToCreate) {
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: user.nombre,
          apellido1: user.apellido1,
          email: user.email,
          contrasenia: user.contrasenia,
          rol: 'cliente' // The API might not accept 'rol' in register by default, but let's try.
        })
      });
      
      if (res.ok) {
        console.log(`Usuario registrado vía API: ${user.email} (Contraseña: ${user.contrasenia})`);
        // If they need to be veterinario, update in DB directly
        if (user.rol === 'veterinario') {
           await db.query(`UPDATE usuarios SET rol = 'veterinario' WHERE email = $1`, [user.email]);
           console.log(` -> Rol actualizado a veterinario en DB para: ${user.email}`);
        }
      } else {
        console.log(`El usuario ${user.email} probablemente ya existe.`);
      }
    } catch (e) {
      console.log(`Error con ${user.email}:`, e.message);
    }
  }

  await db.end();
  console.log('--- Proceso terminado ---');
}

seed();
