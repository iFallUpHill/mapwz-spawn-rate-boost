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
			        var lifePos = outerData.map(function(e) { return e.$.name; }).indexOf('life');

			        var existinglifeData = outerData[lifePos].imgdir;
					var existingLength = existinglifeData.length;

			        var mobOnlyData = existinglifeData.filter(function (obj) {
			        	var stringPos = obj.string.map(function(e) { return e.$.name; }).indexOf('type');
			        	return obj.string[stringPos].$.value == 'm';
			        });

			        var mobsInMap = [];
			        for(var i = 0; i < mobOnlyData.length; i++) {
			        	var mobPos = mobOnlyData[i].string.map(function(e) { return e.$.name; }).indexOf('id');
						mobsInMap.push(mobOnlyData[i].string[mobPos].$.value);
			        }

					mobsInMap = mobsInMap.filter(function (value, index, self) { 
						return self.indexOf(value) === index;
					});

					var numOriginalMobs = mobOnlyData.length;
					var numNonMobs = existingLength - numOriginalMobs;
					var modifiedPrefix = '';

					console.log("The current mob limit is " + numOriginalMobs + ".");
					console.log("The current mob list is " + mobsInMap + ".");
				}
		    });
		}
	});
} else {
	console.log("No file specified");
}
