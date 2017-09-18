var express = require('express');
var fs      = require('fs');
var router  = express.Router();
var path    = require('path');
// var mdit    = new require('markdown-it');
// var md      = new mdit();
var md      = new require('markdown-it')().set({ html: true, breaks: true }).use(require('markdown-it-sub'));

router.get(['/doc/\*'], function(req, res, next) {
	if(path.extname(req.originalUrl)) return next(); // 不处理带有后缀名的请求，认为是图片、js或css
	var app = req.app;
	var file = app.get('views') + req.path + '.md';
	file = path.normalize(file);
	fs.exists(file, function(exists){
		if(!exists){
			res.writeHead(404, {"Content-Type":"text/html"} );
			res.end( "<h1>404 Not Found</h1>" );
		}else{
			var md_data = fs.readFileSync(file, {encoding:'utf8', flag: 'r'});
			res.render(path.normalize('doc/views/index'), {
				data: md.render(md_data)
			});
		}
	});
});

module.exports = router;
