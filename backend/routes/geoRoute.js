const express = require('express');
const router = express.Router();
const { getLocCoord } = require('../controllers/geoController');

router.post('/get-coordinates', getLocCoord);


module.exports = router;