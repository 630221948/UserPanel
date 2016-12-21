//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var exitButton = this.createBitmapByName("exitbutton_png");
        var ghostIcon = this.createBitmapByName("Ghost_png");
        var soapIcon = this.createBitmapByName("Soap_png");
        ghostIcon.scaleX = 0.5;
        ghostIcon.scaleY = 0.5;
        soapIcon.scaleX = 0.5;
        soapIcon.scaleY = 0.5;
        var bullet_0 = new Bullet(BulletType.JHP, BulletLvl.GENERAL);
        var bullet_1 = new Bullet(BulletType.FLAMING, BulletLvl.MILITARY);
        var UMP45 = new Weapon(10, Quality.WHITE, bullet_0, 10, "UMP45");
        var M4 = new Weapon(10, Quality.BLUE, bullet_1, 10, "M4");
        var Soap = new Hero(100, 5, UMP45, "\"Soap\" MacTavish");
        var Ghost = new Hero(100, 5, M4, "\"Ghost\"");
        //var laoer: Hero = new Hero();
        var heroTeam = [];
        heroTeam.push(Soap);
        heroTeam.push(Ghost);
        //heroTeam.push(laoer);
        var user = new User(0, 0, 0, 0, heroTeam);
        console.log(user.fightPower);
        var heroesInfoField;
        var heroesPanel = new egret.DisplayObjectContainer();
        var panelY = 0;
        // for (var h of user.hero) {
        //     heroesInfoField = displayUtils(h);
        //     heroesInfoField.y = panelY;
        //     heroesPanel.addChild(heroesInfoField);
        //     panelY += 200;
        // }
        heroesPanel.x = -300;
        heroesPanel.width = 200;
        heroesPanel.height = 400;
        var panelMap = new egret.Shape();
        heroesPanel.addChild(panelMap);
        panelMap.graphics.beginFill(0x000000);
        panelMap.graphics.drawRect(0, 0, 300, 600);
        panelMap.graphics.endFill();
        panelMap.alpha = 0.7;
        heroesPanel.addChild(soapIcon);
        heroesPanel.addChild(ghostIcon);
        soapIcon.x = 180;
        soapIcon.y = 0;
        ghostIcon.x = 180;
        ghostIcon.y = 200;
        heroesPanel.addChild(exitButton);
        exitButton.scaleX = 0.2;
        exitButton.scaleY = 0.2;
        exitButton.x = 280;
        exitButton.y = 580;
        exitButton.touchEnabled;
        for (var _i = 0, _a = user.hero; _i < _a.length; _i++) {
            var h = _a[_i];
            heroesInfoField = displayUtils(h);
            heroesInfoField.y = panelY;
            heroesPanel.addChild(heroesInfoField);
            panelY += 200;
        }
        this.addChild(heroesPanel);
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            console.log("233333");
            var tw = egret.Tween.get(heroesPanel);
            tw.to({ x: 20 }, 500);
            exitButton.touchEnabled = true;
        }, this);
        exitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            var tw = egret.Tween.get(heroesPanel);
            tw.to({ x: -300 }, 500);
            exitButton.touchEnabled = false;
        }, this);
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map