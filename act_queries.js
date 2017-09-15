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
							var type = questPhases[j].$.name;
							
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
											query += ' VALUES (NULL, ' + questID + ', "' + name + '", ' + type + ', ' + value + ', NULL, "", -1);'; 
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


			        						var itemPropPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('prop');
			        						var itemPeriodPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('period');
			        						var itemJobPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('job');
			        						var itemJobExPos = itemInfo.map(function(e) { return e.$.name; }).indexOf('jobEx');
			 

			        						var itemID = itemInfo[itemIDPos].$.value;
			        						var itemCount = itemInfo[itemCountPos].$.value;

			        						// Set defaults
			        						var hasItemProp = itemPropPos !== -1; 

			        						var itemProp = hasItemProp ? itemInfo[itemPropPos].$.value : -2;
			        						var itemPeriod = itemPeriodPos !== -1 ? itemInfo[itemPeriodPos].$.value : 0;
			        						var itemJob = itemJobPos !== -1 ? itemInfo[itemJobPos].$.value : -1;
			        						var itemJobEx = itemJobExPos !== -1 ? itemInfo[itemJobExPos].$.value : -1;

			        						if((itemPropPos === -1 && itemPeriodPos === -1 && itemJobPos === -1 && itemJobExPos === -1) || (hasItemProp && itemProp < 0)) {
                                            	uniqueid++;
                                            }

			        						var query = 'INSERT into wz_questactdata (id, questid, name, type, intStore, stringStore, applicableJobs, uniqueid)';
											query += ' VALUES (NULL, ' + questID + ', "item", ' + type + ', ' + itemID + ', NULL, "", '+ (uniqueid) +');';
											console.log(query);	

											var query2 = 'INSERT into wz_questactitemdata (id, itemid, count, period, gender, job, jobEx, prop, uniqueid)';
                                            query2 += ' VALUES (NULL, ' + itemID + ', ' + itemCount + ', ' + itemPeriod + ', 2, ' + itemJob + ', ' + itemJobEx + ', ' + itemProp + ', '+ (uniqueid) +');';
                                            console.log(query2);

                                            
			        					}
			        				}
			        			}
			        			// Fail safe to ensure uniqueid increments between quests
			        			uniqueid++;
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
