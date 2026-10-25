const pool = require('../database/pool');

async function addCache(location, rad, days, result){
        await pool.query(`
        INSERT INTO cached_itineraries (location_name,radius,days,result)
        VALUES ($1, $2, $3, $4::jsonb)`, [location, rad, days, JSON.stringify(result)]);
}

module.exports = addCache;