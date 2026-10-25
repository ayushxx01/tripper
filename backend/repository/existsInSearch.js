const pool = require('../database/pool');

async function overpassExists(location,rad){
   const result = await pool.query(`
    SELECT EXISTS (
    SELECT 1
    FROM cached_itineraries
    WHERE LOWER(location_name) = LOWER($1) AND radius >= $2)
    `, [location, rad]);
    
    if(result.rows[0].exists){
       return true;
    }
    return false;
}



async function existsInSearch(location, rad,days){
   const result = await pool.query(`
    SELECT EXISTS (
    SELECT 1
    FROM cached_itineraries
    WHERE LOWER(location_name) = LOWER($1) AND radius = $2 AND days = $3)
    `, [location, rad,days]);
    
    if(result.rows[0].exists){
       return true;
    }
    return false;
   
}

module.exports = {
    overpassExists,
    existsInSearch
};
