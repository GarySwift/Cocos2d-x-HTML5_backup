

var sceneIdx = -1;

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;



var v = cp.v;

var _motor1 = null
var _motor2 = null;
var _ambyCar = null;
var _width

var INFINITY = 1e500;
var GRAVITY = 1000;
var MAXFORCE = 175000;
var keyStat = false;
var COLLISION_TYPE_CAR = 1;
var COLLISION_TYPE_WALL = 2;
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
        this.parallaxEffectNode.addBackground([s_SkyLoop,s_Sky], .2);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,20),s_BuildingBack]);
        this.parallaxEffectNode.addToHorizontalStack([cc.p(0,-10),s_BuildingFront]);
        this.parallaxEffectNode.addToHorizontalStack([s_Building1, s_Building2, cc.p(100,0),s_Building3,cc.p(250,0),s_Building2,s_Building1,cc.p(100,0),s_Building3,s_Building1], 7000);
        this.parallaxEffectNode.addTiledObject([s_Road],15);
        
        //this.trainBoogie = cc.Sprite.create(s_trainBoogie);
        //this.trainEngine = cc.Sprite.create(s_trainEngine);
        //this.trainEngine.setPosition(400,215);
        //this.trainBoogie.setPosition((this.trainEngine.getPositionX()+this.trainEngine.getContentSize().width-40),195);

        this.parallaxEffectNode2 = new ek.Parallax();
        //this.parallaxEffectNode2.addBackground([mountainsLoop,mountains], .2, false);
        //this.parallaxEffectNode2.addToHorizontalStack([s_trainBridge,s_trainBridge,s_trainBridge,s_trainBridge]);
        
        //this.addChild(this.parallaxEffectNode);
        //this.addChild(this.parallaxEffectNode2);
        //this.parallaxEffectNode.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        //this.parallaxEffectNode2.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));

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

    var space = this.space = new cp.Space();
    this.scale = 1;
    this.mouse = v(0,0);
    this.setupDebugNode();
    this.simulationTime = 0;
    this.drawTime = 0;
    this.setAnchorPoint(cc.p(0,0));

    var self = this;
    self.isTouchEnabled = true;

    var mouseBody = this.mouseBody = new cp.Body(Infinity, Infinity);
    console.log("cc.canvas "+cc.canvas);

   var canvas2point = this.canvas2point = function(x, y) {
        console.log(self.scale);
        return v(x / self.scale, 768 - y / self.scale);
    };

    this.point2canvas = function(point) {
            return v(point.x * self.scale, (768 - point.y) * self.scale);
    };

    cc.canvas.oncontextmenu = function(e) { return false; }

    cc.canvas.onmousedown = function(e) {
        e.preventDefault();
        var rightclick = e.which === 3; // or e.button === 2;
        self.mouse = canvas2point(e.pageX, e.pageY);
        //console.log("e.clientX ", e.clientX, "e.clientY ", e.clientY);
        //console.log("e.clientX ", e.pageX, "e.clientY ", e.pageY);
        console.log(e)
        if(!rightclick && !self.mouseJoint) {
            var point = canvas2point(e.pageX, e.pageY);
            console.log(point);
            
            var shape = space.pointQueryFirst(point, GRABABLE_MASK_BIT, cp.NO_GROUP);

            //console.log(shape, "    " ,point,"  ",GRABABLE_MASK_BIT,"  ",cp.NO_GROUP);

            if(shape){
                var body = shape.body;
                var mouseJoint = self.mouseJoint = new cp.PivotJoint(mouseBody, body, v(0,0), body.world2Local(point));

                mouseJoint.maxForce = 50000;
                mouseJoint.errorBias = Math.pow(1 - 0.15, 60);
                space.addConstraint(mouseJoint);
            }
        }

        if(rightclick) {
            self.rightClick = true;
        }
    };

    cc.canvas.onmouseup = function(e) {
        var rightclick = e.which === 3; // or e.button === 2;
        self.mouse = canvas2point(e.pageX, e.pageY);

        if(!rightclick) {
            if(self.mouseJoint) {
                space.removeConstraint(self.mouseJoint);
                self.mouseJoint = null;
            }
        }

        if(rightclick) {
            self.rightClick = false;
        }
    };

    cc.canvas.onmousemove = function(e) {
        self.mouse = canvas2point(e.pageX, e.pageY);
    };
};

var canvas = ChipmunkBaseLayer.prototype.canvas = document.getElementsByTagName('canvas')[0];
var ctx = ChipmunkBaseLayer.prototype.ctx = canvas.getContext('2d');

cc.inherits(ChipmunkBaseLayer, cc.LayerGradient );

