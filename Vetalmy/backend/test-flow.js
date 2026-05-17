const { Client } = require('pg');

async function runTest() {
  const db = new Client({ user: 'admin', password: 'admin', host: '127.0.0.1', port: 5436, database: 'vet_db' });
  await db.connect();

  const baseUrl = 'http://localhost:3000/api';
  const email = `vet_${Date.now()}@test.com`;
  
  console.log('1. Registrando veterinario...');
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Vet',
      apellido1: 'Test',
      email,
      contrasenia: 'password123',
      rol: 'user'
    })
  });
  
  console.log('2. Cambiando rol a veterinario en DB...');
  await db.query(`UPDATE usuarios SET rol = 'veterinario' WHERE email = $1`, [email]);
  
  console.log('3. Logueando...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' })
  }).then(r => r.json());
  
  const token = loginRes.token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  
  console.log('4. Creando mascota para la prueba...');
  const petRes = await fetch(`${baseUrl}/mascotas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ nombre: 'Doggo', animal: 'Perro', edad: 3, peso: 10, usuarioId: loginRes.user.id })
  }).then(r => r.json());
  const mascotaId = petRes.id;
  
  console.log('5. Creando cita...');
  const citaRes = await fetch(`${baseUrl}/citas`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fecha: new Date(Date.now() + 86400000).toISOString(),
      tipo: 'Revisión',
      motivo: 'Test',
      mascotaId,
      clienteId: loginRes.user.id,
      veterinarioId: loginRes.user.id
    })
  }).then(r => r.json());
  const citaId = citaRes.id;
  
  console.log('6. Verificando que aparece en listado activo...');
  let listRes = await fetch(`${baseUrl}/citas`, { headers }).then(r => r.json());
  console.log(` - Citas obtenidas: ${listRes.length}`);
  console.log(` - Estado de cita: ${listRes.find(c => c.id === citaId).estado}`);
  
  console.log('7. Completando la cita...');
  await fetch(`${baseUrl}/citas/${citaId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ estado: 'COMPLETADA' })
  }).then(r => r.text());
  
  console.log('8. Verificando historial...');
  listRes = await fetch(`${baseUrl}/citas`, { headers }).then(r => r.json());
  const citaCompletada = listRes.find(c => c.id === citaId);
  console.log(` - Estado final de la cita: ${citaCompletada.estado}`);
  
  if (citaCompletada.estado === 'COMPLETADA') {
    console.log('✅ TODO FUNCIONA CORRECTAMENTE EN FRONT Y BACKEND');
  }

  await db.end();
}

runTest().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
