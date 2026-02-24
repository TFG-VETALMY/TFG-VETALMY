const BASE_URL = 'http://localhost:3000';

async function proSeed() {
    console.log('💎 Iniciando Población Ultra-Profesional...');

    const unique = Date.now();

    async function req(method, path, body) {
        process.stdout.write(`   [${method}] ${path}... `);
        try {
            const res = await fetch(`${BASE_URL}${path}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = text; }

            if (!res.ok) {
                console.log(`❌ ERROR ${res.status}`);
                console.error('      Detalles:', typeof data === 'object' ? JSON.stringify(data) : data);
                return null;
            }
            console.log(`✅ OK (ID: ${data.id || 'N/A'})`);
            return data;
        } catch (e) {
            console.log(`💥 CRASH: ${e.message}`);
            return null;
        }
    }

    // --- 1. Usuarios ---
    console.log('\n--- USUARIOS ---');
    const v1 = await req('POST', '/usuarios', { nombre: 'Vet1', apellido1: 'Test', email: `v1_${unique}@test.com`, contrasenia: '123456', rol: 'Veterinario' });
    const c1 = await req('POST', '/usuarios', { nombre: 'Cli1', apellido1: 'Test', email: `c1_${unique}@test.com`, contrasenia: '123456', rol: 'Cliente' });

    if (!v1 || !c1) return;

    // --- 2. Mascotas ---
    console.log('\n--- MASCOTAS ---');
    const m1 = await req('POST', '/mascotas', { nombre: 'Max', animal: 'Dog', usuarioId: c1.id });

    if (!m1) return;

    // --- 3. Historial ---
    console.log('\n--- HISTORIAL ---');
    const h1 = await req('POST', '/historial', { mascotaId: m1.id, observaciones: 'Historial de Max' });

    if (!h1) return;

    // --- 4. Citas ---
    console.log('\n--- CITAS ---');
    // Using explicit ISO string for date
    await req('POST', '/citas', {
        fecha: new Date().toISOString(),
        tipo: 'Revisión',
        motivo: 'Chequeo general en seed',
        mascotaId: m1.id,
        clienteId: c1.id
    });

    // --- 5. Vacunas ---
    console.log('\n--- VACUNAS ---');
    await req('POST', '/vacunas', {
        nombre: 'Parvovirus',
        historialId: h1.id,
        fecha_aplicacion: new Date().toISOString().split('T')[0]
    });

    // --- 6. Enfermedades ---
    console.log('\n--- ENFERMEDADES ---');
    await req('POST', '/enfermedades', {
        observaciones: 'Alergia estacional',
        historialId: h1.id,
        veterinarioId: v1.id,
        fecha_diagnostico: new Date().toISOString().split('T')[0]
    });

    console.log('\n💎 Fin del proceso de población.');
}

proSeed();
