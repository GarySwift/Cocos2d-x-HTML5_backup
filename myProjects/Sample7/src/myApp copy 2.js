

var sceneIdx = -1;

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
/*
var v = cp.v;*/

var _motor = null
var _motorRear = null;
var _monsterTruck = null;
var _width
INFINITY = 1e100;

//var motor;


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

        console.log("i am in my app  ---- ");

        bgRatio = 0.2;
        bgWidth = 1024;

        var size = cc.Director.getInstance().getWinSize();

        this.parallaxEffectNode = new ek.Parallax();
        this.parallaxEffectNode.addBackground([mountainsLoop,mountains], .2);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,-60),s_trainHill2], 4000);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,130),s_trainHill1], 10000);
        this.parallaxEffectNode.addToHorizontalStack([s_trainBridge]);
        this.trainBoogie = cc.Sprite.create(s_trainBoogie);
        this.trainEngine = cc.Sprite.create(s_trainEngine);
        this.trainEngine.setPosition(400,215);
        this.trainBoogie.setPosition((this.trainEngine.getPositionX()+this.trainEngine.getContentSize().width-40),195);

        this.parallaxEffectNode2 = new ek.Parallax();
        this.parallaxEffectNode2.addBackground([mountainsLoop,mountains], .2, false);
        this.parallaxEffectNode2.addToHorizontalStack([s_trainBridge,s_trainBridge,s_trainBridge,s_trainBridge]);
        
        this.addChild(this.parallaxEffectNode);
        this.addChild(this.parallaxEffectNode2);
        this.parallaxEffectNode.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        this.parallaxEffectNode2.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));

        _width = this.parallaxEffectNode.bgLength;
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


var ChipmunkBaseLayer = function() {

    //
    // VERY IMPORTANT
    //
    // Only subclasses of a native classes MUST call cc.associateWithNative
    // Failure to do so, it will crash.
    //
    var parent = cc.base(this);
    cc.associateWithNative( this, parent );
    //this.init( cc.c4b(0,0,0,255),cc.c4b(0,0,0,255));

    var space = this.space = new cp.Space();
    this.scale = 1;
    this.mouse = cp.v(0,0);
    this.setupDebugNode();

    // batch node
    this.batch = cc.SpriteBatchNode.create(s_trainEngine, 50 );
    this.addChild( this.batch );

    /*this.addSprite = function( pos ) {
        var sprite =  this.createPhysicsSprite( pos );
        this.batch.addChild( sprite );
    };

    this.addSprite( cp.v(1400/2, 600/2));*/

};

cc.inherits(ChipmunkBaseLayer, cc.LayerGradient );

ChipmunkBaseLayer.prototype.setupDebugNode = function()
{
    // debug only
    this._debugNode = cc.PhysicsDebugNode.create( this.space );
    this._debugNode.setVisible( false );
    this.addChild( this._debugNode );
};



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


