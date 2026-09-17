const router = require('express').Router();
const phase1controller = require('../controllers/att');

router.post("/phase1", phase1controller);

module.exports = router;