
const fetch = require('node-fetch');

async function testZeno() {
    const endpoints = [
        'https://api.zeno.fm/api/v2/stations',
        'https://api.zeno.fm/api/v2/stations/search',
        'https://api.zeno.fm/v1/stations',
        'https://new-api.zeno.fm/v3/stations',
    ];

    for (const url of endpoints) {
        try {
            console.log(`Testing ${url}...`);
            const res = await fetch(url);
            console.log(`Status: ${res.status}`);
            if (res.ok) {
                const data = await res.json();
                console.log('Success! Sample data:', JSON.stringify(data).slice(0, 200));
                break;
            }
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testZeno();
