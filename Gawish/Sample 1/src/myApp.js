var chipmunkTestSceneIdx = -1;
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var v = cp.v;


var myLayer = cc.Layer.extend({
    
    GRAVITY:1000,
    space:null,
    ctor:function(){
      this._super();
      cc.associateWithNative(this,cc.Layer);
      this.init();
    },
    init:function () {

        this._super();

        stageSize  = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

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
        
        mouseJoint = null;
        mouseBody = new cp.Body(Infinity, Infinity);
        return true;
    },
    makeStuff:function()
    {
        mass = 100;
        var space= this.space;
        var staticBody = space.staticBody;

        var addCircle = function(radius,pos){
            var body  = space.addBody(new cp.Body(mass,cp.momentForCircle( mass,0,radius,cp.v(0,0) )) );
            body.setPos(pos);
            var shape = space.addShape(new cp.CircleShape(body,radius,cp.v(0,0)));
            shape.setElasticity(.5);
            shape.setFriction(0.2);
            //Shapes in same group wont collide
            //shape.group=1;
            return body;

        }
        var addBox = function(width,height,pos){
            var body =  space.addBody(new cp.Body(mass,cp.momentForBox(mass,height,width)));
            body.setPos(pos);
            var shape = space.addShape(new cp.BoxShape(body,width,height));
            shape.setElasticity(0.8);
            shape.setFriction(0.8);

            return body;
        }
        var buildWalls = function(){

            
            var walls = [   
                    //simple walls
                    new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(stageSize.width,0), 0),
                    new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,stageSize.height), 0),
                    new cp.SegmentShape(staticBody, cp.v(stageSize.width,0), cp.v(stageSize.width,stageSize.height), 0),
                    //landscape
                    new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(200,200), 0 ),
                    new cp.SegmentShape(staticBody, cp.v(200,200), cp.v(stageSize.width ,0), 0)  
                          ];
            
            for(var i=0;i<walls.length;i++){

                var shape = walls[i];
                shape.setElasticity(1);
                shape.setFriction(1);
                space.addShape(shape);
            }
            

        }
        
        
        c1 = addCircle(20,cp.v(100,400));
        c2 = addCircle(20,cp.v(200,400));
        c3 = addCircle(20,cp.v(300,400));
        c4 = addBox(20,20,cp.v(400,400))
        joint1 = new cp.PivotJoint(c1,c2,c1.p);
        space.addConstraint(joint1);

        joint2 = new cp.PivotJoint(c2,c3,c2.p);
        space.addConstraint(joint2);
        
        joint3 = new cp.PivotJoint(c3,c4,c3.p);
        space.addConstraint(joint3);

        buildWalls();


    },
    touch2point:function(x, y) {
        return cp.v(x , y);
    },
   
    onTouchesBegan:function (t,e){
        var mouseTouch = this.touch2point(t[0].getLocation().x , t[0].getLocation().y);
        mouseBody.p = mouseTouch;
        if(!mouseJoint){
            var hitShape = this.space.pointQueryFirst(mouseTouch, GRABABLE_MASK_BIT,cp.NO_GROUP);
            var hitBody = hitShape.getBody();
        
            if(hitBody){
                
                mouseJoint = new cp.PivotJoint(hitBody,mouseBody,mouseTouch);
                this.space.addConstraint(mouseJoint);
                
            }
            
            console.log('down');
        }
        
    },
    onTouchesEnded:function (pTouch,e){
        if(mouseJoint){
             this.space.removeConstraint(mouseJoint);
             mouseJoint=null;
        }
        console.log('up');
    },
    onTouchesMoved:function(pTouch,e){
        var mouseTouch  = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
       // var newPoint = v.lerp(mouseBody.p, mouseTouch , 0.25);
        //mouseBody.v = v.mult(v.sub(newPoint, mouseBody.p), 60);
        //mouseBody.p = newPoint;
        mouseBody.p=mouseTouch;

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




var myScene = cc.Scene.extend({
    ctor:function(){
      this._super();
      cc.associateWithNative(this,cc.Scene);
    },
    onEnter:function () {
        this._super();
        
        var layer = new myLayer();
        layer.makeStuff();
        this.addChild(layer);

    }
});
