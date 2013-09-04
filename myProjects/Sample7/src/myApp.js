

var sceneIdx = -1;

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;



var v = cp.v;

var _carMotor = null
var _ambyCar = null;
var _width

var INFINITY = 1e500;
var GRAVITY = 1000;
var MAXFORCE = 0;
var keyStat = false;
var COLLISION_TYPE_CAR = 1;
var COLLISION_TYPE_WALL = 2;
var previousKEY = null;
var startTime;
//var motor;



var MyApp = cc.LayerColor.extend(
{
    bgWidth:null,
    bgRatio:null,
    parallaxEffectNode:null,
    //parallaxEffectNode2:null,
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
        bgWidth = 1024;

        var size = cc.Director.getInstance().getWinSize();

        this.parallaxEffectNode = new ek.Parallax();
        this.parallaxEffectNode.addBackground([s_SkyLoop,s_Sky], .2);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,20),s_BuildingBack]);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,-10),s_BuildingFront]);
        this.parallaxEffectNode.addToHorizontalStack([s_Building1, s_Building2, cc.p(100,0),s_Building3,cc.p(250,0),s_Building2,s_Building1,cc.p(100,0),s_Building3,s_Building1], 7000);
        this.parallaxEffectNode.addTiledObject([s_Road],15);
        this.addChild(this.parallaxEffectNode);
        _width = this.parallaxEffectNode.bgLength;
        return this;
    },
    moveLeft:function(){
        this.parallaxEffectNode.loopParallaxLeft();
        //this.parallaxEffectNode2.loopParallaxRight();

        var goUp = cc.MoveBy.create(1, cc.p(0, 10));
        var seq = cc.Sequence.create(goUp,goUp.reverse());
        var trainAction = cc.RepeatForever.create(seq);
    },
    moveRight:function(){
        this.parallaxEffectNode.loopParallaxRight();
        //this.parallaxEffectNode2.loopParallaxRight();

        var goUp = cc.MoveBy.create(.1, cc.p(0, 5));
        var goDown = cc.MoveBy.create(.1, cc.p(0, -5));
        var seq = cc.Sequence.create(goUp,goUp.reverse());
        var seq2 = cc.Sequence.create(goDown,goDown.reverse());
        this.trainEngine.runAction(cc.RepeatForever.create(seq));
        this.trainBoogie.runAction(cc.RepeatForever.create(seq2));
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

    var space = this.space = new cp.Space();
    this.scale = 1;
    this.setupDebugNode();
    this.simulationTime = 0;
    this.drawTime = 0;

    var self = this;
    self.isTouchEnabled = true;
};

cc.inherits(ChipmunkBaseLayer, cc.LayerGradient );

ChipmunkBaseLayer.prototype.setupDebugNode = function()
{
    // debug only
    this._debugNode = cc.PhysicsDebugNode.create( this.space );
    this._debugNode.setVisible( true );
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
    return;
    this.space.step(dt);
    if(startTime && _carMotor.rate > 0) {
        var currentTime = (new Date()).valueOf();
        var timeDiff = (currentTime - startTime)/1000;
        console.log(timeDiff, currentTime, startTime);
        if(timeDiff > 0.25) {
            previousKEY = null;
            //var newRate = _carMotor.rate - (timeDiff * 0.15);
            var newRate = 0;
            if(newRate >= 0) {
                _carMotor.rate = newRate;
            } else {
                _carMotor.rate = 0;
            }

            console.log("newRate "+newRate);
        }
    }

        /*if(_carMotor.rate>0)
            _carMotor.rate -= 1;
        else 
        _carMotor.rate = 0;*/


        /*if(MAXFORCE>10000)
            MAXFORCE -= 10000;
        else 
        MAXFORCE = 0;

        _carMotor.maxForce = MAXFORCE;
        console.log("MAXFORCE "+MAXFORCE)*/
};

function checkMotorForce(currentKey)
{
    console.log(currentKey, " <> ",previousKEY)
    startTime = (new Date()).valueOf();
     if(currentKey != previousKEY){
        if(_carMotor.rate<60)
            _carMotor.rate += 3;
        previousKEY = currentKey;
    }

     /*if(MAXFORCE<175000)
        MAXFORCE += 20000;

    _carMotor.maxForce = MAXFORCE;

     console.log("MAXFORCE "+MAXFORCE)*/
}


