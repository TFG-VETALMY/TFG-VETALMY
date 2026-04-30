const BASE_URL = 'http://localhost:3000';

async function clear() {
    console.log('🧹 Limpiando base de datos...');
    const endpoints = ['citas', 'vacunas', 'enfermedades', 'historial', 'mascotas', 'chat', 'mensajes', 'usuarios'];

    for (const e of endpoints) {
        try {
            const res = await fetch(`${BASE_URL}/${e}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                for (const item of data) {
                    await fetch(`${BASE_URL}/${e}/${item.id}`, { method: 'DELETE' });
                }
                console.log(`✅ ${e} eliminados.`);
            }
        } catch (err) {
            console.log(`⚠️ Error limpiando ${e}: ${err.message}`);
        }
    }
}

clear();
