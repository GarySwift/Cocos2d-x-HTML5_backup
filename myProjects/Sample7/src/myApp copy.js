 /*
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * Chipmunk Demo code:
 *    Original Demo code written in C by Scott Lembcke
 *    Ported to JavaScript by Joseph Gentle
 *    Additions to the demo code by Ricardo Quesada
 */

//
// JavaScript + chipmunk tests
//

var sceneIdx = -1;

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

//------------------------------------------------------------------
//
// ChipmunkBaseLayer
//
//------------------------------------------------------------------
var ChipmunkBaseLayer = function() {

    //
    // VERY IMPORTANT
    //
    // Only subclasses of a native classes MUST call cc.associateWithNative
    // Failure to do so, it will crash.
    //
    var parent = cc.base(this);
    cc.associateWithNative( this, parent );
    this.init( cc.c4b(0,0,0,255), cc.c4b(98*0.5,99*0.5,117*0.5,255) );

    var space = this.space = new cp.Space();
    this.scale = 1;
    this.mouse = v(0,0);
    this.setupDebugNode();



    //cc.base(this);
    console.log("s_pathGrossini ",s_trainEngine);
    // batch node
    this.batch = cc.SpriteBatchNode.create(s_trainEngine, 50 );
    this.addChild( this.batch );

    this.addSprite = function( pos ) {
        var sprite =  this.createPhysicsSprite( pos );
        this.batch.addChild( sprite );
    };

    this.addSprite( cp.v(1024/2, 600/2));

    //this.title = 'Chipmunk SpriteBatch Test';
    //this.subtitle = 'Chipmunk + cocos2d sprite batch tests. Tap screen.';
};

cc.inherits(ChipmunkBaseLayer, cc.LayerGradient );

ChipmunkBaseLayer.prototype.setupDebugNode = function()
{
    // debug only
    this._debugNode = cc.PhysicsDebugNode.create( this.space );
    this._debugNode.setVisible( false );
    this.addChild( this._debugNode );
};


var v = cp.v;
var ctx;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

var ChipmunkDemo = function() {
    cc.base(this);
    this.remainder = 0;
    this._debugNode.setVisible( true );
    this.scheduleUpdate();
};
cc.inherits( ChipmunkDemo, ChipmunkBaseLayer );

ChipmunkDemo.prototype.update = function(dt) {
    this.space.step(dt);
};




//------------------------------------------------------------------
//
// Chipmunk + Sprite + Batch
//
//------------------------------------------------------------------


// init physics
ChipmunkDemo.prototype.initPhysics = function() {
    var space = this.space ;
    var staticBody = space.staticBody;

    // Walls
    var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(1024,0), 0 ),  // bottom
            new cp.SegmentShape( staticBody, cp.v(0,768), cp.v(1024,768), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,768), 0),             // left
            new cp.SegmentShape( staticBody, cp.v(1024,0), cp.v(1024,768), 0)  // right
            ];
    for( var i=0; i < walls.length; i++ ) {
        var shape = walls[i];
        shape.setElasticity(1);
        shape.setFriction(1);
        space.addStaticShape( shape );
    }

    // Gravity
    space.gravity = cp.v(0, -100);
};

ChipmunkDemo.prototype.createPhysicsSprite = function( pos ) {
    var body = new cp.Body(50, cp.momentForBox(1, 366, 190) );
    body.setPos( pos );
    this.space.addBody( body );
    var shape = new cp.BoxShape( body, 366, 160);
    shape.setElasticity( 0.5 );
    shape.setFriction( 0.5 );
    this.space.addShape( shape );

    var sprite = cc.PhysicsSprite.create(s_trainEngine);
    sprite.setBody( body );
    return sprite;
};

/*ChipmunkDemo.prototype.onEnter = function () {

    cc.base(this, 'onEnter');

    this.scheduleUpdate();
    for(var i=0; i<10; i++) {
        this.addSprite( cp.v(1024/2, 768/2));
    }

    if( 'touches' in sys.capabilities )
        this.setTouchEnabled(true);
    else if( 'mouse' in sys.capabilities )
        this.setMouseEnabled(true);
};*/

ChipmunkDemo.prototype.update = function( delta ) {
    this.space.step( delta );
};

ChipmunkDemo.prototype.onMouseDown = function( event ) {
    console.log("i am in ")
    this.addSprite( event.getLocation() );
};

