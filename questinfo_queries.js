var fs 		= require('fs'),
    xml2js 	= require('xml2js')
    argv 	= require('yargs').argv;

var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    fileName = argv.file;
    
if (fileName) {
	fs.readFile(fileName, function(err, data) {
		if (err) {
			console.log("Error reading file: " + err);
		} else {
			parser.parseString(data, function (err, result) {
				if (err) {
				console.log("Error parsing file: " + err);
				} else {
					var outerData = result.imgdir.imgdir;
					
			        for(var i = 0; i < outerData.length; i++) {
			        	var innerData = outerData[i];
			        	var questID = outerData[i].$.name;
						var stringWrapper = innerData.string;
						var questNamePos = stringWrapper.map(function(e) { return e.$.name; }).indexOf('name');
						var questName = stringWrapper[questNamePos].$.value;
						var query = 'INSERT into wz_questdata (autoStart, autoPreComplete, viewMedalItem, selectedSkillID, blocked, autoAccept, autoComplete, questid, name)';
						query += ' VALUES (0, 0, 0, 0, 0, 0, 0, "' + questID + '", "' + questName + '");'; 			  
						console.log(query);
					}
				}
		    });
		}
	});
} else {
	console.log("No file specified");
}
