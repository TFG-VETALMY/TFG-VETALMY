const BASE_URL = 'http://localhost:3000';

async function verify() {
    const endpoints = ['usuarios', 'mascotas', 'historial', 'vacunas', 'enfermedades', 'citas', 'chat', 'mensajes'];

    for (const endpoint of endpoints) {
        console.log(`\n--- [${endpoint.toUpperCase()}] ---`);
        try {
            const res = await fetch(`${BASE_URL}/${endpoint}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`Count: ${data.length}`);
                if (data.length > 0) {
                    console.log('Last record:', JSON.stringify(data[data.length - 1], null, 2));
                }
            } else {
                console.log(`Status: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

verify();
