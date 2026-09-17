const pool = require('../database/pool');
const { geoService } = require('./geoService');
const { getAttractions } = require('./overpass');


//an array of attractions will be be passed as an arguement
async function addAttractions(location, rad) {

    const { lat, lon} = await geoService(location); // destructuring should follow same names as returned by geoService
    const attractions = await getAttractions(lat,lon,rad);
    for(const attraction of attractions){
        await pool.query(`
            INSERT INTO attractions (osm_id,name, type, location)
            VALUES ($1, $2, $3, ST_MAKEPOINT($4, $5)::geography)
            ON CONFLICT (osm_id) DO NOTHING`, [
                attraction.id,
                attraction.name,
                attraction.type,
                attraction.lon,
                attraction.lat
            ]);  
}
}

module.exports = { addAttractions };