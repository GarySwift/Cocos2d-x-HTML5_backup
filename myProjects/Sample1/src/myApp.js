/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


 /*var myObject = {
         value: 0,
         increment: function (inc) {
             this.value += typeof inc === 'number' ? inc : 1;
} };

var add = function (a, b) 
{ 
    
    return a + b;
};

myObject.increment(4);

cc.log("get value "+myObject.value); // 6

// Augment myObject with a double method.
myObject.double = function () 
{
    var that = this; // Workaround.
    var helper = function () 
    {
        that.value = add(that.value, that.value);
        //cc.log("that.value "+that.value);
    };
    helper(); // Invoke helper as a function. 
};
     // Invoke double as a method.
     myObject.double()
cc.log("that.value "+myObject.value);
//var x = myObject.double(); 
//cc.log();


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Create a constructor function called Quo.
// It makes an object with a status property.
var Quo = function (string) {
         this.status = string;
     };
// Give all instances of Quo a public method
// called get_status.
Quo.prototype.get_status = function () {
 return this.status;
};

// Make an instance of Quo.
var myQuo = new Quo("confused");
cc.log(myQuo.get_status()); // confused

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
var add = function (a, b) { 

    return a + b;
};

// Make an array of 2 numbers and add them.
var array = [3, 4];
var sum = add.apply(null, array);    // sum is 7
add(3, 5);

cc.log("sum"+sum);

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

var add = function (a,b)
{

    return a+b
}

var numSum = {
    Name:add(10,15)
}

The first parameter of apply is the object that it needs to bind to. 

If there is no object then the parameter is null

var sum = add.apply(null,[2,3])
cc.log("sum "+sum);

var sum2 = add.call(null,3,4)
cc.log("sum2 "+sum2);


var printName = function (firstName,lastName)
{
    this.Name = firstName+" "+lastName;
}


printName.prototype.getName = function ()
{
    cc.log(this.Name)
    return this.Name;
}

var myName = printName.prototype.getName.apply(numSum); // 25

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



 var fade = function (node) 
 {
    var level = 1;
    var step = function () 
    {
        var hex = level.toString(16); 
        node.style.backgroundColor = '#FFFF' + hex + hex; 
        if (level < 15) 
        {
            level += 1;
            setTimeout(step, 100);
        }
    };
    setTimeout(step, 100);
};
fade(document.body);
*/

var child;

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));
        cc.log(closeItem.getPositionX()+" "+closeItem.getPositionY())

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        
        child = cc.Sprite.create(s_pathGrossini);
        child.setPosition(size.width/2,size.height/2);
        this.addChild(child,1000,1230);


        

        var lazyLayer = new cc.LazyLayer();
        this.addChild(lazyLayer);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        lazyLayer.addChild(this.sprite, 0);

        return true;
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
        var tempvar = 10;
        cc.log("tempvar "+tempvar);
        
        var action = cc.Spawn.create(
            cc.JumpBy.create(2, cc.p(0, 0), 50, 4),
            cc.RotateBy.create(2, 720),
            cc.MoveBy.create(2, cc.p(150, 0))    
            );
        //this._grossini.runAction(action);
        child.runAction(action);
        child.runAction(cc.Sequence.create(
            cc.DelayTime.create(1.4),
            cc.FadeOut.create(1.1)),
            cc.MoveBy.create(1, cc.p(150, 0))
        );
    }
});
