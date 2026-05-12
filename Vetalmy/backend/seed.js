const apiUrl = 'http://localhost:3000/api';

async function request(method, path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    const error = await response.text();
    console.error(`Error ${method} ${path}:`, error);
    throw new Error(error);
  }
  return response.json();
}

async function runSeed() {
  try {
    console.log("Creando veterinario...");
    const vet = await request('POST', '/usuarios', {
      nombre: 'Ricardo',
      apellido1: 'Méndez',
      email: 'vet@admin.com',
      contrasenia: '123456',
      rol: 'veterinario'
    });
    console.log("Veterinario creado:", vet.id);

    console.log("Creando cliente...");
    const cliente = await request('POST', '/usuarios', {
      nombre: 'Juan',
      apellido1: 'Pérez',
      email: 'juan@cliente.com',
      contrasenia: '123456',
      rol: 'cliente'
    });
    console.log("Cliente creado:", cliente.id);

    console.log("Creando mascota...");
    const mascota = await request('POST', '/mascotas', {
      nombre: 'Max',
      animal: 'Perro',
      raza: 'Golden Retriever',
      edad: 3,
      peso: 25,
      usuarioId: cliente.id
    });
    console.log("Mascota creada:", mascota.id);

    console.log("Creando citas...");
    // Cita 1: Mañana a las 10:30
    const fecha1 = new Date();
    fecha1.setDate(fecha1.getDate() + 1);
    fecha1.setHours(10, 30, 0, 0);
    
    await request('POST', '/citas', {
      fecha: fecha1.toISOString(),
      tipo: 'Revisión',
      motivo: 'Chequeo General',
      mascotaId: mascota.id,
      clienteId: cliente.id
    });

    // Cita 2: Pasado mañana a las 16:00
    const fecha2 = new Date();
    fecha2.setDate(fecha2.getDate() + 2);
    fecha2.setHours(16, 0, 0, 0);

    await request('POST', '/citas', {
      fecha: fecha2.toISOString(),
      tipo: 'Vacunación',
      motivo: 'Vacuna anual',
      mascotaId: mascota.id,
      clienteId: cliente.id
    });

    console.log("¡Base de datos rellenada con éxito!");
  } catch (error) {
    console.error("Fallo al rellenar la bbdd:", error.message);
  }
}

runSeed();
