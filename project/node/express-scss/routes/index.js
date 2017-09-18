var express = require('express');
var libFs	= require('fs');
var router  = express.Router();
var path    = require('path');

router.get(['/index', '/'], function(req, res) {
	var app = req.app;
	var view = req.query.view;
	view = req.query.view.replace(/\/html\//, '/views/');
	var file = path.join(app.get('views'), view) + '.ejs';
	console.log(file);

	file = path.normalize(file);
	libFs.exists(file, function(exists){
		if(!exists){
			res.writeHead(404, {"Content-Type":"text/html"} );
			res.end( "<h1>404 Not Found</h1>" );
		}else{
			var tmp = view.replace(/[^\/\\]+/g, '..').split(/[\\|\/]/);
			res.render(view, {
				// ___: req.query.dist == 1 ? '../..' : '',
				___: '',
				timestamp: Date.parse(new Date()),
				node: {
					placeholder:{
						white:"//cdn01.b5mcdn.com/common/img/placeholder.png",
						loading:"//cdn01.b5mcdn.com/korea/img/loading.gif"
					},
					get_img: function(width, height, bg, color, text){
						var colorTrans = function(c){
							return c.replace(/./g, function(s){return s+s;});
						};
						height = height || width;
						bg     = bg     || 'ccc';
						color  = color  || '000';
						text   = text   || (width + 'X' + height);

						// return 'http://dummyimage.com/'+width+'x'+height+'/'+bg+'/'+color+'.png&text=' + text;
						// return 'http://fakeimg.pl/'+width+'x'+height+'/'+bg+'/'+color+'/?text=' + text;

						// 不支持三位颜色的，变换成六位
						if(bg.length==3) bg = colorTrans(bg);
						if(color.length==3) color = colorTrans(color);

						return 'http://fpoimg.com/'+width+'x'+height+'?bg_color='+bg+'&text_color='+color+'&text=' + text;
					}
				}
			}, express.UserConfig.dist.bind({req:req, res:res, distPath:req.query.view}));
		}
	});
});

module.exports = router;
