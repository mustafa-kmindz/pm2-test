"use strict";

const fs = require("fs");
const path = require("path");
const request = require("request");
const IncomingForm = require("formidable").IncomingForm;

// capture network variables from config.json
const configPath = path.join(process.cwd(), "config.json");
const configJSON = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(configJSON);

function getErrorMessage(err) {
	//print and return error
	console.log(err);
	var error = {};
	var message;
	if (err.message) {
		message = err.message;
	}
	if (err.endorsements) {
		message = err.endorsements[0].message;
	}
	error = { status: 0, message: message };
	return error;
}

async function uploadFile(req) {
	return new Promise(function (resolve, reject) {
		var form = new IncomingForm();
		form.parse(req, async function (_err, fields, files) {
			var path = files.file.path;
			const options = {
				method: "POST",
				uri: "http://" + config.ipfsIP + ":5001/api/v0/add",
				headers: {
					"Content-Type": "multipart/form-data",
				},
				formData: {
					file: fs.createReadStream(path),
				},
			};
			let result = await doRequest(options);
			if (result) {
				result = JSON.parse(result);
				if (!result.Hash) {
					reject("File Upload Error");
				} else {
					fields.hash = result.Hash;
					resolve(fields);
				}
			} else {
				reject("File Upload Error");
			}
		});
	});
}

async function doRequest(options) {
	return new Promise(function (resolve, reject) {
		request(options, function (error, res, body) {
			if (!error && res.statusCode === 200) {
				resolve(body);
			} else {
				reject(error);
			}
		});
	});
}

exports.upload_file = async function (req, res, _next) {
	try {
		const fields = await uploadFile(req);

		// Submit the specified transaction.
		console.log("\nSubmit " + " transaction with arguments: ", fields);
		res.send({
			status: 200,
			hash: fields.hash,
		});
	} catch (err) {
		const error = getErrorMessage(err);
		res.send(error);
	}
};

exports.download_file = async function (req, res, _next) {
	try {
		console.log("\Download " + " transaction: ");

		var username = req.params.username;
		var hash = req.params.hash;
		console.log("username " + username);
		console.log("hash " + hash);

		if(username!="user1") res.send("User NOT authorized");
// QmU6vRMUDi4ZmTgrCQj5QteufajggveimcCDofL2yuwytz
		else {
			res.setHeader("content-disposition", "attachment; filename=ttt.docx");         
			request("http://34.72.65.255:8080/ipfs/"+hash).pipe(res);
		}
	} catch (err) {
		const error = getErrorMessage(err);
		res.send(error);
	}
};

