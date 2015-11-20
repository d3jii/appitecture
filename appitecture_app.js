
var fs = require("fs"),
	appitecture = require("./lib/a.js").appitecture; 
var data = fs.readFileSync("appitecture.apt");
var next_line_delimiter = "\n";
var route_strings = "";
var dir_base = "./";  
//Must set text before calling appitecture.parser();
appitecture.text = data.toString();
var parsed_data = appitecture.parser();
appitecture.route_parser(parsed_data,appitecture.config_options);
fs.writeFileSync("routes.js",JSON.stringify(parsed_data));