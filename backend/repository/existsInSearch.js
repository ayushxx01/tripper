const {pool} = require('../database/pool');

async function existsInSearch(location,rad){
   const result = await pool.query(`
    SELECT EXISTS (
    SELECT 1
    FROM search_history
    WHERE LOWER(location_name) = LOWER($1) AND radius_metres <= $2)
    `, [location, rad]);
    
    if(result.rows[0].exists){
       return true;
    }
    return false;
}

module.exports = existsInSearch;