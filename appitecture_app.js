
var fs = require("fs"); 
var data = fs.readFileSync("appitecture.apt");
var next_line_delimiter = "\n";
var route_strings = "";
var dir_base = "./";  
var appitecture = {
	text:"",
	grammar:{
		middlewarepattern:/(\([a-zA-Z#_0-9\,\.\s]*\))/g,
		indentation:/\t/g,
	},
	config_lines:2,
	parser:null
}
appitecture.text = data.toString();  
/*[{path,methods:[{type,filename,method,middlewares:[]}]}]*/

function getTokens(text){
	return text.split('\n');
}
var parsed_data = [];
line_tokens = getTokens(appitecture.text);
var config_tokens = line_tokens.splice(0,appitecture.config_lines);
//Get the method_wrapper to use // use app.route .. returns app.route
var method_wrapper = config_tokens[0].split(' ')[1].trim();
var create_controller_functions_flag = config_tokens[1].split(' ')[1];
//base_url_context array
var base_url_context = [];
//object to hold controllers as implied from context.. user.xusjd -> controller is user;
var controllers_implied_from_context = {};
var controllerfunctionstrings = "\n"; 

function getMethods(method_token){
	var method_token_tokens = method_token.split(',');
	var return_array = [];
	function method_token_tokens_foreach_callback(method_token_token){
		//(yyt.uiyui # )get:user.listUsers
		var middlewares = method_token_token.match(appitecture.grammar.middlewarepattern);
		console.log(middlewares);	
		if(middlewares){
			middlewares = middlewares[0].replace(/\(|\)/g,'').split(' ');
		}
		else
			middlewares = [];
		method_token_token = method_token_token.replace(appitecture.grammar.middlewarepattern,'').trim();
		//console.log(method_token_token);		
		var method_token_token_tokens = method_token_token.split(':'); 
		var method_type =  method_token_token_tokens[0];
		var method_controller = method_token_token_tokens[1];
		if(method_token_token_tokens[1])
		var method_controller_filename = method_token_token_tokens[1].split('.')[0];
	    else
	    var method_controller_filename = ""	;
		return_array.push({
			type:method_type,
			controller:method_controller,
			filename:method_controller_filename,
			middlewares:middlewares
		});
	}
	method_token_tokens.forEach(method_token_tokens_foreach_callback);
	return return_array;
}

function line_tokens_foreach_callback(line_token){
	if(line_token){
		var indentation = line_token.match(appitecture.grammar.indentation);
		var line_token_tokens = line_token.split("\t").pop().split(' ');
		if(line_token_tokens[2]) 
		line_token_tokens[1] = line_token_tokens[1] + " " + line_token_tokens[2].trim(); 
	    else
	    line_token_tokens[1] = line_token_tokens[1].trim();	
		if(!indentation)
		{
			base_url_context = [];
			base_url_context[0] = line_token_tokens[0];
		}
		else{ 

			base_url_context[indentation.length] = base_url_context.slice(indentation.length-1,indentation.length).join('') + line_token_tokens[0];
			line_token_tokens[0] = base_url_context[indentation.length]; //+ line_token_tokens[0];
		}
		parsed_data.push({
			path:line_token_tokens[0],
			methods:getMethods(line_token_tokens[1])
		})
	}
}
line_tokens.forEach(line_tokens_foreach_callback);
//console.log(parsed_data);
fs.writeFileSync("routes.js",JSON.stringify(parsed_data));