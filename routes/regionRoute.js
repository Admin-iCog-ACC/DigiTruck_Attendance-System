const express = require("express");
const regionController = require("../controllers/regionController");
const router = express.Router();

router.route("/").get(regionController.getAllRegions);
router.route("/:region").get(regionController.getRegion);
router.route("/refresh/all").get(regionController.refreshRegions);
router.patch("/:region", regionController.updateRegion);

module.exports = router;
