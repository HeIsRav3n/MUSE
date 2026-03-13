const API_BASE = 'https://api.audius.co/v1';
const API_KEY = '0xae4d3e296787e296b704511d724e7fac088ce029';

async function test() {
    // get trending tracks
    const res = await fetch(`${API_BASE}/tracks/trending?app_name=MUSE`);
    const json = await res.json();
    const track = json.data[0];
    console.log("Track:", track.id, track.title);

    const streamUrl = `${API_BASE}/tracks/${track.id}/stream?app_name=MUSE`;
    console.log("Stream URL:", streamUrl);
    
    const streamRes = await fetch(streamUrl);
    console.log("Stream status:", streamRes.status, streamRes.statusText);
}

test();
