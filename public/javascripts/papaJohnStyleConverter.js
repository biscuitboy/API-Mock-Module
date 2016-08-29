module.exports = function(file){
	var startingRegex = /function(\(| \()([^]*?){([^]*)}/i;
	var contents = String(file.contents);
	var replacedString = contents.replace(startingRegex , "$2");
	return replacedString;
}