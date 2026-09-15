async function getAttractions(lat,lon,rad){
    if (!lat || !lon || !rad){
        throw new Error("message: Need all three fields");
    }
    const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];
        for (let i = 0; i < OVERPASS_MIRRORS.length; i++) {
            try {
                const attractions = await fetch(OVERPASS_MIRRORS[i], {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json',
            'User-Agent': 'Tripper App (ayushxx01@gmail.com)'
        },
      body: `[out:json][timeout:25];
                (
                    node["tourism"="attraction"](around:${rad*1000},${lat},${lon});
                    node["tourism"="viewpoint"](around:${rad*1000},${lat},${lon});
                    node["natural"="waterfall"](around:${rad*1000},${lat},${lon});
                    node["natural"="hot_spring"](around:${rad*1000},${lat},${lon});
                    node["historic"="monument"](around:${rad*1000},${lat},${lon});
                    node["amenity"="place_of_worship"](around:${rad*1000},${lat},${lon});
                    node["place"="village"](around:${rad*1000},${lat},${lon});
                );
                out body;`
         });
             if(!attractions.ok){
     const errorText = await attractions.text();
    throw new Error(`Overpass API failed (status ${attractions.status}): ${errorText}`);
             }

    const data = await attractions.json(); //converts raw stream of data into json object
    const cleanedData = data.elements.map(el => ({
        name: el.tags.name || "Unknown",
        id: el.id,
        type: el.tags.tourism || el.tags.natural || el.tags.historic || el.tags.amenity || el.tags.place || "Unknown",
        lat: el.lat,
        lon: el.lon,
    }));
     return cleanedData;
    } catch (error) {
                console.error(`Error fetching from Overpass mirror ${OVERPASS_MIRRORS[i]}:`, error);
        }
            } 
            throw new Error("All Overpass mirrors failed. Please try again later.");  
    }
 

module.exports = { getAttractions };