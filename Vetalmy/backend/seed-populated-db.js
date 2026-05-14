const BASE_URL = 'http://localhost:3000';

async function seed() {
    console.log('🌟 Iniciando Población Profesional de Base de Datos - Vetalmy');

    const unique = Date.now();

    async function req(method, path, body) {
        try {
            const res = await fetch(`${BASE_URL}${path}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });
            if (!res.ok) {
                const err = await res.text();
                console.error(`❌ Error en ${path}: ${res.status}`, err);
                return null;
            }
            return await res.json();
        } catch (e) {
            console.error(`💥 Error de red en ${path}:`, e.message);
            return null;
        }
    }

    // 1. USUARIOS (Veterinarios y Clientes)
    console.log('👥 Creando usuarios...');
    const vet1 = await req('POST', '/usuarios', {
        nombre: 'Dr. Alejandro', apellido1: 'Smith', apellido2: 'Pérez',
        email: `alejandro.smith${unique}@vetalmy.com`, contrasenia: 'vet2026', rol: 'Veterinario'
    });
    const vet2 = await req('POST', '/usuarios', {
        nombre: 'Dra. Beatriz', apellido1: 'Taylor', apellido2: 'Luna',
        email: `beatriz.taylor${unique}@vetalmy.com`, contrasenia: 'vet2026', rol: 'Veterinario'
    });
    const cli1 = await req('POST', '/usuarios', {
        nombre: 'Carlos', apellido1: 'Rodríguez', apellido2: 'Méndez',
        email: `carlos.rod${unique}@gmail.com`, contrasenia: 'cliente123', rol: 'Cliente'
    });
    const cli2 = await req('POST', '/usuarios', {
        nombre: 'Elena', apellido1: 'Martínez', apellido2: 'Sanz',
        email: `elena.mar${unique}@yahoo.es`, contrasenia: 'cliente123', rol: 'Cliente'
    });

    if (!vet1 || !cli1) {
        console.error('🛑 Error crítico creando usuarios base. Abortando.');
        return;
    }

    // 2. MASCOTAS
    console.log('🐾 Registrando mascotas...');
    const tobby = await req('POST', '/mascotas', {
        nombre: 'Tobby', animal: 'Perro', raza: 'Golden Retriever', edad: 4, peso: 28.5, usuarioId: cli1.id
    });
    const luna = await req('POST', '/mascotas', {
        nombre: 'Luna', animal: 'Gato', raza: 'Siamés', edad: 2, peso: 4.2, usuarioId: cli1.id
    });
    const sparky = await req('POST', '/mascotas', {
        nombre: 'Sparky', animal: 'Perro', raza: 'Beagle', edad: 6, peso: 12.0, usuarioId: cli2.id
    });

    // 3. HISTORIALES (Se crean al crear la mascota o manualmente)
    console.log('📂 Generando historiales médicos...');
    const hTobby = await req('POST', '/historial', {
        mascotaId: tobby.id, observaciones: 'Paciente muy dócil. Sin alergias conocidas.'
    });
    const hLuna = await req('POST', '/historial', {
        mascotaId: luna.id, observaciones: 'Gato de interior. Dieta estricta de control de peso.'
    });
    const hSparky = await req('POST', '/historial', {
        mascotaId: sparky.id, observaciones: 'Antecedentes de otitis crónica en oreja derecha.'
    });

    // 4. VACUNAS
    console.log('💉 Aplicando vacunas...');
    await req('POST', '/vacunas', {
        nombre: 'Rabia Anual', descripción: 'Refuerzo cepa 2026', periodicidad: 'Anual',
        fecha_aplicacion: new Date('2026-01-15').toISOString().split('T')[0], historialId: hTobby.id
    });
    await req('POST', '/vacunas', {
        nombre: 'Parvovirus', descripción: 'Protección gastrointestinal', periodicidad: 'Bianual',
        fecha_aplicacion: new Date('2025-11-20').toISOString().split('T')[0], historialId: hTobby.id
    });
    await req('POST', '/vacunas', {
        nombre: 'Triple Viral Felina', descripción: 'Caldivirus, Panleucopenia, Rinotraqueitis', periodicidad: 'Anual',
        fecha_aplicacion: new Date('2026-02-01').toISOString().split('T')[0], historialId: hLuna.id
    });

    // 5. ENFERMEDADES (Diagnósticos previos)
    console.log('🩺 Diagnosticando patologías...');
    await req('POST', '/enfermedades', {
        observaciones: 'Otitis externa bacteriana grave', historialId: hSparky.id,
        veterinarioId: vet1.id, fecha_diagnostico: new Date('2026-02-10').toISOString().split('T')[0],
        fecha_alta: new Date('2026-02-20').toISOString().split('T')[0]
    });

    // 6. CITAS
    console.log('📅 Agendando citas pendientes...');
    await req('POST', '/citas', {
        fecha: new Date('2026-03-05T10:00:00Z'), tipo: 'Revisión',
        motivo: 'Control post-tratamiento otitis', mascotaId: sparky.id,
        clienteId: cli2.id, veterinarioId: vet1.id
    });
    await req('POST', '/citas', {
        fecha: new Date('2026-03-10T11:30:00Z'), tipo: 'Vacunación',
        motivo: 'Refuerzo Leishmaniasis', mascotaId: sparky.id,
        clienteId: cli2.id, veterinarioId: vet2.id
    });

    // 7. CHAT Y MENSAJES
    console.log('💬 Iniciando conversaciones de prueba...');
    const chat = await req('POST', '/chat', {
        clienteId: cli1.id, veterinarioId: vet1.id, estado: 'Abierto'
    });
    if (chat) {
        await req('POST', '/mensajes', {
            mensaje: 'Hola Dr. Alejandro, ¿cuándo puedo pasar a recoger los resultados de Tobby?',
            chatId: chat.id, usuarioId: cli1.id
        });
        await req('POST', '/mensajes', {
            mensaje: 'Buenas tardes Carlos, ya los tengo listos. Puedes pasar mañana a partir de las 9:00.',
            chatId: chat.id, usuarioId: vet1.id
        });
    }

    console.log('\n✅ Base de datos poblada profesionalmente.');
    console.log('📊 Resumen: 4 Usuarios, 3 Mascotas, 3 Historiales, 3 Vacunas, 1 Enfermedad, 2 Citas, 1 Chat.');
}

seed();
