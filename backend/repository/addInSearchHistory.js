const {pool} = require('../database/pool');

async function addInSearchHistory(location, rad){
        await pool.query(`
        INSERT INTO search_history (location_name,radius_metres)
        VALUES ($1, $2)`, [location, rad]);
}

module.exports = addInSearchHistory;