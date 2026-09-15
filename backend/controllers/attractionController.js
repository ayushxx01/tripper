const asyncHandler = require("express-async-handler");

const {getAttractions} = require("../services/overpass");

const getAttractionsData = asyncHandler(async(req,res)=> {
        const {lat,lon,rad} = req.body;
        const attractions = await getAttractions(lat,lon,rad);
        res.status(200).json(attractions);
 
});

module.exports = { getAttractionsData };