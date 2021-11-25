/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();

app.options("*", cors());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up a static file server that points to the "client" directory
app.use(express.static(__dirname));

app.use("/", require("./routes.js"));

// Save our port
var port = process.env.PORT || 8000;

// Start the server and listen on port
app.listen(port, function () {
	console.log("API Server listening on", port);
});
