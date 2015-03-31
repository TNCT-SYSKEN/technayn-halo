(function($, window, undefined){

	"use strict";

	// 定数定義
	var CONSTANT = {
		SIZE: {
			width: 1920,
			height: 1080
		},
		fps: 30,
		SCREEN: {
			LOADING: 0,
			TITLE:   1,
		}
	};

	var manifest = [
		{}
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
			back.graphics.f("#ccc").r(0, 0, CONSTANT.SIZE.width, CONSTANT.SIZE.height);
			back.set({x: 0, y: 0});
			var text = new createjs.Text("よみこみかんりょう", "48px PixelMplus12", "#000");
			text.set({
				x: CONSTANT.SIZE.width - text.getMeasuredWidth() - 10,
				y :CONSTANT.SIZE.height - text.getMeasuredHeight() - 50,
			});

			container.addChild(back, text);

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
