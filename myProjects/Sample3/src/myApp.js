/*//Chapter 1 & 2

var MyApp = cc.Layer.extend(
{
    init:function()
    {
        
        var layer1 = cc.LayerColor.create(
            new cc.Color4B(33, 33, 28, 255), 600, 600)
        var jetSprite = cc.Sprite.create(s_Jet);

        layer1.setPosition(new cc.Point(0.0,0.0));
        layer1.addChild(jetSprite);    
        
        var size = cc.Director.getInstance().getWinSize();
        jetSprite.setPosition(new cc.Point(size.width/2,size.height/2));

        this.addChild(layer1);
        return true;
    }
});


var MyScene = cc.Scene.extend({

    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }

})
_________________________________________________________________________
*/

//Chapter 3

var MyApp = cc.LayerColor.extend(
{   _jetSprite:null,
    init:function(){
        this._super();
        //this.initWithColor(new cc.Color4B(0,0,0,255));
        var size = cc.Director.getInstance().getWinSize();

        this._jetSprite = new JetSprite();
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);

        this.setPosition(new cc.Point(0,0));

        this.addChild(this._jetSprite);
        this._jetSprite.setPosition(new cc.Point(size.width/2,size.height/2));
        this._jetSprite.scheduleUpdate();
        this.schedule(this.update);

        return true;
    },
    onEnter:function(){
        this._super();
    },
    update:function(dt){
    },
    onTouchesEnded:function (pTouch,pEvent){
        console.log("pEvent ",pTouch[0])
        this._jetSprite.handleTouch(pTouch[0].getLocation());
    },
    onTouchesMoved:function(pTouch,pEvent){
        this._jetSprite.handleTouchMove(pTouch[0].getLocation());
    },
    onKeyUp:function(e){

    },
    onKeyDown:function(e){
        this._jetSprite.handleKey(e);
    }
});



var MyScene = cc.Scene.extend({

    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }

})