function onCollisionBeginCar()
{

    console.log("on collision");

}

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
        var radius = 30;
        var mass = 3.5;
        var body = new cp.Body(mass, cp.momentForCircle(mass, 0, radius, cp.v(0,0)));
        body.setPos( pos );
        space.addBody( body );
        var shape = new cp.CircleShape( body, radius, cp.v(0,0));
        shape.setElasticity(0);
        shape.setFriction( 1 );
        space.addShape(shape);
        shape.group = 1; 
        return body;
        };

    var addChassis = function(pos)
    {
        var mass = 0.5;
        var width = 508;
        var height = 210;

        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
        body.setPos(pos);

        var shape = space.addShape(new cp.BoxShape(body, width, height));
        shape.setElasticity(0);
        shape.setFriction(0.3);
        shape.setCollisionType(COLLISION_TYPE_CAR);
        shape.group = 1; // use a group to keep the car parts from colliding

        return body;
    };

    var staticBody = space.staticBody
    var height = 768;
    var walls = [ new cp.SegmentShape(staticBody, cp.v(1024,0), cp.v(1024,height), 0),
                  new cp.SegmentShape(staticBody, cp.v(1024,height), cp.v(-_width,height), 0),
                  new cp.SegmentShape(staticBody, cp.v(-_width,height), cp.v(-_width,0), 0),
                  new cp.SegmentShape(staticBody, cp.v(-_width,0), cp.v(1024,0), 0)];
    for( var i=0; i < walls.length; i++)
    {
        var shape = walls[i];
        shape.setElasticity(5);
        shape.setFriction(10);
        space.addStaticShape(shape);
    }

    space.gravity = cp.v(0, -GRAVITY);
    space.iterations = 50;
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

    var carPosition = -_width+300;
    // Make a car with some nice soft suspension
    boxOffset = cp.v(0, 0);
    var wheel1 = addWheel(cp.v(carPosition-170, 30));
    var wheel2 = addWheel(cp.v(carPosition+170, 30));
    var chassis = addChassis(cp.v(carPosition, 200));
    var carMotor = new cp.SimpleMotor( chassis, wheel1, 60 );
    var differential = new cp.SimpleMotor( wheel1, wheel2, 0 );
    differential.maxForce = 87500;

    _carMotor = carMotor;

   console.log(" _carMotor.biasCoef ", _carMotor.biasCoef);
     space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-170, -100), cp.v(-170, -180), cp.v(0,0)));
     space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 170, -90), cp.v( 170, -180), cp.v(0,0)));

     space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-90, 0), cp.v(0,0), 190, 125, 20));
     space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v( 90, 0), cp.v(0,0), 190, 125, 20));

     var truckBody = cc.PhysicsSprite.create(s_carBody);
     truckBody.setBody( chassis );
     this.addChild( truckBody );

     var sprite = cc.PhysicsSprite.create(s_carTyre);
     sprite.setBody( wheel1 );
     this.addChild( sprite );

     var sprite2 = cc.PhysicsSprite.create(s_carTyre);
     sprite2.setBody( wheel2 );
     this.addChild( sprite2 );

     space.addConstraint(carMotor);
     space.addConstraint(differential);

     _ambyCar = truckBody;


     this.setKeyboardEnabled(true);

    var handleKey = function(e)
    {
        if(e === cc.KEY.left)
        {
             checkMotorForce("left");
        }
        else if(e === cc.KEY.right)
        {
             checkMotorForce("right");
        }
    }

    this.onKeyDown = function(e){
       if(!keyStat) handleKey(e);
        keyStat = true;
        _carMotor.maxForce = 175000;
       console.log(" keypressed ");
    }

    this.onKeyUp = function(e){
        _carMotor.maxForce = 0;
        keyStat = false;
    }
};


cc.inherits( Joints, ChipmunkDemo );

//
// Entry point
//
var parallax;
var ChipmunkTestScene = function() {
    sceneIdx = -1;

    var layer = new MyApp();
    layer.init();
    this.addChild(layer);
    parallax = layer;

    var layer = new Joints();
    this.addChild(layer);
    director.replaceScene(this);
    _carMotor.maxForce = MAXFORCE;
    //_motorRear.maxForce = 0;

    console.log("_ambyCar "+_ambyCar.getPosition().x);
    
    var rect = cc.rect(-_width, 0, _width+1024, 768);
    //var followAction = cc.Follow.create(_ambyCar,rect);
    //this.runAction(followAction);

};

cc.inherits(ChipmunkTestScene, cc.Scene );




