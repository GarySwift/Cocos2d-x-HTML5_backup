var MyApp = cc.LayerColor.extend(
{
    bgWidth:null,
    bgRatio:null,
    parallaxEffectNode:null,
    parallaxEffectNode2:null,
    background:null,
    busRoad:null, 
    sky:null,
    buildingFront:null,
    buildingBack:null,
    sideWalk:null,
    road:null,
    parallaxImage1:null,
    parallaxImage2:null,
    parallaxImage3:null,
    trainBoogie:null,
    trainEngine:null,
    busBody:null,
    busWheel1:null,
    busWheel2:null,
    init:function()
    {
        bgRatio = 0.2;
        bgWidth = 1024;

        var size = cc.Director.getInstance().getWinSize();

        var menuItem1 = new cc.MenuItemFont.create("Move Left",this.moveLeft, this);
        var menuItem2 = new cc.MenuItemFont.create("Move Right",this.moveRight, this);
        var menuItem3 = new cc.MenuItemFont.create("Move Up",this.moveUp, this);
        var menuItem4 = new cc.MenuItemFont.create("Move Down",this.moveDown, this);

        menuItem1.setFontSize(14);
        menuItem2.setFontSize(14);
        menuItem3.setFontSize(14);
        menuItem4.setFontSize(14);

        menuItem1.setAnchorPoint(0,0.5);
        menuItem2.setAnchorPoint(0,0.5);
        menuItem3.setAnchorPoint(0,0.5);
        menuItem4.setAnchorPoint(0,0.5);

        menuItem1.setPosition(new cc.Point(20,size.height-30));
        menuItem2.setPosition(new cc.Point(20,size.height-50));
        menuItem3.setPosition(new cc.Point(20,size.height-70));
        menuItem4.setPosition(new cc.Point(20,size.height-90));

        this.parallaxEffectNode = new ek.Parallax();
        this.parallaxEffectNode.addBackground([s_SkyLoop,s_Sky], .2);
       /* this.parallaxEffectNode.addToHorizontalStack([cc.p(0,10),s_BuildingBack]);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,-20),s_BuildingFront],4000);
        this.parallaxEffectNode.addToHorizontalStack([s_Building1,s_Building2,cc.p(600,0),s_Building3,s_Building1,cc.p(900,0),s_Building3,s_Building1,s_Building2,s_Building3,cc.p(600,0),s_Building3,s_Building3,cc.p(900,0),s_Building1,s_Building3],4000);
        this.parallaxEffectNode.addTiledObject([s_Road],30);

        busBody = cc.Sprite.create(s_BusBody);
        busWheel1 = cc.Sprite.create(s_BusWheel);
        busWheel2 = cc.Sprite.create(s_BusWheel);

        busBody.setAnchorPoint(0.5,0)

        busBody.setPosition(cc.p(size.width/2,220));
        busWheel1.setPosition(cc.p(100,200));
        */

        //this.parallaxEffectNode.addToHorizontalStack([cc.p(1600,0),s_Building1,cc.p(600,0),s_Building2,cc.p(2000,0),s_Building1,s_Building2]);
        //this.parallaxEffectNode.addToHorizontalStack([s_Building1,s_Building2,s_Building3,cc.p(600,0),s_Building3,s_Building1,s_Building2,s_Building3,cc.p(900,0),s_Building3,s_Building1,s_Building2,s_Building3,s_Building1,s_Building2,s_Building3,cc.p(600,0),s_Building3,s_Building1,s_Building2,s_Building3,cc.p(900,0),s_Building3,s_Building1,s_Building2,s_Building3],4000);
        //this.parallaxEffectNode.addToHorizontalStack([cc.p(350,125),s_trainEngine,cc.p(-10,140),s_trainBoogie], 6000 ,false);
        //console.log("creating parallax node");

        var menu = cc.Menu.create(menuItem1,menuItem2,menuItem3,menuItem4);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,1);
        this.addChild(this.parallaxEffectNode);
       /* this.addChild(busBody);
        this.addChild(busWheel1);
        this.addChild(busWheel2);*/
        this.parallaxEffectNode.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        return this;
    },
    moveLeft:function(){
        this.parallaxEffectNode.loopParallaxLeft();
        var goUp = cc.MoveBy.create(1, cc.p(0, 10));
        var seq = cc.Sequence.create(goUp,goUp.reverse());
        var trainAction = cc.RepeatForever.create(seq);
        
    },
    moveRight:function(){
        this.parallaxEffectNode.loopParallaxRight();
        var goUp = cc.MoveBy.create(.1, cc.p(0, 5));
        var goDown = cc.MoveBy.create(.1, cc.p(0, -5));
        var seq = cc.Sequence.create(goUp,goUp.reverse());
        var seq2 = cc.Sequence.create(goDown,goDown.reverse());
        this.trainEngine.runAction(cc.RepeatForever.create(seq));
        this.trainBoogie.runAction(cc.RepeatForever.create(seq2));
    },
    update:function(){
    },
    exit:function(){
        // document.location.href = "http://www.gamefromscratch.com";
    }
});


var MyScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }
});






