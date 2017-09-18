var project = 'academy/summer';
var pad = function(n, c){
	if((n = n + "").length < c){
		return new Array(++c - n.length).join("0") + n;
	}else{
		return n;
	}
};
var now = new Date();
var tArray = [
	now.getFullYear(),
	pad(now.getMonth()+1, 2),
	pad(now.getDate(), 2),
	pad(now.getHours(), 2),
	pad(now.getMinutes(), 2)
];
fis.config.set('timestamp', tArray.join(''));
fis.config.set('settings.spriter.csssprites', {
    //图之间的边距
    margin: 10
});
fis.config.merge({
	modules : {
		parser : {
			sass : 'sass',
			scss : 'sass'
		}
	},
	roadmap : {
		domain:'/' + project,
		ext: {
			scss : 'css',
			sass : 'css'
		},
		path : [{
			reg : 'map.json',
			release : '/maps/map-'+project+'.json'
		}, {
			// scss目录不发布
			reg:/\/scss\//i,
			release:false
		}, {
			// ejs文件不发布
			reg:'*.ejs',
			release:false
		}, {
			reg:/\/html.*/i,
			release:'$&'
		}, {
			reg:/\/tpls.*/i,
			release:'$&',
			query: '?t=${timestamp}'
		},
		{
			// 将css里的的图片与其它静态资源加上版本号
			reg:/\/(css|images)\/([^\/]+\.)(ico|gif|jpe?g|png)/i,
			release:'/images/$2$3',
			query: '?t=${timestamp}'
		}]
	},
	settings : {},
    pack : {
    		'css/share.css': 'css/share.css'
    },
	deploy : {
		dist : {
			exclude : /\/_parts\/|\/views\/|.*\.scss/i,
			to: "../../../Striker/" + project
		}
	}
});
