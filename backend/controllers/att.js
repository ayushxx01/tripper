const orchestrator = require('../services/attractions');
const asyncHandler = require('express-async-handler');
const phase1controller = asyncHandler(async (req, res) => {
    //take loc and radius from rq.body
    const {location,radius,days} = req.body;

    try {
    const groups= await orchestrator(location, radius,days);
   

    res.status(200).json({
        message: "Synced",
        groups
    });
    } catch (errors){
        res.status(500).json({message: errors.message});
    }

});

module.exports = phase1controller;