//talks ,sends and receives data from the service

const asyncHandler = require("express-async-handler");

const { geoService } = require("../services/geoService");

const getLocCoord = asyncHandler(async(req,res)=>{
    const {location} = req.body;
    const coordinates = await geoService(location);
    res.status(200).json(coordinates);
});


module.exports = { getLocCoord };