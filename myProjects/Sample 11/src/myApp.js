var MyApp = cc.LayerColor.extend(
{
    init:function()
    {
      this_.super();

        var size = cc.Director.getInstance().getWinSize();
        this.setColor(new cc.Color3B(100,0,0));
        console.log('hello');
        
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






