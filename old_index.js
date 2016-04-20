#! /usr/bin/env node
var fs = require("fs"); 
var data = fs.readFileSync("appitecture.apt");
var next_line_delimiter = "\n";
var route_strings = "";
var dir_base = "./";
/*
var dir = './tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

{

    text: ""

    grammer: "",

    parser: () returns path, methods:[{type:, filename:'', method:'', middlewares:[""]}]
}


*/

var appitecture = {
	text:"",
	grammar:"",
	config_lines:2,
	parser:function(){}
}


function create_controller_function(functionname,optional_generate_controller_object){
	//Split functionname, remove the controller name .. user.getUsers == getUsers()
	functionname = functionname.split('.');
	//if optional_generate_controller_object is passed, create a dictionary of implied controllers
	if(optional_generate_controller_object)
		optional_generate_controller_object[functionname[0]] = "";
	if(functionname[1])
		return "exports."+functionname[1]+" = function (req , res , next){ "+next_line_delimiter+next_line_delimiter+"};"+next_line_delimiter+next_line_delimiter;

	return "";
}

function process_method_token(method_as_extracted_from_route_info,optional_path){

	var methods = method_as_extracted_from_route_info.split(',');
	//if no optional path argument is passed, we have a case of use app.route or router.route	 
	if(!optional_path){
		//set base string to . 
		var base_string = "";
		function methods_foreach_callback_no(method){
			 base_string += ".";
			//split method into http verb and controller or function handler
			var method_tokens = method.split(':');
			base_string += method_tokens[0];
			//case where no controller or callback functino is specified
			if(method_tokens.length == 1){
			  base_string += "(function(req,res,next){ /*controller code in here*/ })";
			}
			else{
				base_string += "("+method_tokens[1].trim()+")";
				controllerfunctionstrings += create_controller_function(method_tokens[1],controllers_implied_from_context);
			}
			//base_string += next_line_delimiter;
		}
		methods.forEach(methods_foreach_callback_no);
	}
	else{
		var base_string = "";
		function methods_foreach_callback(method){
			 base_string += ".";
			//split method into http verb and controller or function handler
			var method_tokens = method.split(':');
			base_string += method_tokens[0];
			//case where no controller or callback functino is specified
			if(method_tokens.length == 1){
			  base_string +=  "('"+ optional_path +"',function(req,res,next){ /*controller code in here*/ })"
			}
			else{
				base_string += "('"+ optional_path +"',"+method_tokens[1].trim()+")";
				controllerfunctionstrings += create_controller_function(method_tokens[1],controllers_implied_from_context);
			}
			//base_string += next_line_delimiter;
		}
		methods.forEach(methods_foreach_callback);
	}
	base_string += ";"+next_line_delimiter;
	return base_string;

}

//Used for parsing if use-case is app.route or router.route
function useAsIs(method_wrapper_as_extracted_from_config,path_as_extracted_from_route_info,method_as_extracted_from_route_info){
	var method_string = process_method_token(method_as_extracted_from_route_info);
	return method_wrapper_as_extracted_from_config + '(\'' + path_as_extracted_from_route_info + '\')'+ method_string;
}

//ToDo
function useMethod(method_wrapper_as_extracted_from_config,path_as_extracted_from_route_info,method_as_extracted_from_route_info){
	//get the first part of method wrapper e.g. app / router
	var base_part = method_wrapper_as_extracted_from_config.split('.')[0];
	var method_string = process_method_token(method_as_extracted_from_route_info,path_as_extracted_from_route_info);
	return base_part + method_string;

}

//number of lines representing configuration information
var config_lines = 2;
//Set some config defaults
var config_utils = {
	"app.route":useAsIs,
	"router.route":useAsIs,
	"app.method":useMethod,
	"router.method":useMethod
}
//GET THE TEXT
data = data.toString();
//split text into lines
var line_tokens = data.split('\n'); 
//Remove configuration info from line_tokens
var config_tokens = line_tokens.splice(0,config_lines);
//Get the method_wrapper to use // use app.route .. returns app.route
var method_wrapper = config_tokens[0].split(' ')[1].trim();
var create_controller_functions_flag = config_tokens[1].split(' ')[1];
//base_url_context array
var base_url_context = [];
//object to hold controllers as implied from context.. user.xusjd -> controller is user;
var controllers_implied_from_context = {};
var controllerfunctionstrings = "\n"; 
function line_tokens_foreach_callback(line_token){
	if(line_token){
	//get indentation
	line_token = line_token.split("\t");    
	//get tokens from each path and method info in each line token. 0 is path and 1 is list of methods
	var line_token_tokens = line_token.pop().split(' ');

	//first line or new base url section as in /companies / /departments in the example
	if(line_token.length === 0)
	{
		base_url_context = [];
		base_url_context[line_token.length] = line_token_tokens[0];
	}
	else{
		//slice so we don't concacatenate wrongly like so /companies/:id/companies/:id/delete/edit
		// var slice_end_index = line_token.length;
		// if(slice_end_index)
		base_url_context[line_token.length] = base_url_context.slice(line_token.length-1,line_token.length).join('') + line_token_tokens[0];
		line_token_tokens[0] = base_url_context[line_token.length]; //+ line_token_tokens[0];
	}
	route_strings += config_utils[method_wrapper](method_wrapper,line_token_tokens[0],line_token_tokens[1]); 
	//console.log(config_utils[method_wrapper](method_wrapper,line_token_tokens[0],line_token_tokens[1]));
	}
}
line_tokens.forEach(line_tokens_foreach_callback);
fs.writeFileSync("routes.js",route_strings);

//if()
for(var i in controllers_implied_from_context){
//console.log(i);
}


//console.log(line_tokens);