/**
 * Created by Alienzheng on 2015/12/17.
 * 通用模块
 * 一些常用的通用处理方法
 */
(function(window,undefined){
	window.upbox = window.upbox || {};
	/**
	 * 获取url中的某个参数
	 * @param {String} name 需要获取的参数名
	 * @param {String} url 需要获取参数的url，不填则默认当前url地址
	 */
	upbox.getUrlParam = function(name, url){
		if(url == undefined)
			url = location.search;
	    var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
	    if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, " ")); return "";
	};
	/**
	 * 常量
	 */
	//版本号
	upbox.getVersion = function(){
		return 'v1.3.0';
	}
	//cdnDomain
	upbox.cdnDomain = 'https://cdn.upbox.com.cn/www';
	//应用宝下载链接
	upbox.DOWNLOAD = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.ppsports.upbox';
	//主icon
	upbox.ICON_LOGO = upbox.cdnDomain + '/common/images/icon-upbox.png';
	//合法域名管理
	upbox.hosts = {
		wife:[
			'www.upbox.com.cn',
			'app.upbox.com.cn',
			'events.upbox.com.cn',
			'tests.upbox.com.cn',
			'votes.upbox.com.cn',
			'api.upbox.com.cn'
		],
		uat:[
			'dev.upbox.com.cn:4443',
			'dev.upbox.com.cn'
		]
	}
	/**
	 * 全部微信菜单列表
	 */
	upbox.weChatMenuAll = ['menuItem:originPage','menuItem:copyUrl','menuItem:openWithQQBrowser','menuItem:share:appMessage','menuItem:share:timeline','menuItem:openWithSafari','menuItem:share:email','menuItem:share:QZone','menuItem:share:qq'];
	/**
	 * 获取url全部参数并return一个数组
	 * @param {String} url 需要获取参数的url，不填则默认当前url地址
	 */
	upbox.getParams = function (url) {
		var name, value;
		var str = url || window.location.search; //取得整个地址栏
		var num = str.indexOf ("?")
		str = str.substr (num + 1); //取得所有参数   stringvar.substr(start [, length ]
		var arr = str.split ("&"); //各个参数放到数组里
		var params = {};
		for (var i = 0; i < arr.length; i++) {
			num = arr[i].indexOf ("=");
			numh = arr[i].indexOf('#');
			if (num > 0) {
				name = arr[i].substring (0, num);
				if(numh != -1){
					value = arr[i].substr (num + 1,numh - num - 1);
				}else{
					value = arr[i].substr (num + 1);
				}
				params[name] = value;
			}
		}
		return params;
	};
	//生成随机字符串
	upbox.generateMixed = function(n){
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		n = n || 16;
   	var res = "";
   	for(var i = 0; i < n ; i ++) {
	  	var id = Math.ceil(Math.random()*35);
      res += chars[id];
   	}
   	return res;
	}
	upbox.formateData = function(data){
		$.each(data,function(i,e){
			if(e != null && (e instanceof Object || e instanceof Array)){
				data[i] = util.formateData(e);
			}else if(typeof(e) == 'string'){
				e = e.split('\\');
				data[i] = e.join('/');
			}
		});
		return data;
	};
	/**
	 * 获取接口方法
	 * @param {String} projectName 项目名
	 * @param {String} interface 接口方法名
	 * @param {String} hostName host
	 */
	upbox.getInterface = function(projectName,interface,hostName){
		var url = '';
		var testPort = upbox.getUrlParam('testPort') || window.testPort;
		var wife = {
			APP_WEB:{
				projectName:'appweb',
				host:'https://api.upbox.com.cn/'
			},
			upboxApi:{
				projectName:'upboxApi',
				// host:'https://rescue.upbox.com.cn/'
				host:'https://api.upbox.com.cn/'
			},
			match:{
				projectName:'',
				host:'//events.upbox.com.cn'
			},
			milan:{
				projectName:'milan',
				host:'//events.upbox.com.cn/'
			},
			aliPay:{
				projectName:'',
				host:'//'
			},
			wxPay:{
				projectName:'',
				host:'https://app.upbox.com.cn/wechatpay/index.html'
			},
			wxJava:{
				projectName:'wechatJava',
				host:'//component.upbox.com.cn'
			},
			cfl:{
				projectName:'cfl',
				host:'https://api.upbox.com.cn/'
			}
		}
		var uat = {
			upboxApi:{
				projectName:'upboxApi',
				host:'https://dev.upbox.com.cn/'
			},
			APP_WEB:{
				projectName:'APP_WEB',
				host:'https://dev.upbox.com.cn/'
			},
			aliPay:{
				projectName:'',
				host:'//'
			},
			wxPay:{
				projectName:'',
				host:'https://app.upbox.com.cn/wechatpay/index_uat.html'
			},
			wxJava:{
				projectName:'wechatJava',
				host:'//component.upbox.com.cn'
			}
		}
		var girlfriend = {
			APP_WEB:{
				projectName:'APP_WEB',
				host:'https://dev.upbox.com.cn:3443/'
				// host:'http://dev.upbox.com.cn:8089/''
			},
			APP_WEB_CZ:{
				projectName:'APP_WEB',
				host:'http://10.10.2.177:8800/'
				// host:'http://dev.upbox.com.cn:8089/''
			},
			upboxApi:{
				projectName:'upboxApi',
				// host:(location.host=='dev.upbox.com.cn:8072'?'http://dev.upbox.com.cn/':'http://dev.upbox.com.cn:3380/')
				// host:'http://10.10.2.159:8080/'
				host:'https://dev.upbox.com.cn:3443/'
				// host:'https://dev.upbox.com.cn/'
			},
			upboxApi_YXH:{
				projectName:'Chelsea-MIC',
				host:'http://10.10.2.70:8089/'
			},
			upboxApi_HYX: {
				projectName:'upboxApi',
				host:'http://10.10.2.132:8080/'
			},
			upboxApi_FF:{
				projectName:'upboxApi',
				host:'http://10.10.2.75:8080/'
			},
			upboxApi_FF2:{
				projectName:'Chelsea-MIC',
				host:'http://10.10.2.75:8080/'
			},
			upboxApi_QQ:{
				projectName:'upboxApi',
				host:'http://10.10.2.159:8080/'
			},
			match:{
				projectName:'',
				host:'http://ub.dev.zhetao.com'
//				host:'http://events.upbox.com.cn'
			},
			milan:{
				projectName:'upboxTestmilan',
				host:'http://dev.upbox.com.cn:3380/'
			},
			pay:{
				projectName:'wechatpay',
				host:'//app.upbox.com.cn'
			},
			cfl:{
				projectName:'cfl',
				host:'https://api.upbox.com.cn/'
			},
			wxJava:{
				projectName:'wechatJava',
				host:'//component.upbox.com.cn'
			},
			wxPay:{
				projectName:'',
				host:'http://app.upbox.com.cn/wechatpay/index_dev.html'
			},
			OperTool:{
				projectName:'OperTool',
				host:'http://10.10.1.24:8080/'
			}
		}
		var hostname = window.location.host,
				dataResource;
		if(upbox.appInstall.isUPBOX){
			dataResource = upbox.appInstall.isIOS?'UPMIC_IOS_WEB':'UPMIC_ANDROID_WEB';
		}else{
			dataResource = 'UPMIC_WEB';
		}
		if(upbox.hosts.wife.indexOf(hostname)>=0){
			url += wife[projectName].host + wife[projectName].projectName;
		}
		else if(upbox.hosts.uat.indexOf(hostname)>=0){
			if(upbox.getUrlParam('testDomain')){
				url +=upbox.getUrlParam('testDomain');
				sessionStorage.setItem('testDomain',upbox.getUrlParam('testDomain'));
			}
			else if(sessionStorage.getItem('testDomain')){
				url +=sessionStorage.getItem('testDomain');
			}
			else{
				url += uat[projectName].host + uat[projectName].projectName;
			}
		}
		else{
			if(upbox.getUrlParam('testDomain')){
				url +=upbox.getUrlParam('testDomain');
				sessionStorage.setItem('testDomain',upbox.getUrlParam('testDomain'));
			}
			else if(sessionStorage.getItem('testDomain')){
				url +=sessionStorage.getItem('testDomain');
			}
			else{
				url += girlfriend[projectName].host + girlfriend[projectName].projectName;
			}
		}
		// }
		return url + '/' + interface + '?dataResource=' + dataResource + '&appCode=' + upbox.appInstall.appCode;
	};
	/**
	 * 打开app相关操作
	 */
	upbox.appInstall = {
		isMobile	: /Mobile/gi.test(navigator.userAgent),
		isChrome	: navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/),
		isAndroid	: navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
		isIOS			: navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		isWeixin	: /MicroMessenger/gi.test(navigator.userAgent),
		isWeibo		: /Weibo/gi.test(navigator.userAgent),
		isQQ			: /QQ\//gi.test(navigator.userAgent),
		isUPBOX		: /upbox/gi.test(navigator.userAgent),
		appCode		: navigator.userAgent.indexOf('upbox ')>=0?navigator.userAgent.substr(navigator.userAgent.indexOf('upbox ')+6):'2.3.0'
	};
	//分享提示图
	upbox.shareTip = {
		show:function(){
			_this = upbox.shareTip;
			if($('#share-tip').length){
				return false;
			}
			$('body').append('<a id="share-tip" class="share-tip" style="background-image: url(https://www.upbox.com.cn/common/images/share-tip.png);"></a>');
			$('#share-tip').on('click',function(){
				_this.hide();
			});
		},
		hide:function(){
			$('#share-tip').remove();
		}
	}
	/**
	 * APP交互方法
	 */
	upbox.APP = {
		//获取到token后的统一处理
  	tokenHandler:function(token){
  	},
  	userIdHandler:function(token){
			location.reload();
  	},
		//userInfo处理
		getUserInfoHandler:function(res){
			console.log(res,123);
		},
	   isAPP:function(){
	   		return upbox.appInstall.isUPBOX;
	   }
	}

	/**
	 * 设置页面标题
	 * @param {Object} title 标题文案
	 */
	upbox.setTitle = function(title){
		$('title').text(title);
		// if(window.WebViewJavascriptBridge){
		//
		// 	window.WebViewJavascriptBridge.callHandler('setTitle',{'title':title},function(res){
		// 	});
		// }else{
		//
		// }
		//微信等webview中解决title不显示问题
//		var $iframe = $('<iframe src="/." style="display:none;"></iframe>').on('load', function(){
//		setTimeout(function() {
//			$iframe.off('load').remove();
//		}, 0)}).appendTo($('body'));
	};
	/**
	 * 微信授权
	 */
	upbox.getUnionId = function(url){
		url = url || location.href;
		window.location.href = 'https://component.upbox.com.cn/wechatJava/wxScope_wxScope.do?topenid=gh_c5094b4f5264&scope_base=snsapi_userinfo&REDIRECTURL='+encodeURIComponent('http://app.upbox.com.cn/jump.html?rdurl='+encodeURIComponent(url));
	}
	upbox.getLocalUnionId = function(url){
		url = url || location.href;
		window.location.href = 'https://component.upbox.com.cn/wechatJava/wxScope_wxScope.do?topenid=gh_c5094b4f5264&scope_base=snsapi_userinfo&REDIRECTURL='+encodeURIComponent('http://app.upbox.com.cn/jump0.html?rdurl='+encodeURIComponent(url));
	}
	/**
	 * 验证unionId
	 */
	upbox.checkUnionId = function(options){
		options = $.extend(true,{
			phone:'',
			callback:function(){
				window.location.href = '/user'
			},
			error:function(){
				alert('您的账号异常，请联系客服小激！');
			}
		},options);
		options.unionId = options.unionId || options.unionid || sessionStorage.unionid || upbox.getUrlParam('unionid');
		sessionStorage.unionid = options.unionId;
		sessionStorage.wxheadimg = upbox.getParams().wxheadimg?(upbox.getParams().wxheadimg+'?'):'';
		sessionStorage.wxnickname = decodeURI(upbox.getParams().wxnickname) || '';
		$('#up-login-pop').remove();
		var jsonData = {
			source:1,
			unionid:options.unionId,
			userStatus:'-1'
		}
		jsonData.thirdName = decodeURIComponent(sessionStorage.wxnickname);
		jsonData.thirdIcon = sessionStorage.wxheadimg.replace('http://','https://');
		upboxAjax.get({
			// url:upbox.getInterface('upboxApi','interceptor!existsUnionidMethod.do'),
			url:upbox.getInterface('upboxApi','interceptor!saveLoginThirdUserWebMethod.do'),
			data:jsonData,
			success:function(res){
				if(res.ret==1){
					upbox.cryptoUserId(res,options);
					if(res.result.taskInfo && res.result.taskInfo.taskStatus == 1){
						// res.result.taskInfo.taskStatus = 1;
						upbox.notification.mission({data:res.result.taskInfo});
					}
				}else{
					//用户被禁用
					options.status = '4';
					upbox.loginPop.loginStep2(options);
				}
			},
			error:function(){
				options.error();
			}
		});
	}
	/**
	 * 获取页面分享信息方法
	 * @param {Object} els 记录分享信息对应的元素
	 */
	upbox.getShareInfo = function(els){
		if(els){
			els = JSON.parse(els);
		}
		els = $.extend(true, {
			title: 'shareTitle', // 分享标题
		    desc: 'shareDesc', // 分享描述
		    link: 'shareLink', // 分享链接
		    imgUrl: 'shareImg', // 分享图标
		    type: 'shareType', // 分享类型,music、video或link，不填默认为link
		    dataUrl: 'shareDataUrl' // 如果type是music或video，则要提供数据链接，默认为空
		}, els);
		var defIcon = 'http://cdn.upbox.com.cn/www/common/images/icon-upbox.png';
		var upShareInfo = {
			"title":$('#' + els.title).val() || $('title').text(),
			"imgUrl":$('#' + els.imgUrl).val() || $('#wx_logo img').attr('src') || defIcon,
			"desc":$('#' + els.desc).val() || window.location.host,
			"link":$('#' + els.link).val() || window.location.href
		};
		upShareInfo = JSON.stringify(upShareInfo);
		if(els.appType && els.appType == 'Android'){
			window.control.onGetShareInfoResult(upShareInfo);
		}else{
			return upShareInfo;
		}
	};
	//通知
	upbox.notification = {
		getHTML:function($data){
			return notiHTML = '<div class="noti-item">'
									 + '<img class="task-img" src="' + $data.taskImgurl + '" />'
									 + '<div class="task-name">' + $data.taskName + '</div>'
									 + '<div class="task-remark">' + $data.taskRemark + '</div>'
									 + '<div class="jib"><span>任务奖励</span>'
									 + ($data.userCount ? ('<span class="user-count"><i></i>+' + $data.userCount + '</span>'):'')
									 + ($data.teamCount ? ('<span class="team-count"><i></i>+' + $data.teamCount + '</span>'):'')
									 + '</div>'
									 + '</div>';
		},
		addMission:function(notiHTML){
			$('body').append(notiHTML);
			setTimeout(function(){
				$('#upbox-notification-mission').remove();
			},30000);
		},
		//任务通知
		mission:function(options){
			// return false;
			$this = upbox.notification;
			options = $.extend(true, {
				type:1
			}, options);
			if(upbox.appInstall.isUPBOX){
				if(options.data && (options.data.taskStatus == 1 || options.data.taskStatus == 2)){
					options.data.type = options.type;
					window.control.showMissionModal(JSON.stringify(options.data));
					return false;
				}
			}
			var notiHTML = '',
					mutiFlag = false;
			if(options.mutiDate && options.mutiDate.length){
				notiHTML = '<div id="upbox-notification-mission" class="upbox-notification"><div class="noti-inner">';
				$.each(options.mutiDate,function(i,e){
					if(e.taskStatus=='1'){
						notiHTML += $this.getHTML(e);
						mutiFlag = true;
					}
				});
				notiHTML += '</div></div>';
				if(mutiFlag){
					$this.addMission(notiHTML);
				}
			}else if(options.data && options.data.taskStatus == 1){
				notiHTML = '<div id="upbox-notification-mission" class="upbox-notification"><div class="noti-inner">'
										 + $this.getHTML(options.data)
										 + '</div></div>';
				$this.addMission(notiHTML);
			}
		}
	}
	/**
	 * 数据加载动画
	 */
	upbox.loading = {
		/**
		 * 显示加载动画的方法
		 * @param {Object} options 配置项
		 * @param {String} parent 父元素id 形式#id 不传默认父元素为body
		 * @param {String} type 显示方式 fixed:全屏覆盖 normal(暂不开放):在指定位置占位显示 不传默认fixed
		 * @param {String} id 加载动画容器ID 不填默认up-loading
		 * @param {String} className 若需要自定义样式，可传入className参数作为主容器类名
		 * @param {String} animation 加载动画类型 rotate:旋转 scale:缩放 jump:弹跳
		 * @param {String} backgroundColor 遮罩的背景色 支持rgb(0,0,0) rgba(0,0,0,0.5) #000三种形式，不填默认rgba(0, 0, 0, .6)
		 * @param {String} fontColor 字体颜色 支持rgb(0,0,0) rgba(0,0,0,0.5) #000三种形式，不填默认#FFF
		 *
		 */
		show:function(options){
			options = $.extend(true, {
				'parent':'body',
				'type':'fixed',
				'id':'up-loading',
				'animation':'rotate',
				'content':'请稍候'
			}, options);
			//若已存在loading则不继续执行
			if($('#' + options.id).length){
				return false;
			}
			var loadingHtml = '<div id="' + options.id + '" class="mask" style="z-index:16800;"><div class="loading-inner"><div class="up-loading"><span class="loading-logo"></span><div class="logo-bg"></div></div><p class="loading-txt">' + options.content + '</p><div></div>';
			$(options.parent).append(loadingHtml);
			//若有自定义类名，加上
			if(options.className){
				$('#' + options.id).addClass(options.className);
			}
			//loading类型 fixed:全屏覆盖 normal:静态占位
			if(options.type == 'fixed'){
				$('#' + options.id).css('height',$(window).height());
			}else if(options.type == 'small'){
				$('#' + options.id).css('background', 'rgba(0,0,0,0)');
				$('#' + options.id + ' .loading-inner').css({ 'position': 'fixed', 'height':'100px!important','height':'100px','width':'130px','border-radius':'10px','left':'50%','margin-left':'-65px','top':'50%','margin-top':'-50px','background':'rgba(0,0,0,0.8)'});
				$('#' + options.id + ' .up-loading').css({'position':'static','margin':'20px auto 0'});
				$('#' + options.id + ' .loading-txt').css({'margin-top':'15px'});
			}
			//loading背景颜色
			if(options.backgroundColor){
				$('#' + options.id).css('background-color',options.backgroundColor);
			}
			//字体颜色
			if(options.fontColor){
				$('#' + options.id).css('color',options.fontColor);
			}
			$('#' + options.id).find('.up-loading').addClass('b'+ options.animation);
		},
		hide:function(id){
			id = id?id:'up-loading';
			$('#' + id).remove();
		}
	};
	upbox.validator = {
		isMobile:function(mobile){
			if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(mobile)){
				return false;
			}else{
				return true;
			}
		},
	};
	upbox.formToJson = function($el){
		var data = {};
		$el.find('input').each(function(i,e){
			if($(this).attr('name')){
				var valTmp;
				if($(this).attr('type') == 'checkbox'){
					valTmp = $(this).prop('checked');
				}else if($(this).attr('type') == 'file'){
					valTmp = $(this)[0].files[0] || '';
				}else{
					valTmp = $(this).val();
				}
				data[$(this).attr('name')] = valTmp;
			}
		});
		return data;
	};
	//token转userId
	upbox.tokenToUserId = function(token,callback){
//		alert(token);
		upboxAjax.get({
			url:upbox.getInterface('APP_WEB','webActivity!getUserShortInfoMethod.do'),
			data:{token:upbox.getUrlParam('token')||token},
			success:function(res){
//				alert(JSON.stringify(res));
				if(res.ret == 1 && $.isFunction(callback)){
//					$('body').append('<div>'+ JSON.stringify(res.result)+'</div>');
					callback(res.result.userid.user_id);
				}else{
					alert('err');
				}
			}
		})
	}
	//安卓调用的token传递方法
	upbox.receiveToken = function(res){
		res = JSON.parse(res);
		if(res.userId){
			Cookies.set('userId',res.userId);
			upbox.APP[(upbox.appCallback?upbox.appCallback:'userIdHandler')](res);
		}else if(res.token){
			upbox.tokenToUserId(res.token,function(userId){
				res.userId = userId;
				Cookies.set('userId',userId);
				upbox.APP[(upbox.appCallback?upbox.appCallback:'userIdHandler')](res);
			})
		}else{
			res.userId = '';
			upbox.APP[(upbox.appCallback?upbox.appCallback:'userIdHandler')](res);
		}
//		if(res.token){
//			upbox.APP[(res.callback?res.callback:'tokenHandler')](res);
//		}
	}
	//获取用户Id 220后放弃
	upbox.getUserId = function(options){
		var _this = upbox,_appInstall = upbox.appInstall,token;
		upbox.appCallback = options.data.callback;
		if(_appInstall.isAndroid && !_appInstall.isWeibo && window.control && window.control.onGetToken){
			window.control.onGetToken();
//			window.control.onGetToken(options.data);
		}else if(_appInstall.isIOS && (navigator.userAgent.indexOf('upbox')>0 || (!_appInstall.isWeibo && window.WebViewJavascriptBridge))){
			upbox.iOSBridge.callHandler('requestToken',options.data,function(res){
				if(res.userId){
						upbox.APP[(res.callback?res.callback:'userIdHandler')](res);
				}else if(res.token){
					upbox.tokenToUserId(res.token,function(userId){
						res.userId = userId;
						upbox.APP[(res.callback?res.callback:'userIdHandler')](res);
					})
				}else{
					res.userId = '';
					upbox.APP[(res.callback?res.callback:'userIdHandler')](res);
				}
				upbox.APP[(res.callback?res.callback:'tokenHandler')](res);
			});
		}else if(Cookies.get('userId') || sessionStorage.userId){
			upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]({userId:Cookies.get('userId')});
		}else if(upbox.getUrlParam('token')){
			upbox.tokenToUserId(upbox.getUrlParam('token'),function(userId){
				upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]({userId:userId});
			});
		}else if(_appInstall.isWeixin){
			if(sessionStorage.unionid || upbox.getUrlParam('unionId')){
				upbox.checkUnionId({
					callback:upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]
				})
			}else{
				upbox.getUnionId();
			}
		}else{
			upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]({userId:''});
		}
	}
	//检查登录状态 220后放弃
	upbox.checkLogin = function(options){
		var _this = upbox,_appInstall = upbox.appInstall;
		upbox.appCallback = options.data.callback;
		if(Cookies.get('userId')){
			upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]({userId:Cookies.get('userId')});
		}else if(upbox.getUrlParam('token')){
			upbox.tokenToUserId(upbox.getUrlParam('token'),function(userId){
				upbox.APP[(options.data.callback?options.data.callback:'userIdHandler')]({userId:userId});
			});
		}/*if(_appInstall.isWeixin){
		}*/else if(_appInstall.isAndroid && !_appInstall.isWeibo && window.control && window.control.onGetToken){
			window.control.onGotoLogin();
		}else if(_appInstall.isIOS && !_appInstall.isWeibo && window.WebViewJavascriptBridge){
			upbox.appCallback = options.data.callback;
			upbox.iOSBridge.callHandler('requestLogin',options.data,function(res){
				upbox.APP[(res.callback?res.callback:'tokenHandler')](res);
			});
		}else{
			upbox.loginPop.validate({
				md5:options.md5,
				callback:upbox.APP[(options.data.callback?options.data.callback:'tokenHandler')]
			});
		}
	}
	//通用发起登录方法 220后放弃
	upbox.goLogin = function(options){
		var _this = upbox,_appInstall = upbox.appInstall;
		upbox.appCallback = options.data.callback;
		//各端登录逻辑
		if(_appInstall.isAndroid && !_appInstall.isWeibo && window.control && window.control.onGetToken){
			window.control.onGotoLogin();
		}else if(_appInstall.isIOS && !_appInstall.isWeibo && window.WebViewJavascriptBridge){
			upbox.appCallback = options.data.callback;
			upbox.iOSBridge.callHandler('requestLogin',options.data,function(res){
				upbox.APP[(res.callback?res.callback:'tokenHandler')](res);
			});
		}else{
			upbox.loginPop.validate({
				md5:options.md5,
				title:options.title,
				callback:upbox.APP[(options.data.callback?options.data.callback:'tokenHandler')]
			});
		}
	}
	//220之后版本，接收APP返回值方法
	upbox.receive = {
		//用户信息
		userInfo:function(res){
			// window.control.alertTest(res);
			console.log(res);
			res = JSON.parse(res);
			if(res.ret==1){
				if(location.hostname == 'api.upbox.com.cn'){
					upbox.APP[upbox.receive.userInfoCallback](res.result);
					return false;
				}
				upbox.cryptoUserId(res,{
					'callback':upbox.APP[upbox.receive.userInfoCallback]
				});
				return false;
			}
			Cookies.set('_md5','');
			Cookies.set('userId','');
			if(upbox.receive.userInfoLogin){
				window.control.onGotoLogin();
			}else{
				upbox.APP[upbox.receive.userInfoCallback](res);
			}
		},
		pageData:function(res){
			res = JSON.parse(res);
			upbox.APP[upbox.receive.pageDataCallback](res);
			// alert(JSON.stringify(res))
			// if(res.ret==1){
			// 	upbox.APP[upbox.receive.pageDataCallback](res);
			// }
		},
		//分享回调
		shareInfo:function(res){
		}
	}
	//获取用户信息方法
	upbox.getUserInfo = function(options){
		options = $.extend(true,{
			login:false,
			callback:'getUserInfoHandler'
		},options);
		upbox.receive.userInfoCallback = options.callback;
		upbox.receive.userInfoLogin = options.login;
		if(upbox.appInstall.isUPBOX){//打开环境为upbox激战联盟APP且版本>2.2.0
			if(window.control && window.control.getUserInfo){
				window.control.getUserInfo();
			}
		}else{
			var res = {
				ret:1,
				result:{
					md5:Cookies.get('_md5')
				}
			};
			res.result.userId=Cookies.get('DIR_ESU_' + res.result.md5);
			res.result.showName = Cookies.get('showname');
			res.result.headImg = Cookies.get('headImg');
			if((!res.result.userId || !res.result.userId) && options.login){
				if(upbox.appInstall.isWeixin){
					sessionStorage.unionid = sessionStorage.unionid || upbox.getUrlParam('unionId') || '';
					if(sessionStorage.unionid){
						upbox.checkUnionId({
							callback:upbox.APP[options.callback]
						})
					}else{
						upbox.getUnionId();
					}
					return false;
				}
				upbox.loginPop.validate({
					callback:upbox.APP[options.callback]
				});
				return false;
			}else if(res.result.userId && upbox.appInstall.isWeixin){
				sessionStorage.unionid = sessionStorage.unionid || upbox.getUrlParam('unionId') || '';
				if(sessionStorage.unionid){
					upboxAjax.get({
						url:upbox.getInterface('upboxApi','uUser_getUnionidByUserId.do'),
						data:{
							userId:encodeURIComponent(res.result.userId),
							md5:res.result.md5,
							userStatus:1
						},
						success:function(res2){
							if(res2.ret==1 && (res2.result.unionId && res2.result.unionId == sessionStorage.unionid)){
								upbox.APP[options.callback](res);
							}else{
								upbox.checkUnionId({
									callback:upbox.APP[options.callback]
								});
							}
						}

					})
					return false;
				}else{
					upbox.getUnionId();
					return false;
				}
				upbox.APP[options.callback](res);
				return false;
			}
			upbox.APP[options.callback](res);
		}
	}
	//渲染用户头部
	upbox.showUserHead = function(options){
		if(upbox.appInstall.isUPBOX){
			$('#navbar').remove();
			$('.pages').removeClass('navbar-through');
			return false;
		}
		options = $.extend(true,{
			pageId:'',
			loginHandler:function(res){
			// 	location.reload();
			}
		},options)
		var pages = [{
			id:5,
			title:'在线订场',
			url:'/reservation/'
		},{
			id:2,
			title:'发起约战',
			url:'/duel/html/index.html'
		},{
			id:1,
			title:'约战广场',
			url:'/duel/html/duel-list.html'
		},{
			id:4,
			title:'发起报名',
			url:'/sign-up/alone.html'
		},{
			id:3,
			title:'个人中心',
			url:'/uc/'
		}];
		var _md5 = Cookies.get('_md5') || '';
		var userId = Cookies.get('DIR_ESU_' + _md5);
		$('#navbar').html('<div class="navbar-inner"><div id="nav-user-info" class="left"></div><div class="right"><a id="nav-btn-menu" href="javascript:;" class="link"><span></span><i></i></a><ul id="nav-list" class="nav-list"></ul></div></div>')
		if(_md5 && userId){
			$('#nav-user-info').html('<a class="external" href="/uc/">Hi，' + Cookies.get('showName') + '</a>')
			// $('#nav-user-info').html('<a href="/uc/"><img class="user-head" src="' + Cookies.get('headImg') + '" />' + Cookies.get('showName') + '</a>')
		}else{
			$('#nav-user-info').html('<a id="nav-login" href="javascript:;" class="login link">Hi，<u>请登录</u></a>')
		}
		var listHtml = '';
		$.each(pages,function(i,e){
			var itemClass = '';
			if(e.id==options.pageId){
				$('#navbar #nav-btn-menu>span').text(e.title);
				itemClass = 'cur';
			}
			listHtml += '<li class="' + itemClass + '"><a class="external" href="' + e.url + '">' + e.title + '</a></li>'
		});
		$('#navbar #nav-list').html(listHtml);
		$('#nav-btn-menu').on('click',function(e){
			e.stopPropagation();
			if($('#nav-list').hasClass('show')){
				$('#nav-list').removeClass('show');
			}else{
				$('#nav-list').addClass('show')
			}
			// $('#nav-list').addClass('show');
			return false;
		})
		$('#nav-logout').on('click',function(){
			Cookies.set('_md5','');
			location.reload();
		});
		$('#nav-login').on('click',function(){
			options.loginHandler();
		});
		$('body').on('click',function(e){
			if($('#nav-list').hasClass('show')){
				$('#nav-list').removeClass('show');
			}
		});
	}
	//
	upbox.cryptoUserId = function(res,options){
		//加密并存储用户信息
		require.config({
			paths:{
				'crypto' : '//cdn.upbox.com.cn/www/common/scripts/amd/crypto'
			},
		});
		require(['crypto'],function(crypto){
			if(res.result.md5){
				Cookies.set('_md5',res.result.md5,new Date(new Date().valueOf() + 30*24*60*60*1000));
				Cookies.set('DIR_ESU_' + res.result.md5,res.result.userId,new Date(new Date().valueOf() + 30*24*60*60*1000));
				Cookies.set('userId',crypto.decrypt(res.result.userId,res.result.md5),new Date(new Date().valueOf() + 30*24*60*60*1000));
			}else{
				res.result.md5 = Cookies.get('_md5') || upbox.generateMixed();
				Cookies.set('_md5',res.result.md5,new Date(new Date().valueOf() + 30*24*60*60*1000));
				Cookies.set('userId',res.result.userId,new Date(new Date().valueOf() + 30*24*60*60*1000));
				res.result['DIR_ESU_' + res.result.md5] = crypto.encrypt(res.result.userId,res.result.md5);
				res.result.userId = res.result['DIR_ESU_' + res.result.md5];
				Cookies.set('DIR_ESU_' + res.result.md5,res.result['DIR_ESU_' + res.result.md5],new Date(new Date().valueOf() + 30*24*60*60*1000));
			}
			Cookies.set('showName',res.result.realname || res.result.nickname || res.result.name,new Date(new Date().valueOf() + 30*24*60*60*1000));
			Cookies.set('headImg',res.result.imgurl,new Date(new Date().valueOf() + 30*24*60*60*1000));
			if(res.result.lbs && res.result.lbs.lng){
				sessionStorage.location = res.result.lbs.lng+','+res.result.lbs.lat
			}else{
				sessionStorage.location = '';
			}
			upboxAjax.get({
				url:upbox.getInterface('upboxApi','uUser_createRelevanceCurrency.do'),
				data:{
					userId: encodeURIComponent(res.result.userId),
					md5:res.result.md5,
					userStatus:"1"
				}
			});
			// alert(JSON.stringify(res))
			options.callback(res);
		});
	}
	//获取页面数据
	upbox.getPageData = function(options){
		options = $.extend(true,{
		},options);
		// alert(1)
		upbox.receive.pageDataCallback = options.callback;
		if(upbox.appInstall.isUPBOX){
			window.control.getPageData();
		}
		// alert(2)
	}
	/**
	 * loginPop
	 */
	upbox.loginPop = {
		css:{
			mask:'position: fixed;left: 0;top: 0;width: 100%;background-color: rgba(0,0,0,0.8);color: #FFF;z-index:10080;height:100%;color:#333;',
			box:'background:rgba(255,255,255,.85); position: fixed; top: 50%; left: 50%; width: ' + document.body.scrollWidth*0.85 + 'px; padding: 15px; margin-left: -' + document.body.scrollWidth*0.425 + 'px; margin-top: -110px; box-sizing:border-box;-webkit-box-sizing:border-box;',
			boxW:'background:#FFF;',
			ipt:'width:100%;height:32px;line-height:20px;margin: 5px 0;padding:6px 10px;font-size:15px;border:1px solid #969696;border-radius:3px;box-sizing:border-box;-webkit-box-sizing:border-box;',
			ipt2:'border-color:#b5b5b5;height:40px;pading:10px;',
			iptS:'width:70%;',
			getCode:' position: absolute;right: 0;background: #2dafff;color: #FFF;font-size: 15px;height: 32px;top: 5px;width: 100px;line-height: 32px;border-radius: 0 3px 3px 0;text-align: center;text-decoration: none!important;',
			getCode2:'height:40px;line-height:40px;width:30%;',
			btn:'display:block;width:100%;height:32px;line-height:20px;margin: 5px 0;padding:6px 10px;font-size:15px;border-radius:3px;box-sizing:border-box;-webkit-box-sizing:border-box;background:#033893;color:#FFF;text-align:center;text-decoration:none!important;',
			btn2:'height:40px; padding:10px;',
			btnLogin:'width:60%;background:#2dafff;display:inline-block;',
			forget:'display:inline-block;float:right;height:35px;line-height:35px;padding-right:15px;text-decoration:none!important;',
			closs:'position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;'
		},
		els:{
			err:function(left){
				return '<i class="icon-err" style="background:url(/common/images/icons/icon-warn.png);background-size:100% 100%;position:absolute; width:16px;height:16px; left:' + left + ';top:17px;margin-left:-24px;"></i>'
			}
		},
		setCD:function($el,dis,t){
			$el.addClass('dis').css('background-color','#969696');
			t = t || 120;
			var txt = $el.html();
			var cdInterval = setInterval(function(){
				if(t > 0){
					t--;
					$el.html(t + 's');
				}else{
					$el.removeClass('dis').css('background-color','#2dafff').html(txt);
					clearInterval(cdInterval);
				}
			},1000);
		},
		getCode:function($el,isForget,mobile,url){
			var $this = $el,$form = $('#login-pop-form');
			var _this = upbox.loginPop;
			var mobile = mobile || $form.find('input[name=phone]').val();
			if(upbox.validator.isMobile(mobile)){
				var jsonData = {phone:mobile,userStatus:'-1',appCode:('2.0.4' || upbox.getUrlParam('appCode'))};
				if(isForget){
					jsonData.rt = 'forgetPwd';
				}
				$.ajax({
					type:'get',
					url:url || upbox.getInterface('upboxApi','interceptor!getVerCodeMethod.do'),
					async:true,
					dataType:'jsonp',
					jsonp:'jsonCallback',
					data:jsonData,
					success:function(res){
						if(res.ret == 1){
							_this.setCD($this,{'background-color':'#969696'});
							Cookies.set('getCode',false,new Date(new Date().valueOf() + 30*24*60*60*1000));
						}else{
							$form.find('.err').html(res.errorMsg);
						}
					}
				});
			}else{
				$form.find('.err').html('请输入正确的手机号码');
				$form.find('input[name=phone]').css('border-color','#969696');
			}
		},
		//设置Cookies
		setCookies:function(data){
			Cookies.set('userId',data.result.userId,new Date(new Date().valueOf() + 30*24*60*60*1000));
			Cookies.set('showName',data.result.userName,new Date(new Date().valueOf() + 30*24*60*60*1000));
			$('#up-login-pop').remove();
		},
		//微信授权登录
		wxBindPhone:function(options){
			upbox.loading.hide();
			options = $.extend(true,{
				phone:'',
				callback:function(){
					window.location.href = '/user'
				},
				error:function(){
					alert('您的账号异常，请联系客服小激动！');
				}
			},options);
			var _this = upbox.loginPop;
			var popCtn = {
				active : upbox.getInterface('upboxApi','interceptor!handleUserInfoMethod.do'),
				ctn : '<div style="text-align:center;font-size:18px;color:#666;">请绑定您的手机号码</div>'
						+ '<div style="position:relative;"><input name="phone" type="tel" maxlength="11" placeholder="手机号" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '" value="' + options.phone + '" /></div>'
						+ '<div class="cf" style="position:relative;"><input name="phonecode" type="text" maxlength="6" placeholder="验证码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '" /><a class="login-pop-get-code" href="javascript:;" style="' + _this.css.getCode + _this.css.getCode2 + '">获取</a></div>'
						+ '<div class="err" style="color:#ff0000;font-size:14px;"></div>'
						+ '<div><a class="login-pop-btn login-pop-submit" style="' + _this.css.btn + _this.css.btn2 + '" >绑定</a></div>'
			}
			var htmlStr = '<div id="up-login-pop" class="up-login-pop" style="' + _this.css.mask + '">'
						+ '<div class="login-pop-ctn" style="' + _this.css.box + _this.css.boxW + '">'
						+ '<form id="login-pop-form" active="' + popCtn.active + '">'
						+ popCtn.ctn
						+ '</form>'
						+ '</div>'
						+ (options.close?('<div class="login-pop-close" style="' + _this.css.closs + '"></div>'):'')
						+ '</div>';
			$('body').append(htmlStr);
			//操作
			var $form = $('#login-pop-form');
			$('#up-login-pop').on('click','.login-pop-get-code:not(.dis)',function(){
				_this.getCode($(this),(options.status=='wjmm' || options.status=='wjh')?true:false,'',upbox.getInterface('upboxApi','interceptor!checkPhoneUnionidMethod.do'));
			});
			$form.find('input[name=phonecode],input[name=phone]').on('focus',function(){
				if($(this).hasClass('err')){
					$(this).val('').removeClass('err').css({'border-color':'#b5b5b5','color':'#333'}).siblings('.icon-err').remove();
				}
			});
			//提交
			$('#up-login-pop').on('click','.login-pop-submit',function(e){
				e.stopPropagation();
				var jsonData = upbox.formToJson($form);
				jsonData.userStatus = '-1';
				jsonData.unionid = options.unionId;
				jsonData.thirdName = decodeURIComponent(sessionStorage.wxnickname);
				jsonData.thirdIcon = sessionStorage.wxheadimg.replace('http://','https://');
				$form.find('input').css('border-color','#969696');
				$form.find('.err').html('');
				$form.find('.icon-err').remove();
				if(!upbox.validator.isMobile(jsonData.phone)){
					var $ipt = $form.find('input[name=phone]');
					$ipt.addClass('err').css({'border-color':'#033893','color':'#FF0000'}).val('请输入正确的手机号');
					$ipt.parent().append(_this.els.err('100%'));
				}else if(jsonData.phonecode == "" || (jsonData.phonecode && jsonData.phonecode.length<6)){
					$form.find('input[name=phonecode]').addClass('err').css({'border-color':'#033893','color':'#FF0000'}).val('验证码错误').parent().append(_this.els.err('70%'));
				}else{
					if(true){//window.location.hostname == 'events.upbox.com.cn'){
						window.sessionStorage['phone'] = jsonData.phone;
					}
					jsonData.idcode = jsonData.phonecode;
					upbox.loading.show({content:'数据提交中'});
					$.ajax({
						type:"get",
						url:$form.attr('active'),
						async:true,
						dataType:'jsonp',
						jsonp:'jsonCallback',
						data:jsonData,
						success:function(res){
							if(res.ret == 1){
								if(res.result.result == 'change'){
									upbox.checkUnionId(options);
									$('#up-login-pop').remove();
									if(res.result.taskInfo){
										upbox.notification.mission({data:res.result.taskInfo});
									}
								}else{
									$form.find('.err').html(res.errorMsg);
								}
							}else{
								$form.find('.err').html(res.errorMsg);
							}
							upbox.loading.hide();
						}
					});
				}
				return false;
			});
		},
		//手机验证
		validate:function(options){
			options = $.extend(true,{
				btnTxt:'下一步',
				phone:'',
				title:'登录UPBOX',
				callback:function(){
					window.location.href = '/user'
				}
			},options);
			if(!options.md5){
				require(['//cdn.upbox.com.cn/www/public/scripts/md5.min.js'],function(md5){
					options.md5 = md5;
				});
			}
			upbox.loading.hide();
			var _this = upbox.loginPop;
			$('#up-login-pop').remove();
			options.unionid = options.unionid || sessionStorage.unionid || upbox.getUrlParam('unionid') || '';
			//是否微信授权且已拿到unionid
			if(upbox.appInstall.isWeixin && options.unionid){
				upbox.checkUnionId(options);
				return false;
			}
			var htmlStr = '<div id="up-login-pop" class="up-login-pop '+(options.class || '')+'" style="' + _this.css.mask + '">'
						+ '<div class="login-pop-ctn" style="' + _this.css.box + _this.css.boxW + '">'
						+ '<form id="login-pop-form" active="' + upbox.getInterface('upboxApi','interceptor!getPhoneStatusMethod.do') + '">'
						+ '<div style="text-align:center;font-size:18px;color:#666;">' + options.title + '</div>'
						+ '<div style="position:relative;"><input name="phone" type="tel" maxlength="11" placeholder="手机号" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '" value="' + options.phone + '" /></div>'
						+ '<div><a class="login-pop-btn login-pop-validate" style="' + _this.css.btn + _this.css.btn2 + '" >' + options.btnTxt + '</a></div>'
						+ '</form>'
						+ '</div>'
						+ (options.close?('<div class="login-pop-close" style="' + _this.css.closs + '"></div>'):'')
						+ '</div>';
			$('body').append(htmlStr);
			//操作
			var $form = $('#login-pop-form');
			$form.find('input[name=phone]').on('focus',function(){
				if($(this).hasClass('err')){
					$(this).val('').removeClass('err').css({'border-color':'#b5b5b5','color':'#333'}).siblings('.icon-err').remove();
				}
			});
			$('#up-login-pop').on('click','.login-pop-close',function(){
				$('#up-login-pop').remove();
			});
			$('#up-login-pop').on('click','.login-pop-validate',function(e){
				e.stopPropagation();
				var jsonData = upbox.formToJson($form);
				// console.log(jsonData);
				if(!upbox.validator.isMobile(jsonData.phone)){
					var $ipt = $form.find('input[name=phone]');
					$ipt.addClass('err').css({'border-color':'#033893','color':'#FF0000'}).val('请输入正确的手机号');
					$ipt.parent().append(_this.els.err('100%'));
				}else{
					upboxAjax.get({
						url:$form.attr('active'),
						data:jsonData,
						success:function(res){
							if(res.ret==1){
								window.sessionStorage['phone'] = jsonData.phone;
								options.status = res.result.status;
								options.phone = jsonData.phone;
								_this.loginStep2(options);
							}
						},
						error:function(){
							alert('网络连接超时，请稍后重试！');
						}
					})
				}
			});
		},
		//登录步骤2
		loginStep2:function(options){
			var _this = upbox.loginPop;
			options = $.extend(true,{
				callback:function(){
					window.location.href = '/user'
				}
			},options);
			var popCtn;
			if(!options.class2){
				options.class = '';
			}
			switch(options.status){
				case '3':
					popCtn = {
						active : upbox.getInterface('upboxApi','interceptor!loginWebMethod.do'),
						ctn : '<div style="text-align:center;font-size:18px;color:#666;">输入密码</div>'
							  + '<div class="cf" style="position:relative;"><input id="pop-pwd" name="loginpassword" type="password" maxlength="14" placeholder="请输入密码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + _this.css.iptS + '"  onkeyup="this.value=this.value.replace(/[, ]/g,\'\')" /><a class="login-pop-forget" href="javascript:;" style="float:right;display:block;line-height:50px;text-decoration:none!important;font-size:14px;overflow:hidden;color:#333;">忘记密码？</a></div>'
							  + '<div class="err" style="color:#ff0000;font-size:14px;"></div>'
							  + '<div><a class="login-pop-btn login-pop-submit" style="' + _this.css.btn + _this.css.btn2 + '" >登录</a></div>'
					}
					break;
				case '1' || '2':
					popCtn = {
						active : upbox.getInterface('upboxApi','interceptor!registerWebMethod.do'),
						ctn : '<div style="text-align:center;font-size:18px;color:#666;">请注册您的账号</div>'
							  + '<div class="cf" style="position:relative;"><input name="phonecode" type="text" maxlength="6" placeholder="验证码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '" /><a class="login-pop-get-code" href="javascript:;" style="' + _this.css.getCode + _this.css.getCode2 + '">获取</a></div>'
							  + '<div class="cf" style="position:relative;"><input id="pop-pwd" name="loginpassword" type="password" maxlength="14" placeholder="请输入密码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '"  onkeyup="this.value=this.value.replace(/[, ]/g,\'\')" /></div>'
							  + '<div class="err" style="color:#ff0000;font-size:14px;"></div>'
							  + '<div><a class="login-pop-btn login-pop-submit" style="' + _this.css.btn + _this.css.btn2 + '" >注册</a></div>'
					}
					break;
				case 'wjmm':
					popCtn = {
						active : upbox.getInterface('upboxApi','interceptor!webGetpassWordMethod.do'),
						ctn : '<div style="text-align:center;font-size:18px;color:#666;">请设置你的密码</div>'
							  + '<div class="cf" style="position:relative;"><input name="phonecode" type="text" maxlength="6" placeholder="验证码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '" /><a class="login-pop-get-code" href="javascript:;" style="' + _this.css.getCode + _this.css.getCode2 + '">获取</a></div>'
							  + '<div class="cf" style="position:relative;"><input id="pop-pwd" name="loginpassword" type="password" maxlength="14" placeholder="请输入密码" class="login-pop-ipt" style="' + _this.css.ipt + _this.css.ipt2 + '"  onkeyup="this.value=this.value.replace(/[, ]/g,\'\')" /></div>'
							  + '<div class="err" style="color:#ff0000;font-size:14px;"></div>'
							  + '<div><a class="login-pop-btn login-pop-submit" style="' + _this.css.btn + _this.css.btn2 + '" >确定</a></div>'
					}
					break;
				case '4':
					popCtn = {
						active : upbox.getInterface('upboxApi','interceptor!webGetpassWordMethod.do'),
						ctn : '<div style="text-align:center;font-size:14px;color:#666;padding:10px 10px 20px;">您的账号存在异常，请联系客服小激！</div>'
							  + '<div><a class="login-pop-btn login-pop-btn-close" style="' + _this.css.btn + _this.css.btn2 + '" >确定</a></div>'
					}
					break;
				default:
					;
			}
			var _this = upbox.loginPop;
			$('#up-login-pop').remove();
			var htmlStr = '<div id="up-login-pop" class="up-login-pop ' + (options.class || '') + '" style="' + _this.css.mask + '">'
						+ '<div class="login-pop-ctn" style="' + _this.css.box + _this.css.boxW + '">'
						+ '<form id="login-pop-form" active="' + popCtn.active + '">'
						+ popCtn.ctn
						+ '</form>'
						+ '</div>'
						+ (options.close?('<div class="login-pop-close" style="' + _this.css.closs + '"></div>'):'')
						+ '</div>';
			$('body').append(htmlStr);
			$('#up-login-pop').on('click','.login-pop-get-code:not(.dis)',function(){
				_this.getCode($(this),(options.status=='wjmm' || options.status=='wjh')?true:false,options.phone);
			});
			$('#up-login-pop').on('click','.login-pop-close,.login-pop-btn-close',function(){
				$('#up-login-pop').remove();
			});
			$('#up-login-pop').on('click','.login-pop-forget',function(){
				options.status = 'wjmm';
				_this.loginStep2(options);
			});
			var $form = $('#login-pop-form');
			$form.find('input[name=loginpassword]').on('focus',function(){
				if($(this).hasClass('err')){
					$(this).val('').attr('type','password').removeClass('err').css({'border-color':'#b5b5b5','color':'#333'}).siblings('.icon-err').remove();
				}
			});
			$form.find('input[name=phonecode]').on('focus',function(){
				if($(this).hasClass('err')){
					$(this).val('').removeClass('err').css({'border-color':'#b5b5b5','color':'#333'}).siblings('.icon-err').remove();
				}
			});
			$('#up-login-pop').on('click','.login-pop-close',function(){
				$('#up-login-pop').remove();
			});
			//密码输入
//			$('#pop-pwd').on('keyup',function(){
//
//			});
			//提交
			$('#up-login-pop').on('click','.login-pop-submit',function(e){
				e.stopPropagation();
				var jsonData = upbox.formToJson($form);
				jsonData.phone = options.phone;
//				console.log(jsonData);
				$form.find('input').css('border-color','#969696');
				$form.find('.err').html('');
				$form.find('.icon-err').remove();
				if(jsonData.loginpassword.length < 6 || jsonData.loginpassword.length > 14){
					$form.find('input[name=loginpassword]').addClass('err').css({'border-color':'#033893','color':'#FF0000'}).val('请输入6-14位密码').attr('type','text').parent().append(_this.els.err(options.status=='3'?'70%':'100%'));
				}else if(jsonData.phonecode == "" || (jsonData.phonecode && jsonData.phonecode.length<6)){
					$form.find('input[name=phonecode]').addClass('err').css({'border-color':'#033893','color':'#FF0000'}).val('验证码错误').parent().append(_this.els.err('70%'));
				}else{
					if(true){//window.location.hostname == 'events.upbox.com.cn'){
						window.sessionStorage['phone'] = jsonData.phone;
						window.sessionStorage['pwd'] = jsonData.loginpassword;
					}
					jsonData.loginpassword = options.md5?options.md5(jsonData.loginpassword):jsonData.loginpassword;
					upbox.loading.show({type:'small',content:'请稍候'});
					$.ajax({
						type:"get",
						url:$form.attr('active'),
						async:true,
						dataType:'jsonp',
						jsonp:'jsonCallback',
						data:jsonData,
						success:function(res){
							if(res.ret == 1){
								if(res.result.uUser){
									res.result = res.result.uUser;
								}
								_this.setCookies(res);
								if(options.callback && $.isFunction(options.callback)){
									res.userId = res.result.userId;
									if(res.result.taskInfo){
										upbox.notification.mission({data:res.result.taskInfo});
									}
									upbox.cryptoUserId(res,options);
								}
							}else{
								$form.find('.err').html(res.errorMsg);
							}
							upbox.loading.hide();
						}
					});
				}
				return false;
			});
		}
	}
	/**
	 * 支付方法
	 */
	upbox.pay = function(options){
		var wxPayUrl = '';
		var hostname = location.hostname;
		if(upbox.appInstall.isUPBOX){
			window.control.doPay(JSON.stringify({
				out_trade_no:options.orderNum,
				subject:options.orderTitle,
				total_fee:options.allprice,
				attach:'{"orderNums":"'+ options.attach + '"}',
				returnUrl:options.returnUrl,
				isUseJb:options.isUseJb || '0'
			}));
		}else if(upbox.appInstall.isWeixin){
			wxPayUrl = upbox.getInterface('wxPay','');
			wxPayUrl = wxPayUrl.substr(0,wxPayUrl.indexOf('.html')+5);
			var href = 'https://component.upbox.com.cn/wechatJava/wxScope_wxScope.do?topenid=gh_c5094b4f5264&REDIRECTURL='//http://10.10.2.59:8878/Pay/aliPay_aliJsPay.do'
			+ encodeURIComponent(wxPayUrl
			+ '?orderNum=' + options.orderNum
			+ '&orderTitle=' + options.orderTitle
			+ '&allprice=' + options.allprice
			+ '&attach=' + '{"orderNums":"'+ options.attach + '"}'
			+ (options.payInterface?('&payInterface='+encodeURIComponent(options.payInterface)):'')
			+ '&returnUrl=' + encodeURIComponent(options.returnUrl)
			+ '');
			location.href = href;
		}else{
			var redirect = (options.payInterface || upbox.getInterface('upboxApi','upay_allPayJs.do'))
			+ '&payType=aliJs'
			+ '&userStatus=-1'
			+ '&fee_type=CNY'
			+ '&out_trade_no=' + options.orderNum
			+ '&subject=' + options.orderTitle
			+ '&total_fee=' + Number(options.allprice)*100
			+ '&returnUrl=' + encodeURIComponent(options.returnUrl)
			+ '&attach=' + '{"orderNums":"'+ options.attach + '"}';
			location.href = redirect;
		}
	}
	/**
<<<<<<< HEAD
=======
	 * 通用弹层
	 */
	// upbox.dialog = {
	// 	sprite:'<div class="up-dialog bscale" style="z-index:1000;">'
	// 			+ '<div class="dialog-ctn">'
	// 			+ '<div class="btns">'
	// 			+ '</div></div></div>',
	// 	show:function(options){
	// 		options = $.extend(true, {
	// 			'parent':'body',
	// 			'type':'normal',
	// 			'id':'up-dialog'
	// 		}, options);
	// 		if($('#' + options.id).length){
	// 			return false;
	// 		}
	// 		var $dialog = $(upbox.dialog.sprite);
	// 		$dialog.attr('id',options.id).css('height',$(window).height());
	// 		if(options.type == 'fixed'){
	// 			$dialog.addClass('dialog');
	// 		}
	// 		$(options.parent).append($dialog);
	// 	}
	// };
	/**
>>>>>>> webapp1.3.0
	 * iframe 工厂
	 * @param option
   */
	upbox.iframe = function (option) {
		var _ = $.extend({
			// 容器
			container: 'body',
			// iframe 地址
			src: '',
			width: '100%',
			height: '100%'
		}, option || {});
		var iframe = document.createElement('iframe');
		iframe.scrolling = 'auto';
		iframe.frameBorder = 0;
		iframe.src = _.src;
		iframe.width = _.width;
		iframe.height = _.height;
		function show() {
			$(_.container).append(iframe);
		}
		function hide() {
			$(iframe).remove();
		}
		return {
			show: show,
			hide: hide
		};
	};
	/**
	 * 通用Ajax请求方式,预留
	 */
	window.upboxAjax = {
		get:function(options){
			options = $.extend(true, {
				type:'get',
				async:true,
				dataType:'jsonp',
				jsonp:'jsonCallback'
			}, options);
			$.ajax(options);
		}
	};
	/**
	 * Cookies的一些操作方式
	 */
	window.Cookies = {
		set: function(name, value) {
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : null;
			var path = (argc > 3) ? argv[3] : '/';
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
		},
		get: function(name) {
			var arg = name + "=";
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			var j = 0;
			while (i < clen) {
				j = i + alen;
				if (document.cookie.substring(i, j) == arg)
					return Cookies.getCookieVal(j);
				i = document.cookie.indexOf(" ", i) + 1;
				if (i == 0)
					break;
			}
			return null;
		},
		clear: function(name) {
			if (Cookies.get(name)) {
				var expdate = new Date();
				expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
				Cookies.set(name, "", expdate);
			}
		},
		getCookieVal: function(offset) {
			var endstr = document.cookie.indexOf(";", offset);
			if (endstr == -1) {
				endstr = document.cookie.length;
			}
			return unescape(document.cookie.substring(offset, endstr));
		},
		//编码不同
		setEn: function(name, value) {
			var argv = arguments;
			var argc = arguments.length;
			var expires = (argc > 2) ? argv[2] : null;
			var path = (argc > 3) ? argv[3] : '/';
			var domain = (argc > 4) ? argv[4] : null;
			var secure = (argc > 5) ? argv[5] : false;
			document.cookie = name + "=" + encodeURI(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
		},
		getEn: function(name) {
			var arg = name + "=";
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			var j = 0;
			while (i < clen) {
				j = i + alen;
				if (document.cookie.substring(i, j) == arg)
					return Cookies.getCookieValEn(j);
				i = document.cookie.indexOf(" ", i) + 1;
				if (i == 0)
					break;
			}
			return null;
		},
		clearEn: function(name) {
			if (Cookies.get(name)) {
				var expdate = new Date();
				expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
				Cookies.set(name, "", expdate);
			}
		},
		getCookieValEn: function(offset) {
			var endstr = document.cookie.indexOf(";", offset);
			if (endstr == -1) {
				endstr = document.cookie.length;
			}
			return decodeURI(document.cookie.substring(offset, endstr));
		}
	};
	//日期格式化
	Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
	}
	//upbox公用事件
	$('body').on('keyup','.nospace',function(){
		this.value = this.value.replace(/^\s*$/, '').trim();
	})
})(window);
