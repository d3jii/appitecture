exports.generate_routes = function(parsed_data,config){
	var method_wrapper = config.method_wrapper;
	function parsed_data_foreach_callback(pd){
		console.log(pd.path);
	}
	parsed_data.forEach(parsed_data_foreach_callback);
}