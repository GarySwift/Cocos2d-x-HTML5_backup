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
    init:function()
    {
        bgRatio = 0.2;
        bgWidth = 1300;

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
        this.parallaxEffectNode.addBackground([mountainsLoop,mountains], .2);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,-60),s_trainHill2], 4000);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,130),s_trainHill1], 10000);
        this.trainBoogie = cc.Sprite.create(s_trainBoogie);
        this.trainEngine = cc.Sprite.create(s_trainEngine);
        this.trainEngine.setPosition(400,215);
        this.trainBoogie.setPosition((this.trainEngine.getPositionX()+this.trainEngine.getContentSize().width-40),195);

        this.parallaxEffectNode2 = new ek.Parallax();
        this.parallaxEffectNode2.addBackground([mountainsLoop,mountains], .2, false);
        this.parallaxEffectNode2.addToHorizontalStack([s_trainBridge,s_trainBridge,s_trainBridge]);
        var menu = cc.Menu.create(menuItem1,menuItem2,menuItem3,menuItem4);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,1);
        this.addChild(this.parallaxEffectNode);
        this.addChild(this.trainBoogie);
        this.addChild(this.trainEngine);
        this.addChild(this.parallaxEffectNode2);
        this.parallaxEffectNode.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        this.parallaxEffectNode2.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        return this;
    },
    moveLeft:function(){
        cc.log("i am in move left");
        this.parallaxEffectNode.loopParallaxLeft();
        this.parallaxEffectNode2.loopParallaxRight();

        var goUp = cc.MoveBy.create(1, cc.p(0, 10));
        var seq = cc.Sequence.create(goUp,goUp.reverse());
        var trainAction = cc.RepeatForever.create(seq);
        
    },
    moveRight:function(){
        this.parallaxEffectNode.loopParallaxRight();
        this.parallaxEffectNode2.loopParallaxRight();

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


var ChipmunkTestScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }
});






