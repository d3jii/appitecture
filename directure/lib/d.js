var fs = require("fs");

exports.createDirectory = function(directoryName){
	//return "";
	//If direcoty name is not prefixed
	if(directoryName[0] != "." && directoryName[1] != "/") 
		directoryName = "./" + directoryName;

	if(!fs.existsSync(directoryName)){
		fs.mkdirSync(directoryName);
		return true;
	} 

	return false; 
}

function parse_line_tokens(line_tokens)
{
	var base_url_context = [];
	var parsed_data = [];
	function line_tokens_foreach_callback(line_token){
		if(line_token){
			var indentation = line_token.match(/\t/g);
			var line_token_tokens = line_token.split("\t").pop().split(' '); 
			line_token_tokens[0] = "/" + line_token_tokens[0].trim();
			if(!indentation)
			{
				base_url_context = [];
				base_url_context[0] = line_token_tokens[0];
			}
			else{ 

				base_url_context[indentation.length] = base_url_context.slice(indentation.length-1,indentation.length).join('') + line_token_tokens[0];
				line_token_tokens[0] = base_url_context[indentation.length]; //+ line_token_tokens[0];
			}
			var files = line_token_tokens[1];//.split(' ')[1];
			files = files ? files : [];
			parsed_data.push({
				path:line_token_tokens[0],
				files:files 
			})
		}
	}
	line_tokens.forEach(line_tokens_foreach_callback);
	return parsed_data;
}

function get_directory_structure(directure_file){

	if(directure_file){

		try{
			var file_content = fs.readFileSync(directure_file).toString();
			if(file_content != ""){
				var file_line_tokens = file_content.split('\n');
				return file_line_tokens;
			}
			else
				throw new Error("directure file is empty");
		}
		catch(err){
			console.log(err,"some err");
		}
		
	}
	
}


function create_files(filenames,path){
	if(filenames != ""){
		filenames = filenames.trim();
		filenames_tokesn = filenames.split(','); 
		function filenames_tokesn_foreach_callback(ftkn){
			ftkn = ftkn.trim(); 
			createFile(path,"." + path + "/" + ftkn,"");
		}
		filenames_tokesn.forEach(filenames_tokesn_foreach_callback);
	}
}

function createDirectory(directoryName){
	//return "";
	//If direcoty name is not prefixed
	if(directoryName[0] != "." && directoryName[1] != "/") 
		directoryName = "./" + directoryName;

	if(!fs.existsSync(directoryName)){
		fs.mkdirSync(directoryName);
		return true;
	} 

	return false; 
}

function createFile(dir,fileName,fileContent){
	//console.log(dir,fileName,fileContent);
	if (fs.existsSync(dir)) {
		//console.log(dir,fileName,fileContent);
		fs.writeFileSync(fileName,fileContent);	
	}
	else{
		//console.log(dir,fileName,fileContent);
		createDirectory(dir);
		fs.writeFileSync(fileName,fileContent);	
	}	
}

module.exports = function(directure_file){
	var tokens = get_directory_structure(directure_file);
	var parsed_tokens = parse_line_tokens(tokens);
	function parsed_tokens_foreach_callback(parsed_token){
		createDirectory(parsed_token.path);
		create_files(parsed_token.files,parsed_token.path);
	}
	parsed_tokens.forEach(parsed_tokens_foreach_callback);
	//console.log(parsed_tokens);
}