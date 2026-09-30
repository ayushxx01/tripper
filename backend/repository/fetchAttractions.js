const pool = require('../database/pool');

//fetches locations which lies under the specificed radius
async function fetchAttractions(lat, lon, rad) {
    const result = await pool.query(
        `SELECT ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lon
         FROM attractions
         WHERE ST_DWithin(location, ST_MakePoint($1,$2)::geography, $3)`,
        [lon, lat, rad * 1000]
    );
    return result.rows.map(row => [row.lat, row.lon]);
}

module.exports = fetchAttractions;