/*// init physics
ChipmunkDemo.prototype.initPhysics = function() {
    var space = this.space ;
    var staticBody = space.staticBody;

    // Walls
    var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(1400,0), 0 ),  // bottom
            new cp.SegmentShape( staticBody, cp.v(0,768), cp.v(1400,768), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,768), 0),             // left
            new cp.SegmentShape( staticBody, cp.v(1400,0), cp.v(1400,768), 0)  // right
            ];
    for( var i=0; i < walls.length; i++ ) {
        var shape = walls[i];
        shape.setElasticity(1);
        shape.setFriction(1);
        space.addStaticShape( shape );
    }

    // Gravity
    space.gravity = cp.v(0, 1200);
    space.iterations = 40;
    space.gravity = v(0, -300);
    space.sleepTimeThreshold = 0.5;
};
*/
ChipmunkDemo.prototype.createPhysicsSprite = function( pos ) {
    var body = new cp.Body(10, cp.momentForCircle(10, 0, 107, v(0,0)));
    body.setPos( pos );
    this.space.addBody( body );
    var shape = new cp.CircleShape( body, 107, v(0,0));
    shape.setElasticity( 0.5 );
    shape.setFriction( 1 );
    this.space.addShape( shape );

    var sprite = cc.PhysicsSprite.create(s_TruckWheel);
    sprite.setBody( body );
    return sprite;
};

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
        var radius = 59.5;
        var mass = 90;
        var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0)));
        body.setPos( pos );
        space.addBody( body );
        var shape = new cp.CircleShape( body, radius, cp.v(0,0));
        shape.setElasticity( 0.7 );
        shape.setFriction( 0.5 );
        space.addShape( shape );
        shape.group = 1; 
        return body;
        };

    var addChassis = function(pos)
    {
        var mass = 25;
        var width = 340;
        var height = 80;

        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
        body.setPos(cp.v.add(pos, boxOffset));

        var shape = space.addShape(new cp.BoxShape(body, width, height));
        shape.setElasticity(0.2);
        shape.setFriction(0.7);
        shape.group = 1; // use a group to keep the car parts from colliding

        return body;
    };


    this.setKeyboardEnabled(true);

    var handleKey = function(e)
    {
        if(e === cc.KEY.left)
        {
            console.log("right ");
            //console.log("motor 2 ",motor2.rate)_motor.maxForce
            if(_motor.rate > 0)
                _motor.rate = _motor.rate * -1;
            console.log("_motorRear right "+_motorRear.rate)
            _motor.maxForce = INFINITY;
            _motorRear.maxForce = 100000;
            //_motorRear.maxForce = 100;
        }
        else if(e === cc.KEY.right)
        {
             if(_motor.rate < 0)
                _motor.rate = Math.abs(_motor.rate);
             console.log("_motorRear left "+_motorRear.rate)
             _motor.maxForce = INFINITY;
             _motorRear.maxForce = 100000;
             //console.log("motor 2 ",motor2.rate)_motor.maxForce
           /* _motor.maxForce = 10;
            _motorRear.maxForce = 100;*/
        }
    }

    this.onKeyDown = function(e){
            console.log("hello ---- ");
            handleKey(e);
        }

    this.onKeyUp = function(e){
            console.log("key up ---- ");
            _motor.maxForce = 0;
        }    


    var staticBody = space.staticBody;
    //var shape;

    // Walls
    
    var height = 768;
    var walls = [ new cp.SegmentShape(staticBody, cp.v(1024,0), cp.v(1024,height), 0),
                  new cp.SegmentShape(staticBody, cp.v(1024,height), cp.v(-_width,height), 0),
                  new cp.SegmentShape(staticBody, cp.v(-_width,height), cp.v(-_width,0), 0),
                  new cp.SegmentShape(staticBody, cp.v(-_width,0), cp.v(1024,0), 0)];

    for( var i=0; i < walls.length; i++)
    {
        var shape = walls[i];
        shape.setElasticity(1);
        shape.setFriction(10);
        space.addStaticShape( shape );
    }

 // Gravity
    space.gravity = cp.v(0, -900);
    space.iterations = 100;
    space.sleepTimeThreshold = 0.5;

    shape.layers = NOT_GRABABLE_MASK;

    var body1, body2;

    var posA = cp.v(200, 300);
    var posB = cp.v(350, 300);

    var POS_A = function() { return cp.v.add(boxOffset, posA); };
    var POS_B = function() { return cp.v.add(boxOffset, posB); };

    this.labels = labels = [];
    var label = function(text) {
        labels.push({text:text, pos:boxOffset});
    };

    // Make a car with some nice soft suspension
    boxOffset = cp.v(200, 100);
    var wheel1 = addWheel(posA);//addWheel(posA);
    var wheel2 = addWheel(posB);
    var chassis = addChassis(cp.v(200, 300));
    var motor1 = new cp.SimpleMotor( chassis, wheel2, -12 );
    var motor2 = new cp.SimpleMotor( chassis , wheel2, 5000 );

    console.log("motor 2 ",motor2.rate)

    _motor = motor1;
    _motorRear = motor2;

    space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-170, -10), cp.v(-170, -90), cp.v(0,0)));
    space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 140, -10), cp.v( 140, -90), cp.v(0,0)));

    space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-90, 0), cp.v(0,0), 280, 340, 310));
    space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v( 90, 0), cp.v(0,0), 350, 340, 310));


     var truckBody = cc.PhysicsSprite.create(s_Truck);
     truckBody.setBody( chassis );
     this.batch.addChild( truckBody );

     var sprite = cc.PhysicsSprite.create(s_TruckWheel);
     sprite.setBody( wheel1 );
     this.batch.addChild( sprite );

     var sprite2 = cc.PhysicsSprite.create(s_TruckWheel);
     sprite2.setBody( wheel2 );
     this.batch.addChild( sprite2 );

     // The main motor that drives the buggy.
     //_motor = motor;
     space.addConstraint(motor1);
     space.addConstraint(motor2);
     //console.log("motor.maxForce  --- "+motor1.maxForce);
     //motor1.maxForce = 20000;
     _monsterTruck = truckBody;
    //console.log("already here "+motor.maxForce); 
};

cc.inherits( Joints, ChipmunkDemo );

//
// Entry point
//

var ChipmunkTestScene = function() {
    sceneIdx = -1;

    var layer = new MyApp();
    layer.init();
    this.addChild(layer);

    var layer = new Joints();
    this.addChild(layer);
    director.replaceScene(this);
    console.log("motor.maxForce  --- "+_motorRear.maxForce);
    _motor.maxForce = 0;
    _motorRear.maxForce = 0;

    
    console.log(-(_width+200),"  ",(_width+1733));
    var rect = cc.rect(-_width, 0, _width+1024, 768);
    var followAction = cc.Follow.create(_monsterTruck,rect);
    this.runAction(followAction);

};

cc.inherits(ChipmunkTestScene, cc.Scene );




