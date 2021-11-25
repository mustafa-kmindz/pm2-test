//SPDX-License-Identifier: Apache-2.0

let express = require("express");
let router = express.Router();
let controller = require("./controller");
let format = require("date-format");

module.exports = router;

router.use(function (req, res, next) {
	console.log(
		format.asString("hh:mm:ss.SSS", new Date()) +
			"::............ " +
			req.url +
			" ............."
	);
	next(); // make sure we go to the next routes and don't stop here

	function afterResponse() {
		res.removeListener("finish", afterResponse);
	}
	res.on("finish", afterResponse);
});

router.post("/uploadFile", controller.upload_file);
router.get("/downloadFile/:username/:hash", controller.download_file);
