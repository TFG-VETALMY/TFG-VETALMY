const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🚀 Starting API Verification Script...');

    let clienteId, veterinarioId, mascotaId, historialId, vacunaId, enfermedadId, citaId, chatId;

    // Helper for requests
    async function request(method, endpoint, body = null) {
        console.log(`\n🔹 [${method}] ${endpoint}`);
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${BASE_URL}${endpoint}`, options);

            // Handle response body safely
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text; // Return text if not JSON
            }

            console.log(`   Status: ${response.status}`);
            if (!response.ok) {
                console.error('   ❌ Error:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
                return null;
            }
            const preview = typeof data === 'object' ? JSON.stringify(data).substring(0, 100) + '...' : data.substring(0, 100);
            console.log(`   ✅ Success: ${preview}`);
            return data;
        } catch (error) {
            console.error('   ❌ Network/Script Error:', error);
            return null;
        }
    }

    // --- 1. USUARIOS ---
    console.log('\n--- 1. USUARIOS ---');
    // Crear Cliente
    const uniqueId = Date.now();
    const cliente = await request('POST', '/usuarios', {
        nombre: 'Pepe',
        apellido1: 'Test',
        apellido2: 'Apellido2', // Added to fix 500 error (Entity mismatch)
        email: `pepe${uniqueId}@test.com`,
        contrasenia: '123456',
        rol: 'Cliente'
    });
    if (cliente) clienteId = cliente.id;

    // Crear Veterinario
    const veterinario = await request('POST', '/usuarios', {
        nombre: 'Ana',
        apellido1: 'Test',
        apellido2: 'Apellido2', // Added to fix 500 error
        email: `ana${uniqueId}@test.com`,
        contrasenia: '123456',
        rol: 'Veterinario'
    });
    if (veterinario) veterinarioId = veterinario.id;

    // Get All
    await request('GET', '/usuarios');

    // (Usuarios Delete/Patch skipped as not in controller)

    if (!clienteId || !veterinarioId) {
        console.error('\n🛑 Critical: Failed to create users. Stopping script.');
        return;
    }

    // --- 2. MASCOTAS ---
    console.log('\n--- 2. MASCOTAS ---');
    // Crear Mascota
    const mascota = await request('POST', '/mascotas', {
        nombre: 'Firulais',
        animal: 'Perro',
        raza: 'Pastor Aleman',
        edad: 5,
        peso: 30,
        usuarioId: clienteId
    });
    if (mascota) mascotaId = mascota.id;

    // Get All
    await request('GET', '/mascotas');

    if (mascotaId) {
        // Get One
        await request('GET', `/mascotas/${mascotaId}`);
        // Modificar
        await request('PATCH', `/mascotas/${mascotaId}`, { peso: 32, nombre: 'Firulais Updated' });
        // Verificar cambio
        await request('GET', `/mascotas/${mascotaId}`);
        // NOTE: We do NOT delete yet, need it for history etc.
    }

    if (!mascotaId) {
        console.error('\n🛑 Critical: Failed to create pet. Stopping script.');
        return;
    }

    // --- 3. HISTORIAL ---
    console.log('\n--- 3. HISTORIAL ---');
    // Crear Historial
    const historial = await request('POST', '/historial', {
        mascotaId: mascotaId,
        observaciones: 'Historial inicial'
    });
    if (historial) historialId = historial.id;

    // Get All
    await request('GET', '/historial');

    if (historialId) {
        // Get One
        await request('GET', `/historial/${historialId}`);
        // Modificar
        await request('PATCH', `/historial/${historialId}`, { observaciones: 'Historial actualizado con notas' });
    }

    if (!historialId) {
        console.error('\n⚠️ Warning: Failed to create history. Skipping dependent steps.');
    } else {
        // --- 4. VACUNAS ---
        console.log('\n--- 4. VACUNAS ---');
        // Crear Vacuna
        const vacuna = await request('POST', '/vacunas', {
            nombre: 'Rabia',
            historialId: historialId,
            fecha_aplicacion: new Date().toISOString()
        });
        if (vacuna) vacunaId = vacuna.id;

        // Get All
        await request('GET', '/vacunas');

        if (vacunaId) {
            // Get One
            await request('GET', `/vacunas/${vacunaId}`);
            // Modificar
            await request('PATCH', `/vacunas/${vacunaId}`, { nombre: 'Rabia (Booster)' });
            // Borrar
            await request('DELETE', `/vacunas/${vacunaId}`);
        }

        // --- 5. ENFERMEDADES ---
        console.log('\n--- 5. ENFERMEDADES ---');
        // Crear Enfermedad
        const enfermedad = await request('POST', '/enfermedades', {
            observaciones: 'Otitis leve',
            historialId: historialId,
            veterinarioId: veterinarioId,
            fecha_alta: new Date().toISOString()
        });
        if (enfermedad) enfermedadId = enfermedad.id;

        // Get All
        await request('GET', '/enfermedades');

        if (enfermedadId) {
            // Get One
            await request('GET', `/enfermedades/${enfermedadId}`);
            // Modificar
            await request('PATCH', `/enfermedades/${enfermedadId}`, { observaciones: 'Otitis curada' });
            // Borrar
            await request('DELETE', `/enfermedades/${enfermedadId}`);
        }
    }

    // --- 6. CITAS ---
    console.log('\n--- 6. CITAS ---');
    // Crear Cita
    const cita = await request('POST', '/citas', {
        fecha: new Date().toISOString(),
        motivo: 'Revisión anual',
        mascotaId: mascotaId,
        clienteId: clienteId
    });
    if (cita) citaId = cita.id;

    // Get All
    await request('GET', '/citas');

    if (citaId) {
        // Get One
        await request('GET', `/citas/${citaId}`);
        // Modificar
        await request('PATCH', `/citas/${citaId}`, { motivo: 'Revisión anual (Urgente)' });
        // Borrar
        await request('DELETE', `/citas/${citaId}`);
    }

    // --- 7. CHAT & MENSAJES ---
    console.log('\n--- 7. CHAT & MENSAJES ---');
    // Crear Chat
    const chat = await request('POST', '/chat', {
        clienteId: clienteId,
        veterinarioId: veterinarioId,
        estado: 'Abierto'
    });
    if (chat) chatId = chat.id;

    // Get All
    await request('GET', '/chat');

    if (chatId) {
        // Enviar Mensaje
        await request('POST', '/mensajes', {
            mensaje: 'Hola doctor, tengo una consulta.',
            chatId: chatId,
            usuarioId: clienteId
        });

        // Get All Messages
        await request('GET', '/mensajes');
    }

    // --- 8. LIMPIEZA FINAL ---
    console.log('\n--- 8. LIMPIEZA FINAL ---');
    if (mascotaId) {
        // Expecting this to delete cascade history -> vaccines/diseases if configured, but let's just delete pet
        await request('DELETE', `/mascotas/${mascotaId}`);
    }
    // Usuarios no tienen endpoint delete, se quedan en DB
    console.log('⚠️ Nota: Usuarios no borrados (falta endpoint DELETE /usuarios/:id)');

    console.log('\n✅ Script Finalizado.');
}

runTests();
