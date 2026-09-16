const pool = require('../database/pool');
const { getAttractions } = require('../controllers/attractionController');


//an array of attractions will be be passed as an arguement
async function addAttractions(getAttractions) {
    const attractions = await getAttractions();
    for(const attraction of attractions){
        await pool.query(`
            INSERT INTO attractions (osm_id,name, type, location)
            VALUES ($1, $2, $3, ST_MAKEPOINT($4, $5)::geography)
            ON CONFLICT (osm_id) DO NOTHING`), [
                attraction.osm_id,
                attraction.name,
                attraction.type,
                attraction.lon,
                attraction.lat
            ]
    }
}

module.exports = { addAttractions };