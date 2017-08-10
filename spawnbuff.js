var fs 		= require('fs'),
    xml2js 	= require('xml2js')
    argv 	= require('yargs').argv;

var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    rateIncrease = argv.spawnRate ? Math.round(argv.spawnRate) : false,
    mobLimit = argv.mobLimit ? Math.round(argv.mobLimit) : false,
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
			        var lifePos = outerData.map(function(e) { return e.$.name; }).indexOf('life');

			        var existinglifeData = outerData[lifePos].imgdir;

			        var mobOnlyData = existinglifeData.filter(function (obj) {
			        	var stringPos = obj.string.map(function(e) { return e.$.name; }).indexOf('type');
			        	return obj.string[stringPos].$.value == 'm';
			        });

					var dataLength = mobOnlyData.length;
					var existingLength = existinglifeData.length;
					var modifiedPrefix = ''
					if (mobLimit && mobLimit > dataLength) {
						var shuffledMobData = shuffle(mobOnlyData.slice());
						for(var i = 0; i < mobLimit - dataLength; i++) {
							if(shuffledMobData.length == 0) {
								shuffledMobData = shuffle(mobOnlyData.slice());
								console.log(mobOnlyData)
							}

							// Get Random Mob on Map
				         	var dupeMob = JSON.parse(JSON.stringify(shuffledMobData.shift()));
				         	dupeMob.$.name = (existingLength++).toString();
							existinglifeData.push(dupeMob);
						}
				        modifiedPrefix = 'maxSpawns_' + mobLimit + '_';
					} else if (rateIncrease && rateIncrease > 1) {
						for(var i = 1; i < rateIncrease; i++) {
				        	for(var j = 0; j < dataLength; j++) {
				         		var dupeMob = JSON.parse(JSON.stringify(mobOnlyData[j]));

				         		dupeMob.$.name = (existingLength++).toString();
								existinglifeData.push(dupeMob);
				         	}
				        }
				        modifiedPrefix = 'spawnRate_' + rateIncrease + 'x_';
					} else {
						console.log("No valid rate increase or spawn limit specified!")
					}

			        result.imgdir.imgdir[lifePos].imgdir = existinglifeData;

			        var xml = xmlBuilder.buildObject(result);

			        fs.writeFile(modifiedPrefix+ fileName, xml, function(err) {});
				}
		    });
		}
	});
} else {
	console.log("No file specified");
}

// From https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
