const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🚀 Reiniciando Smoke Test CRUD...');

    let clienteId, veterinarioId, mascotaId, historialId, vacunaId, enfermedadId, citaId, chatId;

    async function request(method, endpoint, body = null) {
        console.log(`\n🔹 [${method}] ${endpoint}`);
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = text; }

            console.log(`   Status: ${response.status}`);
            if (!response.ok) {
                console.error(`   ❌ Fallo: ${response.status} ${response.statusText}`);
                return null;
            }
            const preview = typeof data === 'object' ? JSON.stringify(data).substring(0, 100) + '...' : String(data).substring(0, 100);
            console.log(`   ✅ Éxito: ${preview}`);
            return data;
        } catch (error) {
            console.error('   ❌ Error:', error.message);
            return null;
        }
    }

    console.log('\n--- 1. USUARIOS ---');
    const unique = Date.now();
    const vet = await request('POST', '/usuarios', {
        nombre: 'Juan', apellido1: 'Vet', apellido2: 'Test',
        email: `juan${unique}@vet.com`, contrasenia: '123456', rol: 'Veterinario'
    });
    if (vet) veterinarioId = vet.id;

    const cli = await request('POST', '/usuarios', {
        nombre: 'Maria', apellido1: 'Cli', apellido2: 'Test',
        email: `maria${unique}@cli.com`, contrasenia: '123456', rol: 'Cliente'
    });
    if (cli) clienteId = cli.id;

    console.log('\n--- 2. MASCOTAS ---');
    if (clienteId) {
        const pet = await request('POST', '/mascotas', {
            nombre: 'Rex', animal: 'Perro', raza: 'Pastor Aleman',
            edad: 3, peso: 25, usuarioId: clienteId
        });
        if (pet) mascotaId = pet.id;
    }

    console.log('\n--- 3. HISTORIAL ---');
    if (mascotaId) {
        const hist = await request('POST', '/historial', {
            mascotaId: mascotaId, observaciones: 'Perro sano, alergia leve al pollo'
        });
        if (hist) historialId = hist.id;
    }

    console.log('\n--- 4. VACUNAS ---');
    if (historialId) {
        const vac = await request('POST', '/vacunas', {
            nombre: 'Vacuna Rabia', historialId: historialId, fecha_aplicacion: new Date()
        });
        if (vac) vacunaId = vac.id;
    }

    console.log('\n--- 5. ENFERMEDADES ---');
    if (historialId && veterinarioId) {
        const enf = await request('POST', '/enfermedades', {
            observaciones: 'Otitis externa', historialId: historialId,
            veterinarioId: veterinarioId, fecha_alta: new Date()
        });
        if (enf) enfermedadId = enf.id;
    }

    console.log('\n--- 6. CITAS ---');
    if (mascotaId && clienteId) {
        const cita = await request('POST', '/citas', {
            fecha: new Date(), motivo: 'Vacunación',
            mascotaId: mascotaId, clienteId: clienteId
        });
        if (cita) citaId = cita.id;
    }

    console.log('\n--- 7. CHAT ---');
    if (clienteId && veterinarioId) {
        const ch = await request('POST', '/chat', {
            clienteId, veterinarioId, estado: 'Abierto'
        });
        if (ch) {
            chatId = ch.id;
            await request('POST', '/mensajes', {
                mensaje: 'Hola Dr. Juan...', chatId: chatId, usuarioId: clienteId
            });
        }
    }

    console.log('\n--- 8. PRODUCTOS & FACTURAS (404 Esperado) ---');
    await request('GET', '/productos');
    await request('GET', '/facturas');

    console.log('\n--- 9. LIMPIEZA ---');
    if (citaId) await request('DELETE', `/citas/${citaId}`);
    if (vacunaId) await request('DELETE', `/vacunas/${vacunaId}`);
    if (enfermedadId) await request('DELETE', `/enfermedades/${enfermedadId}`);
    if (historialId) await request('DELETE', `/historial/${historialId}`);
    if (mascotaId) await request('DELETE', `/mascotas/${mascotaId}`);
    if (veterinarioId) await request('DELETE', `/usuarios/${veterinarioId}`);
    if (clienteId) await request('DELETE', `/usuarios/${clienteId}`);

    console.log('\n✅ Proceso completado.');
}

runTests();
