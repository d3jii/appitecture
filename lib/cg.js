var directory_module = require('./d.js');


exports.generate_controllers = function(controllers,route_methods){
	var controllers_dir_base = "./controllers";
	directory_module.createDirectory(controllers_dir_base);

	controller_functions = {};
	function route_methods_foreach(route_data){
		var _methods = route_data.methods;

		function _methods_foreach(m){
			if(m.controller != "#"){
				controllers[m.controller].route_strings.push( "exports." + m.controller_method_name + " = function(req,res,next){\n\r };\n\r" );
			}
		}
		_methods.forEach(_methods_foreach);
	}
	route_methods.forEach(route_methods_foreach);

	for(var controller in controllers){
		if(controllers.hasOwnProperty(controller)){
			directory_module.createFile(controllers_dir_base,controllers_dir_base+"/"+controller+".js",controllers[controller].route_strings.join(""));
		}
	}

}