ChipmunkBaseLayer.prototype.setupDebugNode = function()
{
    // debug only
    this._debugNode = cc.PhysicsDebugNode.create( this.space );
    this._debugNode.setVisible( true );
    //this._debugNode.setPosition(cc.p(319,0));
    this._debugNode.setAnchorPoint(cc.p(0,0));
    console.log(this.space);
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
    if(keyStat == false)
    {
        if(_motor1.rate>0)
            _motor1.rate -= 1;
        else 
        _motor1.rate = 0;
    }

   /* // Move mouse body toward the mouse
    var newPoint = v.lerp(this.mouseBody.p, this.mouse, 0.25);
    this.mouseBody.v = v.mult(v.sub(newPoint, this.mouseBody.p), 60);
    this.mouseBody.p = newPoint;*/
    //console.log("MAXFORCE "+_motor1.rate, " MAXFORCE ", MAXFORCE);
    //checkMotorForce();
};

function checkMotorForce(currentKeyPressed)
{
    console.log(currentKeyPressed)
    switch(currentKeyPressed)
    {
        case "left":
            console.log("i am here left");
            if(_motor1.rate>-85)
                _motor1.rate -= 1;
        break;
        case "right":
            console.log("i am here right");
            if(_motor1.rate<85)
                _motor1.rate += 1;
        break;
    }
    _motor1.maxForce = MAXFORCE;
    
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
        shape.setFriction( 2 );
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
        //shape.setCollisionType(COLLISION_TYPE_CAR);
        shape.group = 1; // use a group to keep the car parts from colliding

        return body;
    };


    var addBox = function(){
        var width = 50;
        var height = 60;
        var mass = width * height * 1/1000;
        var rock = space.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
        rock.setPos(v(500, 100));
        rock.setAngle(1);
        shape = space.addShape(new cp.BoxShape(rock, width, height));
        shape.setFriction(0.3);
        shape.setElasticity(0.3);        
    }


    var staticBody = space.staticBody;
    //var shape;

    // Walls
    
    var height = 768;
    var walls = [ new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,height), 0), //left
                  new cp.SegmentShape(staticBody, cp.v(0,height), cp.v(2000,height), 0), //top
                  new cp.SegmentShape(staticBody, cp.v(2000,0), cp.v(2000,height), 0), //right
                  new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(2000,0), 0)]; //bottom

    for( var i=0; i < walls.length; i++)
    {
        var shape = walls[i];
        shape.setElasticity(1);
        shape.setFriction(1);
        shape.setLayers(NOT_GRABABLE_MASK);
        //shape.setCollisionType(COLLISION_TYPE_WALL);
        space.addStaticShape(shape);
    }

 // Gravity
    space.gravity = cp.v(0, -GRAVITY);
    space.iterations = 50;
    //space.sleepTimeThreshold = 0.5;

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

    var carPosition = 1000;
    // Make a car with some nice soft suspension
    boxOffset = cp.v(0, 0);
    var wheel1 = addWheel(cp.v(carPosition-170, 30));//addWheel(posA);
    var wheel2 = addWheel(cp.v(carPosition+170, 30));
    var box = addBox();
    var chassis = addChassis(cp.v(carPosition, 100));
    var motor1 = new cp.SimpleMotor( chassis, wheel1, 0 );
    var motor2 = new cp.SimpleMotor( chassis , wheel1, -12 );

    //console.log("motor 2 ",motor2.rate)

    _motor1 = motor1;
    //_motorRear = motor2;

     space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-170, -100), cp.v(-170, -180), cp.v(0,0)));
     space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 170, -90), cp.v( 170, -180), cp.v(0,0)));

     space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-90, 0), cp.v(0,0), 180, 65, 10));
     space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v( 90, 0), cp.v(0,0), 180, 65, 10));


     var truckBody = cc.PhysicsSprite.create(s_carBody);
     //truckBody.setBody( chassis );
     //this.addChild( truckBody );

     var sprite = cc.PhysicsSprite.create(s_carTyre);
     //sprite.setBody( wheel1 );
     //this.addChild( sprite );

     var sprite2 = cc.PhysicsSprite.create(s_carTyre);
     //sprite2.setBody( wheel2 );
     //this.addChild( sprite2 );

     space.addConstraint(motor1);
     //space.addConstraint(motor2);
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
           keyStat = true;
           handleKey(e);
           console.log("keypressed ");
        }

    this.onKeyUp = function(e){
            keyStat = false;
        }
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
    _motor1.maxForce = MAXFORCE;
    //_motorRear.maxForce = 0;
    
    //var rect = cc.rect(0, 0, 1024, 768);
    //var followAction = cc.Follow.create(_ambyCar,rect);
    //this.runAction(followAction);


};

cc.inherits(ChipmunkTestScene, cc.Scene );




