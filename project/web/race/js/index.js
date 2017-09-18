(function(window,undefined){
	var cdnDomain = '//cdn.upbox.com.cn/www/';
	require.config({
		baseUrl: "/",
		urlArgs:'vs=' + document.getElementById('requirejs').getAttribute('data-version'),
		map: {
			'*': {
				'$': cdnDomain + 'public/scripts/zepto.min.js'
			}
		},
		paths:{
			'$'   				: '//cdn.bootcss.com/jquery/3.2.1/jquery.min.js',
			'framework7'	: '//cdn.bootcss.com/framework7/1.4.2/js/framework7.min',
			// 'common'	  	: cdnDomain + 'common/scripts/common',
			'common'	  	: '/race/js/common_1',
			'comment'			: '/common/scripts/comment',
			'md5'					: '/public/scripts/md5.min',
			'vue'					:	cdnDomain + 'public/scripts/vue.min',
			'wxJsSdk' 		: '//res.wx.qq.com/open/js/jweixin-1.0.0',
			'wxConfig'		: cdnDomain + 'common/scripts/wxConfig',
			'qcVideo'			: 'https://qzonestyle.gtimg.cn/open/qcloud/video/h5/h5connect'
		},
		shim:{
			'common'  :['$','framework7'],
			'wxConfig':['wxJsSdk'],
			'comment':['common','md5','vue']
		}
	});
	require([
		'wxConfig',
		// 'common',
		'comment',
		'framework7',
		'qcVideo'
	],function(wxConfig,comment){
		//初始化Framework7
	var app = new Framework7({
			modalButtonOk: '确定',
			smartSelectOpenIn: 'popup',
			smartSelectPopupCloseText: '完成',
			smartSelectPopupCloseTemplate: '<div class="right"><a href="#" class="link close-popup theme-blue"><span>{{closeText}}</span></a></div>'
		});
		var pageList = ['home','schedule','rank','dynamic','teams']
		var screenWidth = window.innerWidth;
		var apiDomain = 'https://match.upbox.com.cn/UpboxMatch/';//正式地址
		// var apiDomain_w = 'http://10.10.1.24:8066/UpboxMatch/';//王常超-测试环境
		var apiDomain_w = 'http://10.10.2.75:28080/UpboxMatch/';
		// var apiDomain = 'http://10.10.1.138:8088/UpboxMatch/';//uat
		// var apiDomain = 'http://10.10.2.54:28080/UpboxMatch/';//汤斌
		var localurl =location.origin+location.pathname;
		var json = [];
		var videoList = [];
		var newsList = [];
		var banList = [];
		var scheStorage= {};
		var dynaStorage= {};
		var rStatus = 0;//下拉刷新的状态0-正常 1下拉刷新 2底部刷新
		var refStatus = false;//判断底部刷新的状态
		var dPageNoTop = 1;//动态上拉刷新的页数
		var params = upbox.getParams();
		var race = getRace(params.rn);
		var pid = params.pid;
		var timeId = 0;//赛程id
		var rid = 0;//赛事id
		var all_raceId ='';//用于在全部赛事中查看球队
	  var	isRefresh =false
		var rankPoint =['','','',''];
		var initStastus= 0;
		var locationUrl = window.location.href;
		var scheStorageStatus = false;
		var dynaStorageStatus = false;
		var user = {};
		var race_w = {
			rid:54274899,
			sche:{},
			imgID:'common',
			id:'ssfl',
			color:'rgb(0,71,157)'
		}
		var raceType=["单循环积分赛","双循环积分赛","单循环淘汰赛","双循环淘汰赛","单循环小组赛","双循环小组赛"];
		function getRace(raceName){
			var all = {
				name:'全部联赛',
				raceId:'2017supercup,2017cerezocup,17ssfl,17sysfl,17SSFL5-SP,17sysfl-u11,17sysfl-u9',
				newsId:'2017supercup-news,2017cerezocup-news,17ssfl-news,17sysfl-u11-news,17sysfl-u9-news',
				id:'all',
				rid:'155',//用于查询banner
				color:'rgb(0,71,157)',
				imgID:'all',
				logo:'https://cdn.upbox.com.cn/www/common/images/icon-upbox.png'
			}
			var cerezoCup = {
				name:'2017樱花杯',
				raceId:'2017cerezocup',//查询的时候后面赛事id
				newsId:'2017cerezocup-news',
				id:"yh",//这个参数是url的后缀也是image文件各个赛事对应的icon文件名
				color:'rgb(241,50,133)',//主色调
				rid:'127',//赛事id
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'樱花杯',
				rankNum:3,
				imgID:'yh',
				logo:'https://cdn.upbox.com.cn/www/2017/02/yhb.png'
			}
			var supercup = {
				name:'2017超级杯',
				raceId:'2017supercup',
				newsId:'2017supercup-news',
				id:"super",
				color:'rgb(96,26,134)',
				rid:'123',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'超级杯',
				rankNum:3,
				imgID:'super',
				logo:'http://cdn.upbox.com.cn/www/2016/12/supercuplogo.jpg'
			}
			var ssfl = {
				name:'17上超联赛常规赛（7人制）',
				raceId:'17ssfl',
				newsId:'17ssfl-news',
				id:"ssfl",
				color:'rgb(0,71,157)',
				rid:'90',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'上超7人制',
				rankNum:2,
				imgID:'common',
				logo:'http://img.upbox.com.cn/matchlogos/2017/04/23/q6d43i2a833nwklzu00g3pvgr6eidu2y.jpg'
			}
			var sysfl = {
				name:'17上超联赛U9测试赛',
				raceId:'17sysfl',
				newsId:'17sysfl-news',
				id:"sysfl",
				color:'rgb(82,168,35)',
				rid:'128',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'U9测试赛 ',
				rankNum:7,
				imgID:'junior',
				logo:'https://cdn.upbox.com.cn/www/2017/02/17sysrl-young-400.png'
			}
			var ssfl5 = {
				name:'春季赛',
				raceId:'17SSFL5-SP',
				newsId:'17SSFL5-SP-news',
				id:"ssfl5",
				color:'rgb(0,71,157)',
				rid:'131',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'上超5人制',
				rankNum:2,
				imgID:'common',
				logo:'http://img.upbox.com.cn/matchlogos/2017/02/28/2li17em8ou8mecbnm6z4u0qqu4e4yau7.jpg'
			}
			var sysflu9 = {
				name:'17青少赛U11',
				raceId:'17sysfl-u9',
				newsId:'17sysfl-u9-news',
				id:"sysflu9",
				color:'rgb(82,168,35)',
				rid:'152',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'上超U9',
				rankNum:3,
				imgID:'junior',
				logo:'https://img.upbox.com.cn/matchlogos/2017/05/31/r0f7iyua6z03denukoo4s6pyc3gzp2yq.png'
			}

			var sysflu11 = {
				name:'17青少赛U11',
				raceId:'17sysfl-u11',
				newsId:'17sysfl-u11-news',
				id:"sysflu11",
				color:'rgb(82,168,35)',
				rid:'153',
				krrid:-1,
				unkrrid:-1,
				type:'0',
				rankList:['A','B','C','D'],
				topname:'上超U11',
				rankNum:3,
				imgID:'junior',
				logo:'http://img.upbox.com.cn/matchlogos/2017/05/31/qw6tlzjx972volfdc1n5i1hluuys3d5k.png'
			}
			if (raceName=='all')	 return all;
			if (raceName=='yh') 	 return cerezoCup;
			if (raceName=='super') return supercup;
			if (raceName=='ssfl') 	 return ssfl;
			if (raceName=='sysfl') return sysfl;
			if (raceName=='ssfl5') return ssfl5;
			if (raceName=='sysflu11') return sysflu11;
			if (raceName=='sysflu9') return sysflu9;
		}
		/**
		 * y_pid
		 */
		 function _init(){
			if(pid==0||pid==3)getHomedata();
			if(pid==3){
				if(sessionStorage.dyStorage!=null&&sessionStorage.dyStorage!='{}'){
					dynaStorage = JSON.parse(sessionStorage.dyStorage);
					dynaStorageStatus = true;
				}
			}
			$('.content').children().remove();
			if(pid==1){
				// $('#schedule').show();
				loadSchedule();
			}
			if(pid==2){
				// $('#rank-out').show();
				dataForRank();
			}
			if(pid==4) {
				ajaxForTeams();
			}
			if(pid==5){
				// load('player-info');
				initPlayerInfo();
				tabchange($('#item1'));
			}
			var itemId=~~pid+1;
			if(pid<4)  tabchange($('#item'+itemId+''))
			if(params.tid!=null&&params.type!=null){
				$('#details-team').show();
				getDataForTeamDetails();
				tabchange($('#item2'));
				return false;s
			}
			if(params.tid){
				// // load('info-team');
				// $('.content').hide();
				// $('#info-team').show();
				ajaxForTeamInfo();
			}
			if(params.url!=null){
				loadDynamicDetail(params.url);
				tabchange($('#item4'))
			}
		 }

     /**
      * y_load
      */
			   function load(id){
				  var p =$('#'+id+'');
				  if(id!='new-cell'){
					clearPage();//new-cell 这个模板是帮助动态底部刷新的
					p.show();}
					if (p.html()==""){
						upbox.loading.show();
						parseEJS(id)
					};
					if(rStatus>=1){parseEJS(id);}//下拉刷新-允许重新加载数据
					if(race.id=='all'&&id=='teams'&&$('#teams').html()!=""){
						upbox.loading.show();
						$('.main-view #teams').children().remove();
						parseEJS(id)
					}
					if(id=='details-team'&&$('#details-team').html()!=""){
						upbox.loading.show();
						$('.main-view #details-team').children().remove();
						parseEJS(id);
					}
			  }
			 /**
	 		 * y_parseEJS
	 		 */
         function parseEJS(name){
          var url = '../ejs/'+name+'.ejs';
          $.ajax({
            url:url,
            method:'GET',
            statusCode:{
              404:function(){
                alert('page not found')
              },
            },
            success:function(data,status,xhr){
							if (name==='head') { renderHead(data,'.head');}
							else{parseHomeEJS(data,'#'+name+'');}
							// initSwiper();

            },
          })
        }

				 function initSwiper(name){
					var mySwiper = app.swiper('#home_swiper', {
						pagination:'#home_pagination',
						autoplay: 3000,
						autoplayDisableOnInteraction : false
					});
					var mySwiper2 = app.swiper('#dyna_swiper', {
						pagination:'#dyna-pagination',
						autoplay: 3000,
						autoplayDisableOnInteraction : false
					});
					var width =screenWidth*0.40625
					$('#home #headSwiper').css('height', width+'px');
					$('#dynamic #headSwiper').css('height', width+'px');
				 }
				 function clearPage(){
					$('.content').hide();
				}
				/**
				 * y_parseHomeEJS
				 */
			   function parseHomeEJS(data,parent){
						if(parent=='#home'|| parent=='#dynamic'){
							if (parent=='#home'&&$('.main-view #home').html()=="") {//页面第一次加载的时候初始化方法
								refreshHome();
							}
							if (parent=='#dynamic'&&$('.main-view #dynamic').html()=="") {//页面第一次加载的时候初始化方法
								refreshDynamic()
								bottomRefreshDynamic();
							}
							appendHTMLbyEJSToHome(data,parent);
						}
						if(parent=='#schedule'){
						}
						if(parent=='#process')ajaxForProcess(data);
						if(parent=='#teams'){
							if (race.id=='all') {
								ajaxForTeams(data,parent,all_raceId);
							}else{
								ajaxForTeams(data,parent,race.rid);
							}
						}
						if(parent=='#'){
							var result = ejs.render(data,{});
							// $('#race-data').append(result);
						 $('#home-container').append(result);
							upbox.loading.hide();
						}
							//先去判断这个赛事的赛程类型
						if(parent=='#new-cell'){
							console.log(dynaStorage);
							ajaxforDynamic(data);
						}
						if(parent=='#details-team') getDataForTeamDetails(data);
						// if(parent=='#info-team'){infoData(data,3)}

				}

			/**
			 * y_home
			 */
				 var h = 0; //标记主页接口数据获取的数量
				 function getHomedata(){
					if($('#home').html()=="")upbox.loading.show();
						var load = {
							raceId:race_w.rid,
							userId:encodeURIComponent(user.userId),
							md5:user.md5
						}
						ajaxHome(apiDomain_w+'raceTime_getRaceTimeInfo.do',load,1);
						if (race.id!='all') {
							ajaxHome(apiDomain+'uCmsLog_getBannerAndVideo.do?race='+race.newsId+'&criteria=ssfl-tjsp&page=1',{},2);
						}
						ajaxHome(apiDomain+'uCmsLog_getNews.do?tags='+race.newsId+'&page=1',{},3);
						ajaxHome(apiDomain+'match_loadBanner.do?rid='+race.rid,{},4);

				}
				 function ajaxHome(url,data,n){
					$.ajax({
						url:url ,
						type: 'GET',
						dataType: 'jsonp',
						jsonp:'jsonCallback',
						data:data,
						success:function(e){
							homeData(e,n)
						}
					})
				}
				 function homeData(data,num){
						h++;
						if (num==1) json = data;
						if (num==2) videoList = data;
						if (num==3) newsList = data;
						if (num==4) banList = data;
						if (race.id=='all'&&h==3) {//如果是全部赛事页面的话之后2个接口
								loadHomeOrDynamic()
						}else if (h==4){//但赛事页面有3个接口
								loadHomeOrDynamic()
						}

				}
				 function loadHomeOrDynamic(){
					 if(pid==0)parseEJS('home');
					 else if(pid==3)parseEJS('dynamic');
				}
				 function initFunction(){
						$('#r_teams').on('click',  function(event) {
							window.location.href= localurl+'?rn='+race.id+'&pid='+4
						});
						$('.raceData').on('click', function(event) {
							event.preventDefault();
							window.location.href= localurl+'?rn='+race.id+'&pid='+5
						});
						$('#newSchedule').on('click', function(event) {
							event.preventDefault();
							$('.tab a').removeClass('tabSelect');
							$('#item2').addClass('tabSelect');
							load('schedule');
						});
						$('#newSchedule2').on('click', function(event) {
							event.preventDefault();
							$('.tab a').removeClass('tabSelect');
							$('#item2').addClass('tabSelect');
							load('schedule');
						});
						$('#allDynamic').on('click',  function(event) {
							event.preventDefault();
							$('.tab a').removeClass('tabSelect');
							$('#item4').addClass('tabSelect');
							load('dynamic');
						});
						$('.matchBox').on('click',function(event) {
							var id  = this.id;
						  timeId = id.substring(0,id.indexOf('-'));
						 	rid = id.substring(id.indexOf('-')+1,id.length);
							// load('details-team');
							window.location.href = localurl+'?rn='+race.id+'&tid='+timeId+'&rid='+rid
						});
						$('.new_cell').on('click',function(event) {
							window.location.href = localurl+'?rn='+race.id+'&url='+this.id;
							// loadDynamicDetail(this.id);
						});
						$('.reco_box').on('click',  function(event) {
							event.preventDefault();
							window.location.href = localurl+'?rn='+race.id+'&url='+this.id;
						});
						$(' .swiper-wrapper a').on('click',  function(event) {
							event.preventDefault();
							/* Act on the event */
							window.location.href = localurl+'?rn='+race.id+'&url='+this.id;
						});
				}
				/**
				 * y_player
				 */
				 function initPlayerInfo(){
					 doJSONP('raceTime_getPlayerRecord.do',{
						 raceId:race_w.rid,
						 userId:'UQjChIfFaXaD5gCgl1nvp7zLwK4VqjFif8aw0pXUfATUwB4B2r98V46%2BfD9hAtdk',
						 md5:'IWNSXixbIvZETUvJ'
					 },function(e){
						 console.log(e);
						 readEjs('player-info',function(data){
							 var result = ejs.render(data,{
								 info :e.result
							 })
							//  $('#player-info').show();
							//  $('#player-info').append(result);
								 $('#home-container').append(result);
							 upbox.loading.hide();
						 })
					 })
				 }
				/**
				 * y_schedule
				 */
				 function loadSchedule(){
					 doJSONP('raceTime_getRaceTimeByContentParam.do',{
						 raceId:race_w.rid
					 },function(e){
						 e = e.result;
						 initRaceType(e.mrule);
						 var type = e.now.system_type;
						 readEjs('schedule',function(data){
								var result = ejs.render(data,{
									color:race_w.color,
									title:e,
									raceType:raceType
								 });
								// $('.main-view #schedule').append(result);
									 $('#home-container').append(result);
								scheFunction();
								refreshSchedule();
								if(type=='3'||type =='4'){ //加载对阵图
									 initKnockout('OrganiseChart2');
								}else{
									 appendRaceList(0,0);
								}
						 })
						  upbox.loading.hide();
					})
					function  initRaceType(mrule){
						var group,knockout;
						var initType = function(g,k){
							race_w.sche.group = g;
							race_w.sche.knockout = k;
						}
						switch (mrule) {
							case 6 :initType(1,-1); break;
							case 7 :initType(2,-1); break;
							case 8 :initType(3,-1); break;
							case 9 :initType(4,-1); break;
							case 10:initType(5,3); break;
							case 11:initType(6,3); break;
							case 12:initType(5,4); break;
							case 13:initType(6,4); break;
							default:
						}
					}
				  }
					/**
					 * refreshType -- 0-替换数据  1 下拉刷新  2 底部刷新
	 					 type >=1 表示第几轮， -1--表示淘汰赛 0--表示全部比赛  -2表示我的比赛
					 */
				 function appendRaceList(type,refreshType){
						var scheBoxFuntion;
					  scheBoxFuntion = function(){
							$('.s_race').unbind('click');
							$('.s_race').on('click', function(event) {
								var id  = this.id;
								window.location.href = localurl+'?rn='+race.id+'&type=1&tid='+id
							});
					 }
						getRaceList(type,function(e){
							var list = e.result.list;
							list.forEach(function(value,index){
								list[index].date = value.showStartDate.substring(0,6);
							})
							readEjs('sche_box',function(data){
								var result = ejs.render(data,{
									list:list,
									color:race_w.color,
								})
								if(refreshType == 0 ) {
									$('.s_list > div').remove();
									$('.s_list').append(result);
								}
								else if(refreshType == 1 ) {$('.s_rtid:first-child').before(result);
								}else if(refreshType == 2 ){$('.s_list > div:last-child').after(result)}
								scheBoxFuntion();
								})
						})

					}
					function getRaceList(type,callback){
						 var t=mine=rtid="";
						 if(type!=-1){ //小组赛
							 t=1;
							 if(type==0) mine = 0;
							 else if(type==-2) mine = 1;
							 else rtid = type;
						 }else t=2;
						 doJSONP('raceTime_getRaceTimeByContent.do',{
							raceId:race_w.rid,
							userId:encodeURIComponent(user.userId),
							md5:user.md5,
							rtid:rtid,
							mine:mine,
							type:t
						},function(e){
							 if(callback)callback(e);
						 })
					 }
					 function refreshSchedule(){
						var refresh = $('#scheContent');
						app.initPullToRefresh(refresh)
						refresh.on('refresh', function(event) {
						 var now =  ~~($('.rtidCell').first().attr('data-rtid'));
						 var select = ~~($('#topText').attr('data-select'));
						 if(select==0){ //加载历史赛程
							  if(now>1)appendRaceList(now-1,2);
						 }else{//刷新当前赛程
							 appendRaceList(now,0);
						 }
						 app.pullToRefreshDone();
						});
						$("#schedule #scheContent").scroll(function(){
							var $this =$(this),
							viewH =$(this).height(),//可见高度
							contentH =$(this).get(0).scrollHeight,//内容高度
							scrollTop =$(this).scrollTop();//滚动高度
						 if(scrollTop/(contentH -viewH)>=.999){ //到达底部100px时,加载新内容
							var maxRtid = ~~($('.tl_item:last-child').attr('data-id'));
							var now =~~($('.rtidCell').last().attr('data-rtid'));
							var select = ~~($('#topText').attr('data-select'));
							if (select==0&&now<maxRtid)appendRaceList(now+1,2);
						 }
						});
					 }
				 function scheFunction(){
						$('.choseBtn').on('click', function(event) {
							event.preventDefault();
							$('.choseBtn').removeClass('choseBtn_click')
							$(this).addClass('choseBtn_click');
							$('.typeList').hide();
							if(this.id=='routineBtn') $('#routine').show();
							if(this.id=='knockoutBtn'){
								if($('#OrganiseChart2').html()=="")initKnockout('OrganiseChart2');
								else $('#OrganiseChart2').show();
								$('.group').hide();
								$('#knockout').show();
								$('.choseContent').hide();
								$('#choseRacetype .title text').text(raceType[~~(race_w.sche.knockout)-1])
							}
							return false;
						});
						$('.tl_item').on('click', function(event) {
							event.preventDefault();
							console.log(race_w);
							$('#choseRacetype .title text').text(raceType[~~(race_w.sche.group)-1]+' '+$(this).children('text').text())
							$('.choseContent').hide();
							$('.knockout').hide();
							$('.group').show();
						  var id =	$(this).attr('data-id');
							$('#choseRacetype .title text').attr('data-select',id)
							appendRaceList(id,0);
							return false;
						});
						$('#choseRacetype .title').on('click',  function(event) {
							event.preventDefault();
							if($('.choseContent').css('display')!='none'){
								$('.choseContent').hide();
							}else {
								$('.choseContent').show();
							}
						});
						$('.choseContent').on('click', function(event) {
							event.preventDefault();
							$(this).hide()
						});
					 }
				 /**
				  * y_process
				  */
				 function ajaxForProcess(data){
						$.ajax({
								url: apiDomain+'match_loadMatchRaces.do?raceId='+race.raceId,
								type: 'POST',
								dataType: 'jsonp',
								jsonp:'jsonCallback',
									success:function(e){
										var p = e.result.tubraces;
										for(var i = 0 ;i<p.length; i++){
											p[i].logo = toHttps(p[i].logo);
										}
										var result = ejs.render(data,{list:p})
										// $('.main-view #process').append(result);
											 $('#home-container').append(result);
										upbox.loading.hide();
										processShare();
										$('.p_info').on('click', function(event) {
											event.preventDefault();
											/* Act on the event */
										window.location.href = localurl+'?rn='+switchRid(this.id)+'&pid=0'
										});
										watchTeams();
									}
						})
					 }
				 function  watchTeams(){
						$('.process_watch').on('click', function(event) {
							event.preventDefault();

							var r = getRace(switchRid(this.id));
							window.location.href= localurl+'?rn=all&pid=4&allrid='+r.rid
							return false;
						});
					}
				/**
				 * y_rank
				 */

				 function dataForRank(){
							var getIntegrateList = function(){
								doJSONP('raceTime_getRaceRankInfo.do?',{//获取积分
									raceId:race_w.rid
								},function(e){
									DataForRankpoint(e.result,1);
								})
							}
					    //获取赛制
							doJSONP('raceTime_getRaceTimeByContentParam.do?',{
								raceId:race_w.rid
							},function(e){
								race_w.isKnockout=(~~e.result.existsKnockout>0?1:0)
								race_w.isGroup=(~~e.result.existsGroup>0?1:0)
								if (e.result.existsGroup>0) {
									getIntegrateList();
								}
							});
							getRankList(1);
							function getRankList(_type){
								doJSONP('raceTime_getRaceRankPlayer.do?',{
									raceId:race_w.rid,
									type:_type,
									page:1,
									pageSize:60
								},function(e){
									if(_type<=3)DataForRankpoint(e.result,~~_type+1);
									_type++;
									if(_type<=3)getRankList(_type);
								})
							}
					}
		    /* y_rank-point*/
				function DataForRankpoint(aData,tag){
					rankPoint[tag-1] = aData;
					if (rankPoint.indexOf("")<0) {
						console.log(rankPoint);
						readEjs('rank-out',function(data){
							var isout = race_w.isKnockout==-1?0:(race_w.group==-1?1:2);
							var result = ejs.render(data,{
									point:rankPoint,
									color:race.color,
									name:race.id,
									isout:isout,
									number:race.rankNum,
									imgid:race.imgID
							});
							// $('.main-view #rank-out').append(result);
								 $('#home-container').append(result);
							initRank(params.tab);
							upbox.loading.hide();
						})

					}
				}
				function initRank(numb){
					// //初始化tab
					var switchTab = function(_this){
						var thisName = _this.attr('name')
						if(thisName!='isClick'){
							//清除tab样式
							var selected = $('.tab[name="isClick"]');
							var divChildid = selected.children('div').attr('id');
							selected.children('div').removeClass(''+divChildid+'_click');
							selected.children('text').removeClass('clickText');
							selected.attr('name', '');
							$('.out-page').hide();
							//加载当前样式
							var thisImgId = _this.children('div').attr('id');
							_this.children('div').addClass(''+thisImgId+'_click');
							_this.children('text').addClass('clickText');
							_this.attr('name', 'isClick');
							if (thisImgId=='tree') {
								var knockout = $('#knockout');
								if(knockout.children('div').html()==""){
									initKnockout('OrganiseChart1');
								}
								knockout.show();
							}else $('#out-'+thisImgId+'').show();

						}
					}
					var initTab =  function(index){
						var _this = $('.tabbar .tab')[index];
						switchTab($(_this));
					}
					$('.tabbar .tab').on('click', function(event) {
						event.preventDefault();
						var _this = $(this);
						switchTab(_this);
					});
					// initTab(numb)

					// $('.tabText').removeClass('clickText');
					// var firsttab  =$('.tabbar .tab')[numb];
					// rankShare(numb,firsttab.id);
					// $('.tabbar #'+firsttab.id+' img#click').show();
					// $('.tabbar #'+firsttab.id+' text#click').show();
					// $('.tabbar #'+firsttab.id+' img#unclick').hide();
					// $('.tabbar #'+firsttab.id+' text#unclick').hide();
					// $('#rank-out  .tabbar .tab').on('click', function(event) {
					// 	var tablist = $('#rank-out  .tabbar .tab');
					// 	var tabnumb = 0;
					// 	var id = this.id;
					// 	for(var i = 0 ;i<tablist.length ; i++){
					// 		 if(tablist[i].id==id) {
					// 			 rankShare(i,id);
					// 			 break;
					// 		 }
					// 	}
					// 	$('.tabbar .tab img#click').hide();
					// 	$('.tabbar .tab text#click').hide();
					// 	$('.tabbar .tab img#unclick').show();
					// 	$('.tabbar .tab text#unclick').show();
					// 	$('.tabbar #'+id+' img#click').show();
					// 	$('.tabbar #'+id+' text#click').show();
					// 	$('.tabbar #'+id+' img#unclick').hide();
					// 	$('.tabbar #'+id+' text#unclick').hide();
					// 	$('.out-page').hide()
					// 	if (this.id=='tree') {
					// 		if($('#OrganiseChart1').html()==""){
					// 		initKnockout('OrganiseChart1');
					// 	}
					// 		$('#knockout').show();
					// 	}else{
					// 		$('#out-'+this.id+'').show();
					// 	}
					// });
					// //初始化页面
					// $('.out-page').hide();
					// if(firsttab.id=='tree'){
					// 	if($('#OrganiseChart1').html()==""){
					// 	initKnockout('OrganiseChart1');
					// 	$('#knockout').show();
					// }
					// }
					// else{ $('#out-'+firsttab.id+'').show();}
				}


			/**
			 *  y_refresh
			 */
			  function refreshDynamic(){

				 var refresh = $('.main-view  #dynamic');
				 app.initPullToRefresh(refresh)
				 refresh.on('refresh', function(event) {
					 app.pullToRefreshDone();
					 upbox.loading.show({type:'small'})
					 $.ajax({
						 url: apiDomain+'uCmsLog_getNews.do?tags='+race.newsId+'&page=1',
						 type: 'GET',
						 dataType: 'jsonp',
						 jsonp:'jsonCallback',
						 success:function(e){
							 newsList=e;//重置list
							 rStatus=1;
							 refStatus=false;//初始化刷新状态
							 dPageNoTop=1;//初始化刷新页数
							 dynaStorage = {}
							 removedynaStorage();//初始化缓存
							 dynaStorageStatus  =false;
							 parseEJS('dynamic');
						 }
					 })
				 });

			  }
			  function refreshHome(){
				 var refresh2 = $('#page-home');
				 app.initPullToRefresh(refresh2)
				 refresh2.on('refresh', function(event) {
					 app.pullToRefreshDone();
					upbox.loading.show({type:'small'})
					 h = 0; //标记主页接口数据获取的数量
					 rStatus=1;
					 initStastus=0;
					 getHomedata();
				 });
			  }

			 /**
			  * y_teams
			  */
				function ajaxForTeams(){
					doJSONP('raceTime_getJoinedTeams.do',{raceId:race_w.rid},function(e){
						console.log(e);
						var list =e.result.list;
						for(var i = 0 ; i<list.length; i++){
							list[i].logo = toHttps(list[i].logo)
						}
						readEjs('teams',function(data){
							var result = ejs.render(data,{
								teams:list,
								name:race_w.id,
								imgid:race_w.imgID
						})
							// $('.main-view #teams').append(result);
								 $('#home-container').append(result);
							upbox.loading.hide();
							$('#teams #t').on('click',  function(event) {
								upbox.loading.show({backgroundColor:'#fff'})
								window.location.href =localurl+'?rn='+params.rn+'&tid='+$(this).attr('data-teamId')+'&tab=0';
							});
						})

					})
			  }
			/**
			 * y_info-teams
			 */

			  function ajaxForTeamInfo(){
					var info = {};
					var team = {
						raceId:race_w.rid,
						teamId:params.tid
					}
					var appenData = function(data){
						if(data.record){
							info.times = data.list;
							info.record = data.record;
						}else if(data.team){
							info.team = data;
						}else{
							info.players = data.list
						}
						if(info.players&&info.times&&info.record&&info.team){
							infoData(info);
						}
					}
					doJSONP('raceTeam_getPlayerByJoined.do',team,function(e){
						var list = e.result.list;
						list.forEach(function(value,index,array){
							e.result.list[index].logo = toHttps(value.logo)
						})
						appenData(e.result);
					})
					doJSONP('raceTeam_getTeamRecord.do',team,function(e){
						var list = e.result.list;
						list.forEach(function(value,index,array){
							e.result.list[index].kTeamLogo = toHttps(value.kTeamLogo)
							e.result.list[index].zTeamLogo = toHttps(value.zTeamLogo)
						})
						appenData(e.result);
					})
					doJSONP('raceTeam_getTeamInfo.do',team,function(e){
						e.result.team.logo = toHttps(e.result.team.logo);
						appenData(e.result);
					})
			  }
			  function infoData(info){
					console.log(info);
					readEjs('info-team',function(e){
						var result = ejs.render(e,{
							players:info.players,
							times:info.times,
							record:info.record,
							name:race_w.id,
							teamInfo:info.team,
							color:race_w.color,
							imgid:race_w.imgID,
							tab:params.tab,
							racetype:raceType
						});
						// $('#info-team').append(result);
							 $('#home-container').append(result);
						changeTeamInfoTab(params.tab);
						addComments();
						addPie(info.record);
						bindFunction();
						upbox.loading.hide()
					})


				 }
				function addPie(data){
					var wins = ~~data.wins,loss = ~~data.loss,balance = ~~data.balance,count = wins+loss+balance;
					var getPieOption = function(v,c){
						var value1 ,value2;
						if (count>0) {
							 value1 =Math.round(v/count*100);
							 value2 = 100-value1
						}else{
							 value1 = 0;
						   value2 = 100;
						}
						option = {
							color:['#f0f0f0',c],
							 animation:false,
							title : {
									 text:v,
									 subtext:value1+'%',
									 x: 'center',
									 y:'25%',
									 textStyle:{
										 fontSize:14,
										 color:c,
										 fontWeight:'normal'
									 },
									 subtextStyle:{
										 fontSize:13,
										 color:'#787878',
										 fontWeight:'normal'
									 },
									 itemGap:6
							 	},
						    series: [
						        {
						            type:'pie',
						            radius: ['62%', '80%'],
												avoidLabelOverlap: false,
							            label: {
							                normal: {
							                    show: true,
							                    position:'center',
							                    textStyle:{
							                        fontSize:9
							                    }
							                }
							            },
						             labelLine: {
						                normal: {
						                    show: false
						                }
						            },
						            data:[
						                {value:value2},
						                {value:value1},
						            ]
						        }
						    ]
						};
						return option
					}
					var myChart1 = echarts.init(document.getElementById('wins'));
					myChart1.setOption(getPieOption(wins,'rgb(132,193,0)'));
					var myChart2 = echarts.init(document.getElementById('blance'));
					myChart2.setOption(getPieOption(balance,'rgb(45,175,255)'));
					var myChart3 = echarts.init(document.getElementById('loss'));
					myChart3.setOption(getPieOption(loss,'rgb(255,150,65)'));
				}
			  function bindFunction(){
				 $('#info-team .tab').on('click', function(event) {
				 	event.preventDefault();
					changeTeamInfoTab(~~$(this).attr('data-index'));
				 });
				 $('.record-page .match-box').on('click', function(event) {
				 	event.preventDefault();
				 	var tid = $(this).attr('data-tid');
					var rid = race.rid;
					if(params.allrid!=null)rid = params.allrid;
					window.location.href = localurl+'?rn='+race.id+'&tid='+tid+'&rid='+rid
				 });
				 $('.btns .btn').on('click',function(event) {
				 	event.preventDefault();
					var url =  $(this).attr('data-url');
					window.location.href = localurl+'?rn='+race.id+'&url='+url;
				 });

				 $('#playerTab p').on('click', function(event) {
				 	event.preventDefault();
				 	$('#playerTab p').removeClass('tabClick');
					$('.playerList').hide();
					$(this).addClass('tabClick');
					$('#'+(this.id=='ptab1'?'player':'official')+'').show();
				 });
				 $('.introBtn').on('click', function(event) {
					 var _this = this;
				 	event.preventDefault();
					console.log(2222);
					var popupHTML = '<div class="popup" style="">'+
										'<div class="topLine"></div>'+
                    '<div class="content-block">'+
                      '<p>成立于2015年3月。球员大多数是从小一起长大的兄弟，2016年以YLZ为班底的铁杆FC勇夺申花球迷联赛冠军。球队建立时间较短，但随着时间的推移，球队初期建设已基本完成，三条线均有实力较强甚至在上海市业余足球圈打拼多年的选手，现阶段球队中已经形成的团结、和谐、融洽的气氛是我们队最大的财富，我们一直会保留着这样的气质，还有我们依旧年轻的心，相信我们会通过足球为我们自己寻找到更快乐更和谐的天地，努力打造以高标准打造正规化、细节化的会员制足球俱乐部。</p>'+
                    '</div>'+
										'<p><a href="#" class="close-popup">关闭</a></p>'+
                   '</div>'
				  app.popup(popupHTML);
					$(_this).hide();
					$('.close-popup').on('click', function(event) {
						event.preventDefault();
						$(_this).show();
					});
				 });
			  }
			 var activityId = 'fukuka'
			 upbox.APP.initComments =function(res){
          var jsonData = {
            userStatus:-1,
            activityId:activityId
          }
          if(res.ret==1){
            jsonData.md5 = res.result.md5,
            jsonData.userId = res.result.userId
          }
          comment({
            el:'#comments',
            listUrl:upbox.getInterface('upboxApi','topic_getActivityTopicList.do'),
            deleteUrl:upbox.getInterface('upboxApi','topic_deleteActivityTopic.do'),
            // listUrl:'http://10.10.1.24:8090/upboxApi/topic_getActivityTopicList.do?dataResource=UPMIC_WEB&appCode=2.2.0',
            // deleteUrl:'http://10.10.1.24:8090/upboxApi/topic_deleteActivityTopic.do?dataResource=UPMIC_WEB&appCode=2.2.0',
            jsonData:jsonData,
            activityId:activityId,
            title:'看看大家怎么说',
            addBtnTxt:'发表一条新评论',
            isLogin:(jsonData.md5 && jsonData.userId),
						showPic:true
          })
          //评论展示模块
          // if($('.comments-list')){
          //   upboxAjax.get({
          //     url:upbox.getInterface('upboxApi','topic_getActivityTopicList.do'),
          //     data:jsonData,
          //     success:function(res){
          //       var commentsData = res.result;
          //       if(res.ret==1){
          //         new Vue({
          //           el:'#comments-list',
          //           data:commentsData,
          //           methods:{
          //             delete:function(_index){
          //               var topicList = commentsData.topicList;
          //               var topicId = topicList[_index].topicId;
          //               upboxAjax.get({
          //                 url:upbox.getInterface('upboxApi','topic_deleteActivityTopic.do'),
          //                 data:{
          //                   userStatus:1,
          //                   userId:Cookies.get('DIR_ESU_' + Cookies.get('_md5')),
          //                   md5:Cookies.get('_md5'),
          //                   topicId:topicId
          //                 },
          //                 success:function(res){
          //                   if(res.ret==1){
          //                     errNot('删除成功！');
          //                     topicList.splice(_index,1);
          //                   }
          //                 },
          //                 error:function(){
          //                   errNot('网络连接失败，请稍后重试！')
          //                 }
          //               })
          //             }
          //           }
          //         })
          //       }
          //     },
          //     error:function(){
					//
          //     }
					//
          //   })
          // }
          // //添加评论模块
          // if($('#add-comment')){
          //   comment({
          //     el:$('#add-comment'),
          //     activityId:activityId
          //   })
          // }
			 }
			 function addComments(){
				 if($('#comments')){
					 login('initComments')
				}
			 }
			 function changeTeamInfoTab(_index){
				 	var list = $('#info-team .tabbar .tab');
					//初始化tab
					console.log(list);
					list.each(function(index, el) {
						var  _this = el,
						   unclick = $(_this).children('img#unclick'),
							   click = $(_this).children('img#click'),
								  text = $(_this).children('text'),
									page = $('.'+_this.id+'-page');
							if(index==_index){
									unclick.hide();
									click.show();
									text.css('color', '#083893');
									page.show();
							}else{
									click.hide();
									unclick.show();
									text.css('color', '#787878');
									page.hide();
							}
					});

			 }
			 /**
			  * new-cell
				* 用于动态的底部刷新
			  */

				 function ajaxforDynamic(data){
									dPageNoTop++;
									$.ajax({
										url: apiDomain+'uCmsLog_getNews.do?tags='+race.newsId+'&page='+dPageNoTop+'',
										type: 'GET',
										dataType: 'jsonp',
										jsonp:'jsonCallback',
										success:function(e){
											var list =e.result.uCmsLogList;
											console.log('第几页？'+dPageNoTop);
											addDynaStorage(list,'add');
											if (list!=null&&list.length>0) {
												var result = ejs.render(data,{
													news:list,
													name:race.id,
													color:race.color,
													tag:race.name

													})
												refStatus=false;
												$('#dynamic #news').append(result);
												upbox.loading.hide();
											}else{
												upbox.loading.hide();
												$('#dynamic #page_bottom').show();
												$('#dynamic .d_warn').hide();
											}
											$('new_cell').unbind('click');
											$('.new_cell').on('click',function(event) {
												// initDynaShare(this.id)
												// loadDynamicDetail(this.id);
												window.location.href = localurl+'?rn='+race.id+'&url='+this.id;
											});
										},
										error:function(){
											console.log('没有数据了？');
										}
									})
								}

				/**
				 * y_details
				 */
				 /* details-team*/
				 function getDataForTeamDetails(){
					 doJSONP('raceTime_getRaceTime.do',{timeId:params.tid},function(e){
						 var changeLogo = function(list){
							 list.forEach(function(value,index){
								 list[index].logo = toHttps(list[index].logo)
							 })
							 return list;
						 }
						 e =e.result;
						 e.fTeamLineup = changeLogo(e.fTeamLineup);
						 e.xTeamLineup = changeLogo(e.xTeamLineup);
						 e.raceTime.kTeamLogo = toHttps(e.raceTime.kTeamLogo);
						 e.raceTime.zTeamLogo = toHttps(e.raceTime.zTeamLogo);
						 DetailsData(e);

					 });
				 }
				 function DetailsData(e){
					 console.log(e);
					 readEjs('details-team',function(data) {
						 var result = ejs.render(data,{
							 detail:e.raceTime,
							 teama:e.fTeamLineup,
							 teamb:e.xTeamLineup,
							 color:race_w.color,
							 name:race_w.id
						 });
						 upbox.loading.hide()
						 $(' #details-team').children().remove();
						//  $('.main-view #details-team').append(result);
							 $('#home-container').append(result);
						 $('.dl_button .warReport').on('click',function(event) {
							event.preventDefault();
							window.location.href = localurl+'?rn='+race.id+'&url='+this.id;
						 });
						 readEjs('details-events',function(data){
							 var result  =ejs.render(data,{
								 events:e.event,
								 color:race_w.color
							 })
							 $('.event-container').append(result);
							 $('.navBtn').click(function(event) {
								var id = $(this).attr('name');
 								var model = $('#'+id+'');
 								if(model.css('display')=='none'){
 									$(this).addClass('isShow');
 									model.show();
 								}else{
 									$(this).removeClass('isShow');
 									model.hide();
 								}
							 });
						 })
					 })

				 }
				 function toHttps(url){
					 var u = url;
					 if(url){
						 if(url.indexOf('http://')>=0) {
							 u = url.replace('http://','https://');
						 }
					 }
					 return u;
				 }
				 /* details-dyna*/
				function loadDynamicDetail(url){
						 $.ajax({
							url: url+'?json=1&_=1495766799221&callback=jsonp1',
							type: 'POST',
							dataType: 'jsonp',
							success:function(e){
								clearPage();
								$('#details-dyna').show();
								$('#details-dyna').children().remove();
								$('#details-dyna').append('<text id="dl_title">'+e.post.title+'</text>');
								$('#details-dyna').append(e.post.content);
								$('#details-dyna p:last-child').css('padding-bottom','60px');
								$(".video").each(function(i,e){
									var vid = $(this).attr('data-vid'),cid=$(this).attr('id');
									playVideo(vid,cid);
								});
								$("#id_video_container").each(function(i,e){
									var vid = $(this).attr('data-vid'),cid=$(this).attr('id');
									playVideo(vid,cid);
								});
								dynaDetailShare(e.post.title);
								upbox.loading.hide();
							}
						})
				   }
					 var playVideo = function(vid,cid){
					 var option ={"auto_play":"0","file_id":vid,"app_id":"1251438507","width":1920,"height":1080}; /*调用播放器进行播放*/ new qcVideo.Player( /*代码中的id_video_container将会作为播放器放置的容器使用,可自行替换*/ cid, option );
				 }
				function bottomRefreshDynamic(){
						refStatus=false;
						$("#dynamic").scroll(function(){
							var $this =$(this),
							viewH =$(this).height(),//可见高度
							contentH =$(this).get(0).scrollHeight,//内容高度
							scrollTop =$(this).scrollTop();//滚动高度
							addDynaStorage(scrollTop,'history');
						 //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
						 if(scrollTop/(contentH -viewH)>=.99){ //到达底部100px时,加载新内容
						 // 这里加载数据..
						 if (refStatus==false) {
							 refStatus=true;
							 rStatus=2;
							//  upbox.loading.show({type:'small',parent:'#dynamic'});
							 load('new-cell');
						 }
						 }
					});
				}
				 /**
				  * 最终把数据和ejs模板合成html
				  */
				 var mySwiper,mySwiper2
				 function appendHTMLbyEJSToHome(data,parent){ //动态和home共用2个接口
					var scoreList,futureList,bannerList,storage,nList,status = false;
					scoreList = json.result.aboutToBegin;
					futureList = json.result.latestScore;
					bannerList = banList.result.banners;
					nList = newsList.result.uCmsLogList;
					addDynaStorage(nList,'add');
					addDynaStorage(bannerList,'banner');
					scoreList = clipPlaceName(scoreList);
					console.log(scoreList);
					futureList = clipPlaceName(futureList)
						if (race.id!='all') {var vList = videoList.result.uCmsLogList;
						}else{var vList = [];}
						//http to https  toHttps
						for(var i=0 ;i<scoreList.length;i++){
							scoreList[i].mainTeamLogo = toHttps(scoreList[i].mainTeamLogo)
							scoreList[i].subTeamLogo = toHttps(scoreList[i].subTeamLogo)
						}
						for(var i=0 ;i<futureList.length;i++){
							futureList[i].mainTeamLogo = toHttps(futureList[i].mainTeamLogo)
							futureList[i].subTeamLogo = toHttps(futureList[i].subTeamLogo)
						}
						for(var i=0 ;i<bannerList.length;i++){
							bannerList[i].picurl = toHttps(bannerList[i].picurl);
						}
						var result=ejs.render(data, {
								imageList:bannerList,
								newScoreList:scoreList,
								future:futureList,
								news:nList,
								name:race.id,
								color:race.color,
								tag:race.name,
								video:vList,
								imgid:race.imgID,
								racetype:raceType,
								teamCourt:json.result.teamCount
						});
						// if (parent=='#home')$('#home').children().remove();//重新加载之前把已有的内容清除
						// if (parent=='#dynamic')$('#dynamic').children().remove();//重新加载之前把已有的内容清除
						// $('.main-view '+parent+'').append(result);
						$('#home-container').append(result);
						$('#home-container').show();
						var h = $('#headSwiper').css('height');
						var width =screenWidth*0.40625
						$('#home #headSwiper').css('height', width+'px');
						 h = h.substring(0,h.indexOf('px'));
						 h = ~~h;
						if(h>(screenWidth*0.5)){
							 mySwiper = app.swiper('#home_swiper', {
								pagination:'#home_pagination',
								autoplay: 3000,
								autoplayDisableOnInteraction : false,
								auto:100,
								observer:true,
								observeParents:true
							});

						}
						// if(parent=='#home'){
						//
						// }
						// if(parent=="#dynamic"){
						// 	var h2 = $('#dynamic #headSwiper').css('height');
						// 	var width =screenWidth*0.40625
						// 	$('#dynamic #headSwiper').css('height', width+'px');
						// 	 h2 = h2.substring(0,h2.indexOf('px'));
						// 	 h2 = ~~h2;
						// 	if(h2>(screenWidth*0.5)){
						// 		 mySwiper2 = app.swiper('.dyna_swiper', {
						// 			pagination:'.dyna_pagination',
						// 			autoplay: 3000,
						// 			autoplayDisableOnInteraction : false,
						// 			auto:100,
						// 			observer:true,
						// 			observeParents:true
						// 		});
						// 	}
						// }
						initFunction();
						// app.pullToRefreshDone();
						upbox.loading.hide();
						//计算一些栅格的宽度
						$('#newScore .slideBox').css({
							width: scoreList.length*screenWidth*.875+28+(scoreList.length)*12+'px'
						});
						$('#willBegin .slideBox').css({
							width: futureList.length*screenWidth*.875+24+(futureList.length)*12+'px'
						});
						if(vList!=null&&vList.length>0){
						var l = videoList.result.uCmsLogList.length;
						$('.recommend .r').css({
							width: 100*l+l*15+50+'px'
						})
						}
						$('.matchBox').css({
							width:screenWidth*.87+'px'
						});
						if(rStatus==1){rStatus=0}
						homeShare();
						if(status==true) initDynaStorage();
				}
				//动态缓存
				 function addDynaStorage(data,type){
					if(type=='add'){
						if(dynaStorage.list==null||typeof(dynaStorage.list)=='undefined') dynaStorage.list = [];
							dynaStorage.list = dynaStorage.list.concat(data);
					}
					if(type=='history'){
							dynaStorage.scroll = data;
					}
					if(type=='banner'){
						if(dynaStorage.banner==null||typeof(dynaStorage.banner)=='undefined') dynaStorage.banner = [];
							dynaStorage.banner = data;
					}
					 dynaStorage.pageNum = ~~dPageNoTop;
					 sessionStorage.dyStorage = JSON.stringify(dynaStorage);
				}
				 function removedynaStorage(){
					sessionStorage.clear('dyStorage')
					//  sessionStorage.dyStorage = JSON.stringify(dynaStorage);
				}
				 function initDynaStorage(){
					dPageNoTop = ~~dynaStorage.pageNum;
					document.getElementById('dynamic').scrollTop=~~dynaStorage.scroll;
					dynaStorageStatus = false;
				}


				 function clipPlaceName(list){
					for(var i in list){
						var pname  = list[i].courtName;
						if (pname) {
							var pindex = pname.indexOf('｜');
							if(pindex==-1) pindex =pname.indexOf('丨');
							if (pindex>=0) {
								list[i].placeName = pname.substring(0,pindex);
							}
						}

					}
					return list;
				}
				 function renderHead(data,parent){
	          var result=ejs.render(data, {
	            name: race.id,
							topName:race.topname,
							color:race.color,
							imgid:race.imgID
	          });
	          $('.main-view '+parent+'').append(result);
						 _init();
						$('#topName').on('click', function(event) {
							if($('.raceList').css('display')=="none") $('.raceList').show();
							else $('.raceList').hide();
						});
						$('#headtop').on('click', function(event) {
							if($('.raceList').css('display')=="none") $('.raceList').show();
							else $('.raceList').hide();
						});
						$('#head_back').on('click',function(event) {
							event.preventDefault();
							if($('.raceList').css('display')=="none") $('.raceList').show();
							else $('.raceList').hide();
						});
						$('.column a').on('click',  function(event) {
							event.preventDefault();
							sessionStorage.clear('scheStorage');
							sessionStorage.clear('dyStorage');
							window.location.href = localurl+'?rn='+this.id+'&pid=0';
						});
						$('.tab a').on('click',function(event){
								rStatus=0;
								refStatus=false;
								pid=0; //不管点击哪个 默认pid为0 ，方便加载首页
								upbox.loading.hide();
								tabchange(this);
								$('#details-team').children().remove();
								$('#details-dyna').children().remove();
								var id = this.id;
								if(id=='item1'){
									window.location.href= localurl+'?rn='+race.id+'&pid='+0;
									// if($('#home').html()=="")getHomedata();
									// else {clearPage();$('#home').show();}
								}
								// if(id=='item2')load('schedule')
								// localurl
								if(id=='item2') window.location.href= localurl+'?rn='+race.id+'&pid='+1;
								if(id=='item3')
								{
									window.location.href= localurl+'?rn='+race.id+'&pid=2&tab=0';
									// if (race.id=='all') {load('process');
									// }else{ajaxForRrid();}//要判断是淘汰赛还是常规赛
								}
								if(id=='item4')window.location.href= localurl+'?rn='+race.id+'&pid='+3;

						});
	      }
				 function ajaxForRrid() {
					$.ajax({
						url: apiDomain+'match_getRule.do?rid='+race.rid,
						type: 'GET',
						dataType: 'jsonp',
						jsonp:'jsonCallback',
						success:function(e){
							var list = e.result.rules;
							var l =	list.length;
							for (var i = 0; i < l; i++) {
									// race.rrid=list[i].ruleId;
							if (list[i].knockout==1) race.krrid = list[i].ruleId;
							if (list[i].knockout==0) race.unkrrid = list[i].ruleId;
							}
							load('rank-out');
						}
					})
				}
				 function tabchange(item){
					$('.tab a text').removeClass('tabSelect');
					$('.tab a img').hide();
					$(item).children('text').addClass('tabSelect');
					$(item).children('img').show();
				}
				 function switchRid(rid){
					switch (rid) {
						case '2017cerezocup':return 'yh'; break;
						case '2017supercup':return 'super'; break;
						case '17ssfl':return 'ssfl' ;break;
						case '17sysfl':return 'sysfl'; break;
						case '17SSFL5-SP':return 'ssfl5'; break;
						case '17sysfl-u9':return 'sysflu9'; break;
						case '17sysfl-u11':return 'sysflu11'; break;

						case '127':return 'yh'; break;
						case '136':return 'super'; break;
						case '90':return 'ssfl' ;break;
						case '128':return 'sysfl'; break;
						case '131':return 'ssfl5'; break;
						case '152':return 'sysflu9'; break;
						case '153':return 'sysflu11'; break;
						default: return 'yh';
					}
				}
				/**
				 * share
				 */
				 function initTeamShare(name,img){ //球队页面分享
					var title = '哪支球队能够最终捧起'+name+'的奖杯？';
					var desc = name+"球队巡礼";
					 wxConfig({
					 	title:title,
					 	desc:desc,
					 	imgUrl:img,
					 	link:locationUrl
					 });
				 }
				 function scheduleShare(url){
					var  title = '哪两支球队将会在今天的比赛中相遇？';
					var  desc = "查看上海足球超级联赛赛程表";
					 wxConfig({
					 	title:title,
					 	desc:desc,
					 	imgUrl:race.logo,
					 	link:locationUrl
					 });
				 }
				 function homeShare(pid){
					  var  title = '全上海业余足球圈的精英都在这里比赛!';
	 					var desc = "上海足球超级联赛正在进行中";
	 					wxConfig({
	 					 title:title,
	 					 desc:desc,
	 					 imgUrl:race.logo,
	 					 link:locationUrl
	 					});
				 }
				 function processShare(){
						var  title = '上海足球超级联赛进程';
						var desc = "随时随地关注上超赛事动向";
						 wxConfig({
							title:title,
							desc:desc,
							imgUrl:race.logo,
							link:locationUrl
						 });
			    }
				 function dynaDetailShare(title){
						var title = title;
						var desc = "为你奉上最新的上超新闻资讯";
						wxConfig({
						 title:title,
						 desc:desc,
						 imgUrl:race.logo,
						 link:locationUrl
						});
				 }
				 function teamDetailShare(teama,teamb,name){
					var title = teama+' VS '+teamb;
					var desc = "2017上超联赛激战正酣";
					 wxConfig({
						title:title,
						desc:desc,
						imgUrl:race.logo,
						link:locationUrl
					 });
			   }
			   function rankShare(tab,id){
						var	title,desc
						if(id=="tree") {
							title='经历了残酷的淘汰赛，最终闯进决赛的两支队伍竟然是......'
							desc = race.topname+'淘汰赛对阵详情'
						}
						if(id=="scroing"){
							title='本轮过后，射手榜排行第一竟然是......'
							desc = race.topname+'常规赛射手榜'
						}
						if(id=="integrate"){
							title='本轮过后，积分榜排行第一的球队竟然是......'
							desc = race.topname+'常规赛积分榜'
						}
						if(id=="assists"){
							title='本轮过后，助攻榜排行第一竟然是......'
							desc = race.topname+'常规赛助攻榜'
						}
						wxConfig({
						 title:title,
						 desc:desc,
						 imgUrl:race.logo,
						 link:localurl+'?rn='+race.id+'&pid=2&tab='+tab
						});
			   }
				 /**
				  * 登录模块
				  */
					upbox.APP.init = function(e){
						user = {
							userId:e.result.userId,
							md5:e.result.md5
						}
					 // user  = {
					 // 	userId:'2d466edc-89e7-4052-97e1-7b5c45b586f3',
					 // }
						parseEJS('head');
					}
				 function login(callbackName){
					 upbox.getUserInfo({login:true,callback:callbackName})
				 }

				 function doJSONP(url,data,callback){
					 $.ajax({
					 	url: apiDomain_w+url,
					 	type: 'GET',
					 	dataType: 'jsonp',
						jsonp:'jsonCallback',
					 	data: data,
						success:function(e){
							if(e.ret=='1'&&callback) callback(e);
							else(app.alert(e.errorMsg));
						}
					 })
				 }
				 /*
 					getejs
 				*/
 				function readEjs(name,callback){
 					$.ajax({
 						url:'../ejs/'+name+'.ejs',
 						method:'GET',
 						success:function(data){
 							if(callback) callback(data);
 						}
 					})
 				}
				/**
				 * 加载排行榜
				 */
			function initKnockout(id){

						var config = {
								container: "#"+id+"",
								rootOrientation:  'WEST', // NORTH || EAST || WEST || SOUTH
								// levelSeparation: 30,
								levelSeparation: 20,
								siblingSeparation: 15,
								subTeeSeparation: 15,
								rootOrientation: "EAST",
								nodeAlign: 'CENTER',
								node: {
									drawLineThrough: false,
									HTMLclass: 'team-node'
								},
								connectors: {
									type: "step",
									style: {
										"stroke-width": 1,
										"stroke": race.color
									}
								}
						}
						ALTERNATIVE = [config];
						getRaceList(-1,function(e){
							addNode(e.result.tree,'ROOT');
							new Treant( ALTERNATIVE );
							$('.team-node').css('border-color', race.color);
							$('.team-node .node1 #mid text').css('color', race.color);
							upbox.loading.hide()
						})
					 function addNode(data,parent){
					 var node  = {}
					 if (parent=='ROOT') {
						 var html1 = nodeModal(data);
						 var win  = winnerModal(data);
						 var champ = {
							 innerHTML:win,
							 HTMLid:"champion"
						 }
						 var champImgNode={
							 parent:champ,
							 image:'../image/football.png',
							 HTMLid:"champ_img"
						 }
						 node.parent1={
								parent:champImgNode,
								innerHTML:html1,
								HTMLid: "winner"
						 }
						 ALTERNATIVE[ALTERNATIVE.length]=champ;
						 ALTERNATIVE[ALTERNATIVE.length]=champImgNode;
						 ALTERNATIVE[ALTERNATIVE.length]=node.parent1;
					 }else{
						 node.parent1 = parent;
						ALTERNATIVE[ALTERNATIVE.length]=node.parent1;
					 }
					 console.log(data.xj);
					 if (data.xj[0]) {
						var html = nodeModal(data.xj[0]);
						 node.child1={
							 parent:node.parent1,
							 innerHTML:html,
							 HTMLid: "mainNode"
						 }
						ALTERNATIVE[ALTERNATIVE.length]=node.child1;
					 }
					 if (data.xj[1]) {
						 var html2 = nodeModal(data.xj[1]);
						 node.child2={
							 parent:node.parent1,
							 innerHTML:html2,
							 HTMLid: "subNode"
						 }
						 ALTERNATIVE[ALTERNATIVE.length]=node.child2;
					 };
					 if (data.maintime!=null&&node.child1!=null) {
							 addNode(data.maintime,node.child1);
					 }
					 if (data.subtime!=null&&node.child2!=null) {
								addNode(data.subtime,node.child2);
					 }
					}
					 function nodeModal(data){
							var leftTeam,mid,mid2 = "",rightTeam;
							leftTeam = teamExistModal(data.zTeamLogo,data.zTeamName);
							rightTeam = teamExistModal(data.kTeamLogo,data.kTeamName);
							if(data.scorem==-1&&data.dScores==-1){
								mid = dafaultMidModal();
							}else{
								if(data.scorem !=-1)  mid = midModal(data,1);
								if(data.dScores!=-1) mid2 = midModal(data,2)
							}
							var html = '<div class="node1"><div id="left" class="team">'+leftTeam+'</div><div class="midBox" style="">'+mid+''+mid2+'</div><div id="right" class="team">'+rightTeam+'</div></div>'
							return html
					 }
					 function teamExistModal(logo,name){
						 if(!name) name = '待定';
						 return '<img src="'+isLogo(logo)+'" alt=""><text style="font-size:13px;">'+name+'</text>'
					 }
					 function teamDefaultModal(){
						 return '<img src="../image/logo-default.png" alt=""><text>待定</text>'
					 }
					 function midModal(data,type){
						 var scorem,scores,result;
						 if(type==1){
							 scorem = data.scorem;
							 scores = data.scores;
							 result =data.result;
						 }else{
							 scorem = data.dScorem;
							scores = data.dScores;
							result =data.dresult;
						 }
						 if(data.result==""){
							 return '<div id="mid"><text id="score">'+data.scorem+':'+data.scores+'</text> </div>'
						 }else{
							 return '<div id="mid" ><text id="score">'+data.result+'</text><text id="penalty">点球('+data.scorem+'<span style="margin:0 4px;">:</span>'+data.scores+')</text>  </div>'
						 }
					 }
					 function dafaultMidModal(){
						 return '<div id="mid"><text class="vs">VS</text> </div>'
					 }
					 function winnerModal(data){
						 var logo,name;
						 if (data.scorem>data.scores) {//表示主队是冠军
							logo = isLogo(date.zTeamLogo);
							name = data.zTeamName;
						}else if(data.scorem<data.scores){
							logo = isLogo(data.kTeamLogo);
							name = data.kTeamName;
						}else{
							logo = isLogo("");
							name = "待定";
						}
							var html = '<div style="width:140px" class="winner">'+
							'<img style="width:100%;margin-top:-32px" src="../image/winner.png">'+
							'<div style="width:100px;margin:0 auto;"><img style="width:50px" src="'+logo+'" ><text style="display:block;font-size:13px;text-align:center">'+name+'</text></div></div>';
							return html;
					 }
					 function isLogo(logo) {
						 if(!logo) logo = '../image/logo-default.png';
						 else logo = toHttps(logo)
						 return logo;
					 }
					}
			login('init');

  });
})(window);
