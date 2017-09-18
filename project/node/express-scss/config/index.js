var fs     = require('fs');
var path   = require('path');
var async  = require('async');
var exec   = require('child_process').exec;
var isDev  = false;
var config = {
	/*
	 * 设置静态web目录
	 * */
	staticDir: '../../web',

	map_combo_file: {
		// '/common/js/common_min.js' : 'b5m_host.js,_parts/json2.js,_parts/jquery.xiaoBangPopup.js,_parts/common.js'
		'/common/js/common_min.js' : 'b5m_host.js,_parts/json2.js,_parts/common.js,_parts/bdpop.js,_parts/t.js'
	},

	/*
	 * 自动加载routes
	 * */
	routes: function(app, dirPath, routePath){
		var routeFiles = fs.readdirSync(dirPath);
		routeFiles.forEach(function(file){
			fs.stat(dirPath+'/'+file, function(err, stats){
				if( stats.isDirectory() ){
					config.routes(app, dirPath+'/'+file, routePath+file+'/');
				}else if( stats.isFile() ){
					var list = file.split('.');
					if(list.length==2 && list[1]==='js'){
						var name   = list[0],
							path   = routePath + name,
							module = '/routes' + path;
						isDev  = "development" == app.get('env');
						if(isDev){
							console.log("Auto add route!\n\tPath: ", path, '\n\tModule: ', module);
						}
						app.use('/', require('..'+module));
					}
				}
			});
		});
	},

	/*
	 * 发布静态HTML代码
	 * */
	dist: function(err, ret){
		var req = this.req;
		ret = config.minifyHTML(ret);
		if(err){
			console.log(err);
			return false;
		}
		if(req.query.dist!=='0'){
			config.writeStaticCache(this.distPath || req.route.path, ret);
		}
		this.res.send(ret);
	},

	/*
	 * 压缩HTML代码，静态页暂时不需要
	 * */
	minifyHTML: function(str){
		// str = str.replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
		return str;
	},

	/*
	 * 生成静态页面文件
	 * */
	writeStaticCache: function(url, ret){
		var url_path = url.replace(/^\/|\/$/g, '');
		console.log(url_path);
		url_path = process.cwd() + '/' + config.staticDir + '/' + (url_path || 'index') + '.html';
		url_path = path.normalize(url_path);
		config.mkdirRecursive(path.dirname(url_path), 777, function(){
			fs.writeFile(url_path, ret, function(err){
				if(err) throw err;
				if(isDev){
					console.log('Dist ' + path.normalize(url_path) + ' succeed!');
				}
			});
		});
	},

	/*
	 * 递归创建目录
	 * */
	mkdirRecursive: function(dirpath, mode, callback) {
		var that = this;
		callback = callback || function(){};
		fs.exists(dirpath, function(exists) {
			if(exists){
				callback(dirpath);
			}else{
				that.mkdirRecursive(path.dirname(dirpath), mode, function(){
					fs.mkdir(dirpath, mode, callback);
				});
			}
		});
	},

	/*
	 * 每次请求css时编译相应的scss文件
	 * 使用sass命令编译
	 * sass的库目录为web目录的/public/scss目录，详见sass命令的-I参数
	 * */
	compileSCSS: function(req, res, next){
		if(/.*\.css$/.test(req.path)){
			var static_public = process.cwd() + '/' + config.staticDir;
			static_public = path.normalize(static_public);
			var css_path = static_public +  req.path.replace(/\.css/, '');
			css_path = path.normalize(css_path);
			config.mkdirRecursive(path.dirname(css_path), 777, function(){
				var out_file = css_path + '.css';
				var in_file = css_path.replace(/([\\\/])css([\\\/])/, "$1scss$2") + '.scss';
				console.log(css_path,css_path.replace(/([\\\/])css([\\\/])/, "$1scss$2") + '.scss');
				var sh = [
					'scss',
					'--sourcemap=none',
					'-t compressed',
					'-I ' + static_public + '/public/scss',
					in_file,
					out_file
				];
				// console.log(sh.join(' '));
				exec(sh.join(' '), function(error, stdout, stderr){
					if(error){
						console.log(error);
						console.log(stdout);
						console.log(stderr);
					}
					return next();
				});
			});
		}else{
			return next();
		}
	},

	/*
	 * 每次请求模块文件时，动态编译相应的模块文件
	 * 具有合并多个模块文件为一个的功能
	 * */
	compileTemplate: function(req, res, next){
		console.log(111);
		if(/^\/[^\/]*\/tpl\/.*\.js/.test(req.path)){
			var static_public = process.cwd() + '/' + config.staticDir;
			static_public = path.normalize(static_public);
			var js_path = static_public + req.path.replace(/\.js/, '');
			js_path = path.normalize(js_path);
			var minify_code = function(s){
				s = s.replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
				s = s.replace(/\s*([\r\n]+)\s*/g, '$1');
				return s;
			};
			config.mkdirRecursive(path.dirname(js_path), 777, function(){
				var out_file = js_path + '.js';
				var data = {};
				var in_file;
				in_file = js_path.replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + '.tpl';
				var map = config.readJSONFile(path.dirname(in_file)+'/map.json');
				var stpl = map[req.path.split('.')[0].slice(1)];
				if(stpl){ // 有作映射读配置合并模板
					stpl = stpl.split(',');
					stpl.forEach(function(one, i){
						in_file = String(path.dirname(js_path) + '/').replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + one + '.tpl';
						var s = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
						s = minify_code(s);
						data[one] = s;
					});

					data = "define(" + JSON.stringify(data) + ");";
					fs.writeFile(out_file, data, {mode:'777'}, function(){
						return next();
					});
				}else{ // 找单个文件
					fs.exists(in_file, function(exists){
						if(exists){
							var s = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
							data[path.basename(in_file).split('.')[0]] = minify_code(s);
							data = "define(" + JSON.stringify(data) + ");";
							fs.writeFile(out_file, data, {mode:'777'}, function(){
								return next();
							});
						}else{ // 文件不存在
							return next();
						}
					});
				}
			});
		}else{
			return next();
		}
	},

	file_combo: function(file){
		var files = config.map_combo_file[file].split(',');
		var static_public = process.cwd() + '/' + config.staticDir;
		return files.map(function(one){
			return fs.readFileSync(path.normalize(static_public + path.dirname(file) + '/' + one), {
				encoding:'utf8',
				flag: 'r'
			});
		}).join('');
	},

	/*
	 * 简单的http2.0 combo处理，未做304等状态处理，只供开发使用
	 * */
	combo: function(req, res, next){
		var static_public = path.normalize(process.cwd() + '/' + config.staticDir);

		if(req.path in config.map_combo_file){
			res.end(config.file_combo(req.path));
			return false;
		}
		if(/\?\?/.test(req.originalUrl)){
			var i = req.originalUrl.indexOf('??');
			var file_list = req.originalUrl.slice(i+2).split('?')[0].split(',');
			var ret = '';
			var type = file_list[file_list.length-1].split('.').reverse()[0];
			var types = {
				"js": "application/x-javascript",
				"css": "text/css"
			};
			if(type==='js' || type==='css'){
				// 跳转，如：http://localhost/public/js??jquery-min.js,jquery-window.js?_a=1&v=201502110322
				//        => http://localhost/public/js/??jquery-min.js,jquery-window.js?_a=1&v=201502110322
				if(req.path[req.path.length-1]!=='/'){
					res.redirect(req.originalUrl.replace(/\?\?/, '/??'));
					// res.writeHead(302);
					return res.end('');
				}
			}else{ //暂时支付css和js，其它暂时没必要处理
				return next();
			}

			Promise.all(file_list.map(function(one){
				// return new Promise(function(resolve, reject){
				// 	fs.exists(path.normalize(static_public + req.path + one), function(exist){
				// 		if(exist){
				// 			resolve(fs.readFileSync(path.normalize(static_public + req.path + one), {
				// 				encoding:'utf8',
				// 				flag: 'r'
				// 			}));
				// 		}else{
				// 			reject();
				// 		}
				// 	});
				// });
				return Promise.resolve().then(function(){
					var file = req.path + one;
					if(config.map_combo_file[file]){
						return config.file_combo(file);
					}else{
						return fs.readFileSync(path.normalize(static_public + file), {
							encoding:'utf8',
							flag: 'r'
						});
					}
				});
			})).then(function(ret){
				res.writeHead(200, {"Content-Type":types[type]});
				return res.end(ret.join(''));
			})['catch'](function(err){
				return next();
			});
		}else{
			return next();
		}
	},

	readJSONFile: function(p){
		var json = {};
		try{
			// json = require(p);
			// 不用上面的代码是因为想在改变map.json时不用重启服务，缺点就是每次都要读文件，但是开发环境值得
			var ret = fs.readFileSync(path.normalize(p), {encoding:'utf8', flag: 'r'});
			json = JSON.parse(ret);
		}catch(e){}
		// console.log(json);
		return json;
	}
};
module.exports = config;
