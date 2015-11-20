var route_parser = require('./rg.js');
var appitecture = {
	text:"",
	grammar:{
		middlewarepattern:/(\([a-zA-Z#_0-9\,\.\s]*\))/g,
		indentation:/\t/g,
	},
	config_lines:2,
	config_options:{},
	parser:parseData,
	route_parser:route_parser.generate_routes
}  

function decompose_config_information(config_tokens){
	var config_method_wrapper = config_tokens[0].split(' ')[1].trim();
	var config_create_controller_functions_flag = config_tokens[1].split(' ')[1].trim();
	return {
		method_wrapper:config_method_wrapper,
		create_controller_functions:config_create_controller_functions_flag
	};
}

function parseData(){
	function getTokens(text){
		return text.split('\n');
	}

	var parsed_data = [];
	//obj to use for directory structure pending creation of direcctory listing
	var controllers_dictionary = {}
	line_tokens = getTokens(this.text);
	var config_tokens = line_tokens.splice(0,this.config_lines);
	var config_decomposed = decompose_config_information(config_tokens);
	this.config_options = config_decomposed;
	//Get the method_wrapper to use // use app.route .. returns app.route
	var method_wrapper = this.config_options.method_wrapper;
	var create_controller_functions_flag = this.config_options.create_controller_functions;
	//base_url_context array
	var base_url_context = [];
	//object to hold controllers as implied from context.. user.xusjd -> controller is user;
	var controllers_implied_from_context = {};
	var controllerfunctionstrings = "\n"; 

	//To be used in callback functions
	var appitecture_this_ref = this;
	function getMethods(method_token){
		var method_token_tokens = method_token.split(',');
		var return_array = [];
		function method_token_tokens_foreach_callback(method_token_token){
			//(yyt.uiyui # )get:user.listUsers
			var middlewares = method_token_token.match(appitecture_this_ref.grammar.middlewarepattern);
			//console.log(middlewares);	
			if(middlewares){
				middlewares = middlewares[0].replace(/\(|\)/g,'').split(' ');
			}
			else
				middlewares = [];
			method_token_token = method_token_token.replace(appitecture_this_ref.grammar.middlewarepattern,'').trim();
			//console.log(method_token_token);		
			var method_token_token_tokens = method_token_token.split(':'); 
			var method_type =  method_token_token_tokens[0];
			//Check that a controller.methodname exsits else set to # for anon / inline functions
			var method_controller = method_token_token_tokens[1] ? method_token_token_tokens[1] : '#';
			var controller_base = "#";
			var controller_method_name = "#";

			if(method_token_token_tokens[1])
				var method_controller_filename = method_token_token_tokens[1].split('.')[0];
			else
				var method_controller_filename = "";

			//If controller.methodnme token exists. populate controllers_dictionary with empty array
			//This array will contain list of route generations and controller functions if flag is yes
			//A simple join will be used instead of concatenation and resulting string be stored in 
			//appropriate folder.
			if(method_controller != "#"){
				var method_controller_tokens = method_controller.split('.');
				controller_base = method_controller_tokens[0];
				controller_method_name = method_controller_tokens[1] ? method_controller_tokens[1] : "#"; 
				if(!controllers_dictionary[controller_base]){
					controllers_dictionary[controller_base] = {route_strings:[],controller_function_strings:[]};
					//if(controller_method_name)
					//controllers_dictionary[controller_base].push(controller_method_name)
				}
				//else
				//	controllers_dictionary[controller_base].push(controller_method_name)

			}			 

			return_array.push({
				type:method_type,
				controller:controller_base,
				controller_method_name:controller_method_name,
				middlewares:middlewares
			});
		}
		method_token_tokens.forEach(method_token_tokens_foreach_callback);		
		return return_array;
	}

	function line_tokens_foreach_callback(line_token){
		if(line_token){
			var indentation = line_token.match(appitecture_this_ref.grammar.indentation);
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
	return {
		controllers_dictionary:controllers_dictionary,
		parsed_data:parsed_data
	};
}
//Export appitecture as a module
exports.appitecture = appitecture;