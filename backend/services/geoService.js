
//gets plain string and returns coordinates
async function geoService(location) {
    if(!location){
        throw new Error("Location is required");
    }//
    const encoded = encodeURIComponent(location);

    const loc = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
                {
            'headers': {'User-Agent': 'Tripper App (ayushxx01@gmail.com)'}
        }

    );
    const data = await loc.json();

    if(!data || data.length === 0){ 
        throw new Error("No coordinates found for the given location");
    }
    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);

    return {
        latitude: latitude,
        longitude: longitude
    }
}

module.exports = { geoService };