var fs 		= require('fs'),
    xml2js 	= require('xml2js')
    argv 	= require('yargs').argv;

var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    fileName = argv.file;

var canvasToKeep = ['icon', 'iconRaw'];
var intToKeep = ['lv'];
    
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

			        for(var i = 0; i < outerData.length; i++) {
			        	var innerData = outerData[i].imgdir;
			        	var infoPos = innerData.map(function(e) { return e.$.name; }).indexOf('info');
			        	var canvas = innerData[infoPos].canvas;
			        	var int = innerData[infoPos].int;

			        	if (canvas) {
			        		canvas = canvas.filter(function (obj) {
					        	return obj.$.name && canvasToKeep.indexOf(obj.$.name) != -1
				        	});

			        	}

			        	if (int) {
			        		int = int.filter(function (obj) {
					        	return obj.$.name && intToKeep.indexOf(obj.$.name) != -1
					        });	
			        	}

			        	outerData[i].imgdir[infoPos].canvas = canvas;
			        	outerData[i].imgdir[infoPos].int = int;
					}

					result.imgdir.imgdir = outerData;

					var xml = xmlBuilder.buildObject(result);
			        
			        fs.writeFile("stripped_" + fileName, xml, function(err) {});
			        console.log("stripped_" + fileName + " created.")
				}
		    });
		}
	});
} else {
	console.log("No file specified");
}
