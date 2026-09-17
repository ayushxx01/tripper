const {addAttractions}= require('../services/addAttraction');
const asyncHandler = require('express-async-handler');
const phase1controller = asyncHandler(async (req, res) => {
    //take loc and radius from rq.body
    const {location, radius} = req.body;

    try {
    await addAttractions(location, radius);
    res.status(200).json("Synced succesfully");
    } catch (errors){
        res.status(500).json({message: errors.message});
    }

});

module.exports = phase1controller;