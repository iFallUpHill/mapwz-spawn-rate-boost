var fs 		= require('fs'),
    xml2js 	= require('xml2js')
    argv 	= require('yargs').argv;

var parser = new xml2js.Parser(),
    xmlBuilder = new xml2js.Builder(),
    rateIncrease = argv.rate ? Math.round(argv.rate) : 1,
    fileName = argv.file;

fs.readFile(fileName, function(err, data) {
    parser.parseString(data, function (err, result) {

        var outerData = result.imgdir.imgdir;
        var lifePos = outerData.map(function(e) { return e.$.name; }).indexOf('life');

        var existinglifeData = outerData[lifePos].imgdir;

        var mobOnlyData = existinglifeData.filter(function (obj) {
        	var stringPos = obj.string.map(function(e) { return e.$.name; }).indexOf('type');
        	return obj.string[stringPos].$.value == 'm';
        });

		var dataLength = mobOnlyData.length;
		var existingLength = existinglifeData.length;


        for(var i = 1; i < rateIncrease; i++) {
        	for(var j = 0; j < dataLength; j++) {
         		var dupeMob = JSON.parse(JSON.stringify(mobOnlyData[j]));

         		dupeMob.$.name = (parseInt(dupeMob.$.name) + existingLength).toString();
				existinglifeData.push(dupeMob);
         	}
         	existingLength = existinglifeData.length;
        }
        result.imgdir.imgdir[lifePos].imgdir = existinglifeData;

        var xml = xmlBuilder.buildObject(result);

        fs.writeFile(rateIncrease + 'x_' + fileName, xml, function(err) {});

    });
});