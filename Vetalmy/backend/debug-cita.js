const BASE_URL = 'http://localhost:3000';

async function test() {
    const unique = Date.now();

    async function post(path, body) {
        console.log(`POST ${path}...`);
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) {
            console.error(`❌ ERROR ${res.status}:`, JSON.stringify(data, null, 2));
            return null;
        }
        console.log(`✅ SUCCESS: ID ${data.id}`);
        return data;
    }

    const u = await post('/usuarios', { nombre: 'Test', apellido1: 'User', email: `test${unique}@ok.com`, contrasenia: '123456' });
    if (!u) return;

    const m = await post('/mascotas', { nombre: 'Doggo', animal: 'Dog', usuarioId: u.id });
    if (!m) return;

    const h = await post('/historial', { mascotaId: m.id, observaciones: 'Test history' });
    if (!h) return;

    const c = await post('/citas', { fecha: new Date(), motivo: 'Test appointment', mascotaId: m.id, clienteId: u.id });
    if (c) console.log('Appointment created with ID:', c.id);
}

test();