ChipmunkDemo.prototype.onTouchesEnded = function( touches, event ) {
    var l = touches.length;
    for( var i=0; i < l; i++) {
        this.addSprite( touches[i].getLocation() );
    }
};


//------------------------------------------------------------------
//
// Chipmunk + Sprite + Batch
//
//------------------------------------------------------------------
var ChipmunkSpriteBatchTest = function() {

    cc.base(this);
    console.log("s_pathGrossini ",s_pathGrossini);
    // batch node
    this.batch = cc.SpriteBatchNode.create(s_pathGrossini, 50 );
    this.addChild( this.batch );

    this.addSprite = function( pos ) {
        var sprite =  this.createPhysicsSprite( pos );
        this.batch.addChild( sprite );
    };

    this.title = 'Chipmunk SpriteBatch Test';
    this.subtitle = 'Chipmunk + cocos2d sprite batch tests. Tap screen.';
};
//------------------------------------------------------------------
//
// Chipmunk + Sprite + Batch
//
//------------------------------------------------------------------


//------------------------------------------------------------------
//
// Chipmunk Demo: Joints
//
//------------------------------------------------------------------

var Joints = function() {
    cc.base(this);
    this.title = 'Chipmunk Demo';
    this.subtitle = 'Joints';

    var space = this.space;
    var boxOffset;

    var addWheel = function(pos)
    {
        //s_TruckWheel
        var radius = 15;
        var mass = 10;
        var body = space.addBody(new cp.Body(mass, cp.momentForCircle(mass, 0, radius, v(0,0))));
        body.setPos(cp.v.add(pos, boxOffset));

        var shape = space.addShape(new cp.CircleShape(body, radius, v(0,0)));
        shape.setElasticity(0);
        shape.setFriction(0.7);
        shape.group = 1; // use a group to keep the car parts from colliding

        return body;
    };

    var addChassis = function(pos)
    {
        var mass = 1;
        var width = 140;
        var height = 80;

        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
        body.setPos(cp.v.add(pos, boxOffset));

        var shape = space.addShape(new cp.BoxShape(body, width, height));
        shape.setElasticity(0);
        shape.setFriction(0.7);
        shape.group = 1; // use a group to keep the car parts from colliding

        return body;
    };

    space.iterations = 40;
    space.gravity = v(0, -300);
    space.sleepTimeThreshold = 0.5;

    var staticBody = space.staticBody;
    //var shape;

    // Walls
    var walls = [ new cp.SegmentShape(staticBody, v(0,150), v(512,120), 0),
                  new cp.SegmentShape(staticBody, v(512,120), v(1024,160), 0)];

    for( var i=0; i < walls.length; i++)
    {
        var shape = walls[i];
        shape.setElasticity(1);
        shape.setFriction(1);
        space.addStaticShape( shape );
    }

    shape.layers = NOT_GRABABLE_MASK;

    var body1, body2;

    var posA = v( 50, 60);
    var posB = v(110, 60);

    var POS_A = function() { return cp.v.add(boxOffset, posA); };
    var POS_B = function() { return cp.v.add(boxOffset, posB); };

    this.labels = labels = [];
    var label = function(text) {
        labels.push({text:text, pos:boxOffset});
    };

    // Make a car with some nice soft suspension
    boxOffset = v(20, 140);
    var wheel1 = addWheel(posA);
    var wheel2 = addWheel(posB);
    var chassis = addChassis(v(80, 100));

    space.addConstraint(new cp.GrooveJoint(chassis, wheel1, v(-30, -10), v(-30, -130), v(0,0)));
    space.addConstraint(new cp.GrooveJoint(chassis, wheel2, v( 30, -10), v( 30, -130), v(0,0)));

    space.addConstraint(new cp.DampedSpring(chassis, wheel1, v(-30, 0), v(0,0), 130, 150, 10));
    space.addConstraint(new cp.DampedSpring(chassis, wheel2, v( 30, 0), v(0,0), 130, 150, 10));
};

cc.inherits( Joints, ChipmunkDemo );

//
// Entry point
//

var ChipmunkTestScene = function() {
    sceneIdx = -1;
    var layer = new Joints();
    this.addChild(layer);
    director.replaceScene(this);
};

cc.inherits(ChipmunkTestScene, cc.Scene );




