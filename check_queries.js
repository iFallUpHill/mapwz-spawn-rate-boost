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
			        	var questInfo = innerData.imgdir;
			        	for(var j = 0; j < questInfo.length; j++) {
							var type = questInfo[j].$.name;
							var int = questInfo[j].int;
							var complex = questInfo[j].imgdir;

							if (int) {
								for (var k = 0; k < int.length; k++) {
									var name = int[k].$.name;
									var value = int[k].$.value;

									if(name && value) {
										var query = 'INSERT into wz_questreqdata (id, questid, name, type, stringStore, intStoresFirst, intStoresSecond)';
										query += ' VALUES (NULL, ' + questID + ', "' + name + '", ' + type + ', ' + value + ', "", "");'; 
										console.log(query);
									}
								}
							}

							if (complex) {
								for (var k = 0; k < complex.length; k++) {
									var name = complex[k].$.name;
									var value = complex[k].imgdir;
									for(var l = 0; l < value.length; l++) {
		        						var stringStore = value[l].$.name;
		        						var intInfo = value[l].int;
	        							var idPos = intInfo.map(function(e) { return e.$.name; }).indexOf('id');
		        						var countPos = intInfo.map(function(e) { return e.$.name; }).indexOf('count');
		        						var statePos = intInfo.map(function(e) { return e.$.name; }).indexOf('state');

		        						var stringID = intInfo[idPos].$.value;
		        						var stringValue;
		        						if (countPos != -1) {
		        							stringValue = intInfo[countPos].$.value;
		        						} else if (statePos != -1) {
		        							stringValue = intInfo[statePos].$.value;
		        						}
	        							if(stringID && stringValue) {
											var query = 'INSERT into wz_questreqdata (id, questid, name, type, stringStore, intStoresFirst, intStoresSecond)';
											query += ' VALUES (NULL, ' + questID + ', "' + name + '", ' + type + ', ' + stringStore + ', ' + stringID + ', ' + stringValue + ');'; 
											console.log(query);
										}
		        					}
								}
							}	  
			        	}
					}
				}
		    });
		}
	});
} else {
	console.log("No file specified");
}
