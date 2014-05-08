var excelbuilder = require('msexcel-builder')
	http = require('http'),
	url = require( "url" ),
    qs = require( "querystring" ),
	deparam = require('node-jquery-deparam');
    // fs = require( "fs-then" ),
	path = require('path'),
	port = 9005,
	header = { "Content-Type" : "text/json" , "Access-Control-Allow-Origin": "*"};

var server = http.createServer(function(req, res) {
	res.writeHead("Access-Control-Allow-Origin", "*");
	res.writeHead("Access-Control-Allow-Origin", "http://localhost:9000");
	var url_parts = url.parse(req.url, false);
  switch (url_parts.pathname) {
    case '/datadict' || '':
      handleRequest(url_parts.query, res);
      break;
    default:
		// requestHandler.start(res);
      // show_404(req, res);
      break;
  }
});
server.listen(port);

function handleRequest(data, res){
	// var workbook = excelbuilder.createWorkbook(path.join(__dirname , data.project + '.xlsx'));
	data = deparam(data);

	var workbook = excelbuilder.createWorkbook('./' , data.project + '.xlsx');
	var sheet = workbook.createSheet('DataDict', 3,  data.fields.length+1);
	
	sheet.set(1, 1, 'Field Name');
	sheet.set(2, 1, 'Field Type');
	sheet.set(3, 1, 'Field ValueOptions');
	// sheet.fill(1, 1, {type:'solid',fgColor:'pink',bgColor:'64'});
	// sheet.fill(2, 1, {type:'solid',fgColor:'pink',bgColor:'64'});
	// sheet.fill(3, 1, {type:'solid',fgColor:'pink',bgColor:'64'});
	sheet.border(1, 1, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	sheet.border(2, 1, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	sheet.border(3, 1, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	
	for (var i = 0; i < data.fields.length; i++){
		sheet.set(1, i+2, data.fields[i].fieldLabel);
		sheet.set(2, i+2, data.fields[i].fieldType);
		sheet.set(3, i+2, data.fields[i].fieldValueOptions)
	}
	
	workbook.save(function(ok,a,b ){
		if (!ok) {
		  workbook.cancel();
		  console.log('congratulations, your workbook was created at', path.join(__dirname , data.project + '.xlsx'));
		  res.writeHead( 200, header );
		  res.end(JSON.stringify({success: path.join(__dirname , data.project + '.xlsx')}))
		}
		else{
		  workbook.cancel();
		  res.writeHead( 400, header );
		  res.end(JSON.stringify({error: 'oops, no workie'}))
		}
	});
}

console.log('listening at:\tlocalhost:9005') 
