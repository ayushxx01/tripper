const { geoService } = require('./geoService');
const addInSearchHistory = require('../repository/addInSearchHistory');
const existsInSearch = require('../repository/existsInSearch');
const insertAttraction = require('../repository/insertAttraction');
const fetchAttractions = require('../repository/fetchAttractions');
const callOverpass = require('./overpass');


async function orchestrator(location,rad,days){
    //firstly we will add or not in the history will depend here
    const{lat,lon} = await addAttractions(location,rad);
    console.log(lat, lon);

    //added either way now we fetch attractios
    const res = await getAttractions(lat,lon,rad);
    console.log("attratctions" , res);

    //now we have an array of lat,lon we will send this object along with days
    const groups = await sendAttractions(res,days);
    console.log("groups" , groups);
    //now we have grouped lat lon based on days
    return groups;
}
//an array of attractions will be be passed as an arguement
async function addAttractions(location, rad) {
    if(!location || !rad){
        throw new Error("Missing field");
    }
    const exists = await existsInSearch(location,rad); // Check for duplicates before proceeding
    const { lat, lon} = await geoService(location); // destructuring should follow same names as returned by geoService

    if(exists === true){
       return {lat,lon};
    } else {
        //add into search history
        addInSearchHistory(location,rad);
        //run fresh overpass query
        const attractions = await callOverpass(lat,lon,rad);
        for(const attraction of attractions){
            await insertAttraction(attraction);
        }
    }  
    return {lat,lon};  
}

async function getAttractions(lat,lon,rad){
    const attractions = await fetchAttractions(lat,lon,rad);
    return attractions;
}
//send [lat,lon]to flask
async function sendAttractions(locs,days){
   const obj = {
    points: locs,
    days:days
   }
    const ans = await fetch('http://localhost:5001/cluster', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'           
        },
        body: JSON.stringify(obj)
    });
    const data = await ans.json();
    return data;
}

module.exports = orchestrator;