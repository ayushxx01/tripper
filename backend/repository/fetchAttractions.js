const {pool} = require('../database/pool');

//fetches locations which lies under the specificed radius
async function fetchAttractions(lat,lon,rad) {
    const result = await pool.query(
        `SELECT * FROM atrractions WHERE ST_Dwithin(
            location, ST_MakePoint($1,$2)::geography, $3)`, [lon, lat, rad]
    );

    return result.map(row => [row.lat,row.lon]); //only send lat n lon needed for flask
}

module.exports = fetchAttractions;