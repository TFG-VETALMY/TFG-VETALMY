const BASE_URL = 'http://localhost:3000';

async function createCita() {
    const body = {
        fecha: "2026-03-05T10:00:00.000Z",
        tipo: "Revisión",
        motivo: "Manual check via script",
        mascotaId: 7,
        clienteId: 10
    };

    console.log('Enviando:', JSON.stringify(body));
    const res = await fetch(`${BASE_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('Respuesta:', JSON.stringify(data, null, 2));
}

createCita();
