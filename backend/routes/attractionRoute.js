const router = require("express").Router();
const { getAttractionsData } = require("../controllers/attractionController");

router.post("/get-attractions", getAttractionsData);

module.exports = router;