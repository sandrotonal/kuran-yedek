async function checkApi() {
    try {
        const response = await fetch('http://api.aladhan.com/v1/asmaAlHusna');
        const json = await response.json();
        const data = json.data;

        const fs = require('fs');
        const list = data.map(i => `${i.number}: ${i.transliteration} (${i.name})`).join('\n');
        fs.writeFileSync('api_names.txt', list);
        console.log("Dumped keys to api_names.txt");
    } catch (error) {
        console.error(error);
    }
}

checkApi();
