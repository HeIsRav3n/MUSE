
async function testRadioBrowser() {
    const url = 'https://de1.api.radio-browser.info/json/stations/search?name=zeno&limit=5';
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

testRadioBrowser();
