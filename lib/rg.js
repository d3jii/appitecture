var directory_module = require('./d.js');

function generate_route_string(path,methods,wrapper_type){
var next_line_delimiter = "\n";
	//create middleware strings
	function stringify_middlewares(middlewares){
		var middleware_string = "";
		var mi = 1;

		function middlewares_foreach_callback(middleware){
			if(middleware == "#")
				middleware_string += "function(req,res,next){\n\r /*code goes in here*/ \n\r}";
			else
				middleware_string += middleware
			if(mi < middlewares.length){
				middleware_string += ",";
				mi++;
			}

		}
		middlewares.forEach(middlewares_foreach_callback);
		return middleware_string;
	}

	var route_string = "";
	//Handle cases of app.route or router.route
	if(~wrapper_type.indexOf('.route')){
		 route_string += wrapper_type + "('" + path + "')";
		 function methods_foreach_callback(method){
		 	var middleware_string = stringify_middlewares(method.middlewares);
		 	var sep = middleware_string ? "," : "";
		 	route_string += "." + method.type + "(";
		 	if(method.controller == "#"){
		 		route_string += middleware_string + sep + "function(req,res,next){\n\r /*code goes in here*/ \n\r}";
		 	}
		 	else{
		 		route_string += middleware_string + sep + method.controller + "." + method.controller_method_name;
		 	}
		 	route_string += ")";
		 }
		 methods.forEach(methods_foreach_callback);
		 route_string += ";" + next_line_delimiter;
	}
	else{
		//Get the base part of the wrapper..eg. app.get()// returns app
		var wrapper_type_base = wrapper_type.split('.')[0];
		route_string += wrapper_type_base;
		 function methods_foreach_callback_(method){
		 	var middleware_string = stringify_middlewares(method.middlewares);
		 	var sep = middleware_string ? "," : "";
		 	route_string += "." + method.type + "('" + path + "',";
		 	if(method.controller == "#"){
		 		route_string += middleware_string + sep + "function(req,res,next){\n\r /*code goes in here*/ \n\r}";
		 	}
		 	else{
		 		route_string += middleware_string + sep + method.controller + "." + method.controller_method_name;
		 	}
		 	route_string += ")";
		 }
		 methods.forEach(methods_foreach_callback_);
		 route_string += ";" + next_line_delimiter;

	}
	return route_string;
}

exports.generate_routes = function( parsed_data,config,controller_dictionary ){

	//Create routes directory [this should come from config file]
	var routes_dir_base = "./routes";
	var controllers_dir_base = "./controllers"	;
	directory_module.createDirectory(routes_dir_base);
    
	var method_wrapper = config.method_wrapper;
	var create_controller_functions_flag = config.create_controller_functions;

	//if create controller functions flag is set. Create controllers directory as well
	if(create_controller_functions_flag == "yes"){
		directory_module.createDirectory(controllers_dir_base);
	}

	/**Might remove this**/
	controller_dictionary = {};
	function parsed_data_foreach_callback(pd){
		var dir = pd.path.split('/')[1];
		var route_string = generate_route_string(pd.path,pd.methods,method_wrapper);
		if(!controller_dictionary[dir]){
			controller_dictionary[dir] = {route_strings:[]};
			controller_dictionary[dir].route_strings.push(route_string);
		}
		else
		{
			controller_dictionary[dir].route_strings.push(route_string);
		} 
	}
	parsed_data.forEach(parsed_data_foreach_callback); 
	for(var dir in controller_dictionary){ 
		 
		directory_module.createFile(routes_dir_base,routes_dir_base+"/"+dir+".js",controller_dictionary[dir].route_strings.join(''));
	} 
}