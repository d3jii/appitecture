var fs = require("fs");
/*
Abstracts the pain / magic of creating dirs/files 
the whole exists or not shebang
//directory names should always be prefixed with a . if they don't already
*/
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

exports.createFile = function(dir,fileName,fileContent){
	if (fs.existsSync(dir)) {
		fs.writeFileSync(fileName,fileContent);	
	}	
}