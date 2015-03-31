(function($, window, undefined){

	"use strict";

	// 定数定義
	var CONSTANT = {
		SIZE: {
			width: 1280,
			height: 720
		},
		fps: 30,
		SCREEN: {
			LOADING: 0,
			TITLE:   1,
		}
	};

	var manifest = [
		{id: "normal", src: "/assets/img/technyan-normal.png"},
		{id: "angry", src: "/assets/img/technyan-angry.png"},
		{id: "smile", src: "/assets/img/technyan-smile.png"},
		{id: "back", src: "/assets/img/back.png"},
		{id: "sound", src: "/assets/sound/nc43138.wav"}
	];

	var _stage, _load;

	var _SCREENSTATUS = CONSTANT.SCREEN.LOADING;
	var _SCREENSTATUS_OLD = null;

	var game, Game = function() {
		game = this;
		this.stage = null;
		this.initalized();
	};
	Game.prototype = {
		// 初期化
		initalized: function() {
			// 画面領域の設定(Retinaの対応)
			$("#game").attr({width: CONSTANT.SIZE.width, height: CONSTANT.SIZE.height}).css({width: CONSTANT.SIZE.width/2, height:CONSTANT.SIZE.height/2});
			// ステージの作成
			this.stage = new createjs.Stage($("#game").get(0));
			// 入力の受付
			createjs.Touch.enable(this.stage);
			// FPSの設定
			createjs.Ticker.setFPS(CONSTANT.fps);
			// ticker
			createjs.Ticker.addEventListener("tick", $.proxy(this.transitScreen, this));
		},
		transitScreen: function() {
			// 画面が変更されたら
			if ( _SCREENSTATUS != _SCREENSTATUS_OLD ) {
				// ローディング画面
				if ( _SCREENSTATUS == CONSTANT.SCREEN.LOADING ) {
					this.stage.removeAllChildren();
					this.stage.addChild(this.displayLoading());
				}
				// タイトル画面
				else if ( _SCREENSTATUS == CONSTANT.SCREEN.TITLE ) {
					this.stage.removeAllChildren();
					this.stage.addChild(this.displayTitle());
				}
			}
			this.stage.update();
			_SCREENSTATUS_OLD = _SCREENSTATUS;
		},
		// ローディング画面
		displayLoading: function() {
			// Loadingのコンテナ
			var container = new createjs.Container();

			// 黒色の背景
			var back = new createjs.Shape();
			back.graphics.f("#000").r(0, 0, CONSTANT.SIZE.width, CONSTANT.SIZE.height);
			back.set({x: 0, y: 0});
			var text = new createjs.Text();
			text.set({
				x: CONSTANT.SIZE.width/2,
				y :CONSTANT.SIZE.height/2 - text.getMeasuredHeight()/2,
				text: "よみこみちゅう   ",
				font: "24px PixelMplus12",
				color: "#FFF",
				textAlign: "center"
			});

			container.addChild(back, text);

			createjs.Tween.get(text, {loop: true, ignoreGlobalPause: false})
				.to({text: "よみこみちゅう.  "}, 500)
				.to({text: "よみこみちゅう.. "}, 500)
				.to({text: "よみこみちゅう..."}, 500)
				.wait(500);

			return container;
		},
		// タイトル画面
		displayTitle: function() {
			// タイトル画面用のコンテナ
			var container = new createjs.Container();

			// 黒色の背景
			var back = new createjs.Shape();
			back.graphics.f("#000000").r(0, 0, CONSTANT.SIZE.width, CONSTANT.SIZE.height);
			back.set({x: 0, y: 0});

			var halo = new createjs.Bitmap("/assets/img/back.png");
			halo.regX = 960;
			halo.regY = 960;
			halo.set({
				regX: 640, regY: 640, x: 640, y: 440, scaleX: 1.5, scaleY: 1.5,
				alpha: 0
			})
			createjs.Tween.get(halo, {loop: true, ignoreGlobalPause: false})
				.to({rotation:360}, 10000);

			var technyans = {
				normal: new createjs.Bitmap(preload.load.getResult("normal")),
				angry:  new createjs.Bitmap(preload.load.getResult("angry")),
				smile:  new createjs.Bitmap(preload.load.getResult("smile"))
			};

			var text = new createjs.Text();
			text.set({
				x: CONSTANT.SIZE.width/2,
				y: 80,
				text: "てくにゃんを喜ばせろ!!!!",
				font: "50px メイリオ",
				color: "#FFF",
				textAlign: "center"
			});

			var technyan = technyans.normal;

			// てくにゃんをクリックした時の効果
			technyan.addEventListener("click", function(){
				halo.alpha += 0.12;
				if ( halo.alpha >= 0.3 ) {
					container.removeChild(text);	
				}
				createjs.Tween.get(technyan, {loop: false, ignoreGlobalPause: false})
					.to({scaleX: 0.95, scaleY: 0.95}, 50)
					.to({scaleX: 1.0, scaleY: 1.0}, 100);
				
			});

			var flag = true;

			createjs.Ticker.addEventListener("tick", function(evt) {
				container.removeChild(technyan);
				if ( halo.alpha > 0 && flag ) {
					halo.alpha -= 0.02;
				}
				if ( halo.alpha > 1 ) {
					technyan = technyans.smile;
					if ( flag )	{
						createjs.Sound.play("sound");
						text.set({
							text: "てくにゃんはお喜びになられている!!!",
							color: "#000"
						});
						container.addChild(text);
					}
					flag = false;
				}
				technyan.set({ regX: 270, regY: 270, x: 640, y: 440 });
				container.addChild(technyan);
			});

			container.addChild(back, halo, text);

			return container;
		}
	};


	// Preload.js
	var preload, Preload = function() {
		preload = this;
		this.load = null;
		this.initalized();
	};
	Preload.prototype = {
		// 初期化
		initalized: function() {
			// Preload.js
			this.load = new createjs.LoadQueue();

			// Sound.js
			this.load.installPlugin(createjs.Sound);

			// 最大並列接続数
			this.load.setMaxConnections(6);

			// 読み込みの進行状況が変化した
			this.load.addEventListener("progress", this.handleProgress);
			// 1つのファイルを読み込み終わったら
			//this.load.addEventListener("fileload", this.handleFileLoadComplete);
			// 全てのファイルを読み込み終わったら
			this.load.addEventListener("complete", this.handleComplete);

			// 読み込み開始
			this.load.loadManifest(manifest);
		},
		// 読み込み中
		handleProgress: function(event) {
			// 読み込み率を0.0~1.0で取得
			var progress = event.progress;
		},
		// ファイルごとの読み込み完了イベント
		handleProgress: function(event) {
			// 読み込んだファイル
			var result = event.result;
		},
		// 読み込み完了
		handleComplete: function() {
			_SCREENSTATUS = CONSTANT.SCREEN.TITLE;
		}
	}

	$(document).ready(function(e){
		new Preload();
		new Game();
		window.game = game;
	});

}(jQuery, window, undefined));
