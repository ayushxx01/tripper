//only the functions that directly touches the db we put in repo
const {pool} = require('../database/pool');

async function addAttractions(attraction){
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

module.exports = addAttractions;