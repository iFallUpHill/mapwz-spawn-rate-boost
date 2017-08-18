var fs 		= require('fs'),
    xml2js 	= require('xml2js')
    argv 	= require('yargs').argv;

var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    fileName = argv.file,
    uniqueid = argv.uniqueidstart ? argv.uniqueidstart : 1000;
    
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
			        	var questPhases = innerData.imgdir;
			        	
			        	for(var j = 0; j < questPhases.length; j++) {
			        		if (j === 0) {
			        			// do nothing for now 
			        		} else if (j === 1) {
			        			var int = questPhases[j].int;
			        			var items = questPhases[j].imgdir;

			        			if (int) { // exp, nextQuest (+ others)
			        				for(var k = 0; k < int.length; k++) {
			        					var name = int[k].$.name;
				        				var value = int[k].$.value;

				        				if (name && value) {
											var query = 'INSERT into wz_questactdata (id, questid, name, type, intStore, stringStore, applicableJobs, uniqueid)';
											query += ' VALUES (NULL, ' + questID + ', "' + name + '", ' + j + ', ' + value + ', NULL, "", -1);'; 
											console.log(query);	
				        				}
			        				}
			        			} 

			        			if (items) { // item
			        				for(var k = 0; k < items.length; k++) {
			        					var rewards = items[k].imgdir;
			        					for(var l = 0; l < rewards.length; l++) {
			        						var name = rewards[l].$.name;
			        						var itemInfo = rewards[l].int;
			        						var itemIDPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('id');
			        						var itemCountPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('count');

			        						var itemID = itemInfo[itemIDPos].$.value;
			        						var itemCount = itemInfo[itemCountPos].$.value;

			        						var query = 'INSERT into wz_questactdata (id, questid, name, type, intStore, stringStore, applicableJobs, uniqueid)';
											query += ' VALUES (NULL, ' + questID + ', "item", ' + j + ', ' + itemID + ', NULL, "", '+ (uniqueid++) +');';
											console.log(query);	
			        					}
			        				}
			        			}
			        		} else {
			        			// do nothing for now
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
