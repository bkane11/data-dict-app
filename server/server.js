var excelbuilder = require('msexcel-builder')
	http = require('http'),
	url = require( "url" ),
    qs = require( "querystring" ),
	deparam = require('node-jquery-deparam');
    // fs = require( "fs-then" ),
    fs = require( "fs" ),
	path = require('path'),
	mailer = require('./mailer'),
	port = 9005,
	header = { "Content-Type" : "text/json" , "Access-Control-Allow-Origin": "*"};

function log(e){
	console.log(e)
}
	
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
	data = deparam(data);
	var outfile = path.join(__dirname , data.project + '.xlsx');
	var workbook = excelbuilder.createWorkbook(__dirname , data.project + '.xlsx');
	// var workbook = excelbuilder.createWorkbook('./' , data.project + '.xlsx');
	var sheet = workbook.createSheet('DataDict', 30,  data.fields.length+1);
	
	sheet.set(1, 1, 'Field Name');
	sheet.set(2, 1, 'Field Type');
	sheet.set(3, 1, 'Field ValueOptions');
	// sheet.fill(1, 1, {type:'solid',fgColor:'pink',bgColor:'64'}); // sheet.fill(2, 1, {type:'solid',fgColor:'pink',bgColor:'64'}); // sheet.fill(3, 1, {type:'solid',fgColor:'pink',bgColor:'64'});
	sheet.border(1, 1, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	sheet.border(2, 1, {left:'medium',top:'medium',right:'medium',bottom:'medium'});
	sheet.border(3, 1, {left:'medium',top:'medium',bottom:'medium'});
	var optionsWidth = 50,
		defaultWidth = 30;
	sheet.width(1, defaultWidth);
	sheet.width(2, defaultWidth);
	sheet.width(3, defaultWidth);
	
	for (var i = 0; i < data.fields.length; i++){
		sheet.set(1, i+2, data.fields[i].fieldLabel);
		sheet.set(2, i+2, data.fields[i].fieldType);
		sheet.border(2, i+2, {right:'medium'})
		if(data.fields[i].fieldValueOptions){
			var values = data.fields[i].fieldValueOptions.split(',');
			for(var j = 0; j < values.length; j++){
				try{
					sheet.set(3 + j , i+2, values[j]);
					sheet.border(3 + j, 1, {bottom:'medium'});
				}catch(e){
					log(e);
				}
			}
		}
	}
	
	workbook.save(function(err){
		if (err){
		  workbook.cancel();
		  res.writeHead( 400, header );
		  res.end(JSON.stringify({error: 'oops, no workie'}))
		  return
		}
		workbook.cancel();
		console.log('Data dictionary created at', outfile);
		res.writeHead( 200, header );
		res.end(JSON.stringify({success: outfile}))

		var html, cc,
			to = data.submitterName + '<' + data.submitterEmail + '>',
			subject = 'Your data dictionary submission for work order #: ' + data.chargeNumber,
			attachments = [{ 
				fileName: data.project + ".xlsx",
				streamSource: fs.createReadStream(outfile)
			}],
			mailOptions = mailer.mailOptions(to,cc,subject, html, attachments)
			
		try{
			mailer.sendmail(mailOptions)
		}catch (e){
			log(e);
			options = mailer.mailOptions();
			options.subject = 'A data dictionary request was submitted';
			options.html = '<a src="'+outfile+'">' + outfile + '</a>'
			mailer.sendmail(options)
		}
	});
}

console.log('listening at:\tlocalhost:9005') 

