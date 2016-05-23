#! /usr/bin/env node

var fs = require("fs"),
pth = require("path"),
commdr = require('commander'),
appitecture = require("./lib/a.js").appitecture,
getFiles = function(val){ return val.split(',');  },
pkg = fs.readFileSync(pth.join(__dirname, "package.json")),
platf = process.platform,
ext,
data;

process.on('uncaughtException', function(err){
	console.log(err.message);
       // console.log(err.stack);
    process.exit(0);
});

commdr
.version(pkg.version) 
.arguments('<files>')
.option('-d, --dir <basedir>', 'This option is to specify another base directory')
.action(function(files){

   // files[0] refers to .apt file & files[1] refers to .dir file 
	files = getFiles(files);

	var route_strings = "";
    var CR_LF;
	// dir_base can be modified 
	var dir_base = commdr.basedir || "./";

	if(dir_base.lastIndexOf("/") != dir_base.length-1){
		  dir_base += "/";
	}  

	try{

       ext = pth.extname(files[0]);

      // checking file extension
       if(ext !== ".apt"){

       	   if(platf == "linux")
              CR_LF = "\n";
       	   else
       	   	  CR_LF = "\r\n";

       	   throw new Error("Invalid file encounter." + CR_LF + " Please use an .apt file");
       }
       
	   // Let us give everyone the freedom to name the .apt file whatever they want so far the syntax is ok
	   // same goes for the .dir file
	    data = fs.readFileSync(dir_base + files[0]); // "xxxxxxxx.apt"


	   // Must set text before calling appitecture.parser();
	    appitecture.text = data.toString();
		var appi_data = appitecture.parser();
		var parsed_data = appi_data.parsed_data;
	    appitecture.route_parser(parsed_data,appitecture.config_options, appi_data.controllers_dictionary);

		if(appitecture.config_options.create_controller_functions == "yes"){
		  appitecture.controller_parser(appi_data.controllers_dictionary,parsed_data);
		}

		fs.writeFileSync(dir_base + "routes.js", JSON.stringify(parsed_data));
		
		console.log("App structure created: routes.js");

	}catch(e){
	    if(e.name != 'TokenizerError' && e.message.toLowerCase().indexOf(", no such file or directory") > -1){
	    	// customize this error message
		    throw new Error(files[0]+" file not found in working directory ");
		}else{
			throw e;
		}    
	}	


})
.parse(process.argv);