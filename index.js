#! /usr/bin/env node
var fs = require("fs"),
	appitecture = require("./lib/a.js").appitecture; 
var data = fs.readFileSync("appitecture.apt");
var route_strings = "";
var dir_base = "./";  
//Must set text before calling appitecture.parser();
if(data){
appitecture.text = data.toString();
var appi_data = appitecture.parser();
var parsed_data = appi_data.parsed_data;
appitecture.route_parser(parsed_data,appitecture.config_options,appi_data.controllers_dictionary);
fs.writeFileSync("routes.js",JSON.stringify(parsed_data));
}
else{
	console.log("No appitecture.apt file found in current directory");
}