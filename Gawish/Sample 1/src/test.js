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


var chipmunkTestSceneIdx = -1;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var v = cp.v;


var BoxDemo = cc.Layer.extend({
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    v:cp.v,
    GRAVITY:1000,
    space:null,
    self:null,
    ctor:function(){
      this._super();
      cc.associateWithNative(this,cc.Layer);
    },
    init:function () {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.Director.getInstance().getWinSize();
        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        // Create the initial space
        this.scale = 1;
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -this.GRAVITY);
        this.space.iterations = 60;
        this.space.sleepTimeThreshold = 0.5;
        this.space.collisionSlop = 0.5;

        this.mouse = v(0,0);
        this.setupDebugNode(true);
        this.simulationTime = 0;
        this.drawTime = 0;
        this.scheduleUpdate();

        self = this;
        this.setTouchEnabled(true);
        var mouseBody = this.mouseBody = new cp.Body(Infinity, Infinity);
        return true;
    },
    BoxDemo:function()
    {
        var space = this.space;
        var boxOffset;

        var addBox = function(pos)
        {
            var mass = 0.5;
            var width = 508;
            var height = 210;

            var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
            body.setPos(pos);

            var shape = space.addShape(new cp.BoxShape(body, width, height));
            shape.setElasticity(0.3);
            shape.setFriction(0.3);
            shape.group = 1; // use a group to keep the car parts from colliding

            return body;
        };

        var addWalls = function()
        {
            var staticBody = space.staticBody;
            var height = 768;
            var walls = [ new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,height), 0),
                          new cp.SegmentShape(staticBody, cp.v(0,height), cp.v(1024,height), 0),
                          new cp.SegmentShape(staticBody, cp.v(1024,height), cp.v(1024,0), 0),
                          new cp.SegmentShape(staticBody, cp.v(1024,0), cp.v(0,0), 0)];
            for( var i=0; i < walls.length; i++)
            {
                var shape = walls[i];
                shape.setElasticity(1);
                shape.setFriction(1);
                space.addStaticShape(shape);
            }
        }

        space.gravity = cp.v(0, -this.GRAVITY);

        boxOffset = cp.v(0, 0);
        var staticBody  = space.staticBody;
        var walls       = addWalls();// create walls
        var Box        = addBox(cp.v(170, 130));// create Ship
    },
    touch2point:function(x, y) {
        return v(x / self.scale, y / self.scale);
    },
    onTouchesBegan:function (pTouch,pEvent){
        self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
        this.mouseBody.p = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
        if(!self.mouseJoint) {
            var point = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
            var shape = this.space.pointQueryFirst(point, GRABABLE_MASK_BIT, cp.NO_GROUP);
            if(shape){
                /*
                    This is where it crashes.
                */
                var body = shape.body;
                var mouseJoint = self.mouseJoint = new cp.PivotJoint(this.mouseBody, body, this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y));

                mouseJoint.maxForce = 50000;
                mouseJoint.errorBias = Math.pow(1 - 0.15, 60);
                this.space.addConstraint(mouseJoint);
            }
        }
    },
    onTouchesEnded:function (pTouch,e){
        self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
        if(self.mouseJoint) {
            this.space.removeConstraint(self.mouseJoint);
            self.mouseJoint = null;
        }
    },
    onTouchesMoved:function(pTouch,e){
        self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
        var newPoint = v.lerp(this.mouseBody.p, self.mouse, 0.25);
        this.mouseBody.v = v.mult(v.sub(newPoint, this.mouseBody.p), 60);
        this.mouseBody.p = newPoint;
    },
    setupDebugNode:function(boolValue) {
        // debug only
        //console.log("added debug")
        var debugNode = cc.PhysicsDebugNode.create( this.space );
        debugNode.setVisible( boolValue );
        this.addChild( debugNode );
    },
    update:function(dt){
        this.space.step(dt);  
    }
});


var ChipmunkBoxDemoScene = cc.Scene.extend({
    ctor:function(){
      this._super();
      cc.associateWithNative(this,cc.Scene);
    },
    onEnter:function () {
        this._super();
        
        var layer = new BoxDemo();
        layer.init();
        layer.BoxDemo();
        this.addChild(layer);

    }
});

//
//cc.Director.getInstance().runWithScene(new ChipmunkBoxDemoScene());
