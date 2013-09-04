if(ek.app.collectionScenes[ek.app.currentCollectionId]) {
	var sceneIndex = ek.app.collectionScenes[ek.app.currentCollectionId].findIndex(function(item){
		return item.Id == ek.app.currentSceneId;
	});
	if(sceneIndex == 0 && ek.get('button-left')) {
		ek.get('button-left').hide();
	}
}

if(!cc.AudioEngine.getInstance().isMusicPlaying()) {
	ek.get('button-sound').setSelectedIndex(1);
}

ek.layer.resetInactivityTimer();

//ek.CocosPhysicsSprite = cc.PhysicsSprite.extend(ek.CocosSprite.prototype);

function updateWordsPos(){
	if(ek.app.primaryLanguage == 'hi'){
		ek.get('word-primary').setPosition(cc.p(770,410));
		ek.get('word-secondary').setPosition(cc.p(815,320));
		ek.get('word-phonetic').setPosition(cc.p(870,520));
	} else{
		ek.get('word-primary').setPosition(cc.p(770,410));
		ek.get('word-secondary').setPosition(cc.p(835,335));
		ek.get('word-phonetic').setPosition(cc.p(900,470));
	}
}


//Scene selector action
(function() {
	var button = ek.get('button-scene-selector');
	function getSceneSelectorButtonAnimation() {		
		return cc.Sequence.create(
			cc.Spawn.create(
				cc.ScaleTo.create(0.3,1.5),
				cc.RotateTo.create(0.5,180)
			),
			cc.CallFunc.create(ek.app.showSceneSelector, ek.app),
			cc.Spawn.create(
				cc.ScaleTo.create(0.2,1),
				cc.RotateTo.create(0.2,0)
			)
		);
	}
	button.on('TouchesBegan', function(){
		button.stopAllActions();
		button.runAction(getSceneSelectorButtonAnimation());
	}, button);
	button.on('TouchesEnded', function(){
		button.stopAllActions();
		button.runAction(cc.Spawn.create(
			cc.ScaleTo.create(0.2,1),
			cc.RotateTo.create(0.2,0)
		));
	}, button);
})();



var animTime = 0.15;

function getPulseSequence() {
    return cc.Sequence.create(
    cc.ScaleTo.create(animTime, 1.35, 1.35),
    cc.ScaleTo.create(animTime, .75, .75),
    cc.ScaleTo.create(animTime, 1.15, 1.15),
    cc.ScaleTo.create(animTime, .85, .85),
    cc.ScaleTo.create(animTime, 1, 1));
}


function pulseAnim(e){
	if(e){
		e.stopPropagation();
	}
	if(!this._pulse || !this._pulse.exists() || this._pulse.isDone()) {
		this._pulse = cc.EaseSineInOut.create(getPulseSequence());
	} else {
		return; 
	}
	this.runAction(this._pulse); 
	if(this.props.Localization == 'Secondary') {
		ek.get('sound-vo-secondary').playRandom();
	} else if(this.props.Localization == 'Primary' || this.props.Localization == 'Phonetic') {
		ek.get('sound-vo-primary').playRandom();
	} 	
}

// Try and keep all the names standard for the buttons so that it is easy to copy and paste
ek.get('word-primary').on('TouchesBegan',pulseAnim); 
ek.get('word-secondary').on('TouchesBegan',pulseAnim);
ek.get('word-phonetic').on('TouchesBegan',pulseAnim);
ek.get('button-left').on('TouchesBegan', pulseAnim);
ek.get('button-right').on('TouchesBegan', pulseAnim);
//

function speakWordPrimary(){
	pulseAnim.call(ek.get('word-primary'));
}
function speakWordSecondary(){
	pulseAnim.call(ek.get('word-secondary'));
}

// END


var s_body = ek.app.getFolder(ek.get('image-monkey-body').props.ImageFilename);
var s_handleft = ek.app.getFolder(ek.get('image-hand-left').props.ImageFilename);
var s_handRight = ek.app.getFolder(ek.get('image-hand-right').props.ImageFilename);
var s_head = ek.get('sprite-monkey-head');
var s_tailCoilBranch = ek.get('image-tail-coil-branch');

var monkeyBody = null;
var monkeyBodyConnector = null;
var monkeyHeadAnimation = null;
var headTexture = null;

var chipmunkTestSceneIdx = -1;
var GRABABLE_MASK_BIT = 2147483648;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var v = cp.v;



(function() {
    var Joints = cc.Layer.extend({
        circle: null,
        GRAVITY: 2500,
        space: null,
        self: null,
        size: null,
        ctor: function() {
            this._super();
            cc.associateWithNative(this, cc.Layer);
        },
        init: function() {
            var selfPointer = this;
            this._super();
            //this.scheduleUpdate();

            size = cc.Director.getInstance().getWinSize();
            this.scale = 1;
            this.space = new cp.Space();
            this.space.gravity = cp.v(0, -this.GRAVITY);
            this.space.iterations = 150;
            //this.space.sleepTimeThreshold = 0.5;
            //this.space.collisionSlop = 0.5;

            this.mouse = v(0, 0);
            this.setupDebugNode(false);
            this.simulationTime = 0;
            this.drawTime = 0;

            self = this;
            this.setTouchEnabled(true);
            var mouseBody = this.mouseBody = new cp.Body(Infinity, Infinity);
            return true;
        },
		onEnter: function(){
			this._super();
			this.scheduleUpdate();
		},
        Joints: function() {
            this.title = 'Chipmunk Demo';
            this.subtitle = 'Joints';
            

            var spaceVar = this.space;
            var boxOffset;

            var addMonkeyBody = function(pos) {

                var mass = .1;
                var NUM_VERTS = 3;

                var body = spaceVar.addBody(new cp.Body(mass, cp.momentForPoly(mass, verts, v(0, 0))));
                body.setPos(v(350, 220));

                var shape = spaceVar.addShape(new cp.PolyShape(body, verts, v(0, 0)));
                shape.setElasticity(0);
                shape.setFriction(0);
                shape.group = 1;
                return body;
            };

            var addMonkeyLimbs = function(pos) {
                var width = 96;
                var height = 282;
                var mass = .1;

                var body = spaceVar.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
                body.setPos(pos);

                var shape = spaceVar.addShape(new cp.BoxShape(body, width, height));
                shape.setElasticity(0);
                shape.setFriction(0);
                shape.group = 1;
                return body;

            }

            var addMonkeyHead = function(pos) {
                var width = 200;
                var height = 200;
                var mass = .1;

                var body = spaceVar.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
                body.setPos(pos);

                var shape = spaceVar.addShape(new cp.BoxShape(body, width, height));
                shape.id = 'sprite-monkey-head';
                shape.setElasticity(0);
                shape.setFriction(0);
                shape.group = 1;
                return body;
            };


            var createMonkey = function(pos) {
                var boxOffset = v(365, 570);
                var posA = v(0, 150);
                var width = ek.get('image-monkey-body').getContentSize().width+30;
                var height = ek.get('image-monkey-body').getContentSize().height;
                var mass = .5;
                var NUM_VERTS = 3;

                var POS_A = function() {
                    return v.add(boxOffset, posA);
                };
				
				
				
                monkeyBody = spaceVar.addBody(new cp.Body(mass, cp.momentForBox(mass, width, height)));
                monkeyBody.setPos(v(365, 575));

				
                var shape = spaceVar.addShape(new cp.BoxShape(monkeyBody, width, height));
                shape.setElasticity(0);
                shape.setFriction(0);
                shape.group = 1; // use a group to keep the car parts from colliding

                spaceVar.addConstraint(new cp.PivotJoint(monkeyBody, staticBody, POS_A()));
                spaceVar.addConstraint(new cp.RotaryLimitJoint(monkeyBody, staticBody, -1., .7));
				
				//spaceVar.addConstraint(new cp.GrooveJoint(monkeyBodyConnector, monkeyBody, cp.v(0, -80), cp.v(0, 15), cp.v(-30, 190)));
                //spaceVar.addConstraint(new cp.DampedSpring(monkeyBodyConnector, monkeyBody, cp.v(0, -15), cp.v(-30, 190), 0, 150, 2));
				
				
                var bodyTexture = cc.PhysicsSprite.create(s_body);
                bodyTexture.setBody(monkeyBody);
                self.addChild(bodyTexture);

                var monkeyLimbLeft = addMonkeyLimbs(cp.v(512, 300));
                var limbTexture = cc.PhysicsSprite.create(s_handleft);
                limbTexture.setBody(monkeyLimbLeft);
                self.addChild(limbTexture);

                var anchorPoint = cp.v(320, 440);
                monkeyLimbLeft.p = v.add(anchorPoint, cp.v(0, -160));

                spaceVar.addConstraint(new cp.PivotJoint(monkeyBody, monkeyLimbLeft, anchorPoint));
                spaceVar.addConstraint(new cp.RotaryLimitJoint(monkeyBody, monkeyLimbLeft, -1.8, .7));

                var monkeyLimbRight = addMonkeyLimbs(cp.v(712, 300));
                var limbTexture = cc.PhysicsSprite.create(s_handRight);
                limbTexture.setBody(monkeyLimbRight);
                limbTexture.setScaleX(-1);
                self.addChild(limbTexture);

                var anchorPoint = cp.v(370, 440);
                monkeyLimbRight.p = v.add(anchorPoint, cp.v(0, -160));

                spaceVar.addConstraint(new cp.PivotJoint(monkeyBody, monkeyLimbRight, anchorPoint));
                spaceVar.addConstraint(new cp.RotaryLimitJoint(monkeyBody, monkeyLimbRight, -.9, 1.5));

                var monkeyHead = addMonkeyHead(cp.v(512, 500));
                spaceVar.addConstraint(new cp.GrooveJoint(monkeyBody, monkeyHead, cp.v(-20, -100), cp.v(-20, -240), cp.v(0, 0)));
                spaceVar.addConstraint(new cp.DampedSpring(monkeyBody, monkeyHead, cp.v(-20, -120), cp.v(0, 50), 25, 50, 1));
                spaceVar.addConstraint(new cp.DampedRotarySpring(monkeyBody, monkeyHead, 0, 10000, 180));
                spaceVar.addConstraint(new cp.RotaryLimitJoint(monkeyBody, monkeyHead, -1.2, 1.2));

                headTexture = cc.PhysicsSprite.createWithSpriteFrameName(s_head.props.FirstFrame);
                s_head.spritebatch.addChild(headTexture);
                s_head.play = function() {
                    if (!this.anim || !this.anim.exists() || this.anim.isDone()) {
                        this.anim = self.playAnimation(this);
                        ek.get('soundlist-monkey-fx').playRandom();
                    }
                }
                headTexture.setBody(monkeyHead);
                self.addChild(s_head.spritebatch);

                return monkeyBody;
            };


            var addWalls = function() {
                var staticBody = spaceVar.staticBody;
                var height = 768;
                var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, height), 0),
				//new cp.SegmentShape(staticBody, cp.v(0, 900), cp.v(800, 900), 0),			 
                new cp.SegmentShape(staticBody, cp.v(1024, height), cp.v(1024, 0), 0),
                new cp.SegmentShape(staticBody, cp.v(1024, 0), cp.v(0, 0), 0)];
                for (var i = 0; i < walls.length; i++) {
                    var shape = walls[i];
                    shape.setElasticity(5);
                    shape.setFriction(5);
                    spaceVar.addStaticShape(shape);
                }
            }

            var carPosition = 300;
            boxOffset = cp.v(0, 0);
            var staticBody = spaceVar.staticBody;
            var walls = addWalls(); // create walls
            var monkeyTail = createMonkey();

        },
        playAnimation: function(object) {
            var cache = cc.SpriteFrameCache.getInstance();
            var frame;
            var animFrames = [];
            for (var i = 0; i < object.props.Frames.length; i++) {
                frame = cache.getSpriteFrame(object.props.Frames[i]);
                animFrames.push(frame);
            }

            monkeyHeadAnimation = cc.Animation.create();
            monkeyHeadAnimation.initWithSpriteFrames(animFrames, object.props.Duration / object.props.Frames.length);
            var animate = cc.Animate.create(monkeyHeadAnimation);
            var animateReverse = animate.reverse();
            var animation = cc.Repeat.create(cc.Sequence.create(animate, animateReverse), 2);
            headTexture.runAction(animation);
            return animation;
        },
        drawCircle: function(ctx, scale, point2canvas, c, radius) {
            var c = point2canvas(c);
            ctx.beginPath();
            ctx.arc(c.x, c.y, scale * radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
        },
        canvas2point: function(x, y) {
            return v(x / self.scale, 768 - y / self.scale);
        },
        touch2point: function(x, y) {
            return v(x / self.scale, y / self.scale);
        },
        point2canvas: function(point) {
            return v(point.x * self.scale, (768 - point.y) * self.scale);
        },
        onTouchesBegan: function(pTouch, pEvent) {
            self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
            this.mouseBody.p = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
            if (!self.mouseJoint) {
                var point = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
                var shape = this.space.pointQueryFirst(point, GRABABLE_MASK_BIT, cp.NO_GROUP);
                if (shape) {
                    var body = shape.body;
                    if (shape.id) {
                        ek.get(shape.id).play();
                    }
                    var mouseJoint = self.mouseJoint = new cp.PivotJoint(this.mouseBody, body, this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y));
                    mouseJoint.maxForce = 10000;
                    mouseJoint.errorBias = Math.pow(1 - 0.15, 60);
                    this.space.addConstraint(mouseJoint);
                }
            }
        },
        onTouchesEnded: function(pTouch, e) {
            self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
            if (self.mouseJoint) {
                this.space.removeConstraint(self.mouseJoint);
                self.mouseJoint = null;
            }
        },
        onTouchesMoved: function(pTouch, e) {
            self.mouse = this.touch2point(pTouch[0].getLocation().x, pTouch[0].getLocation().y);
            var newPoint = v.lerp(this.mouseBody.p, self.mouse, 0.25);
            this.mouseBody.v = v.mult(v.sub(newPoint, this.mouseBody.p), 60);
            //this.mouseBody.p = cc.p(newPoint.x,140);
            this.mouseBody.p = newPoint;
        },
        onKeyUp: function(e) {

        },
        onKeyDown: function(e) {

        },
        setupDebugNode: function(boolValue) {
            var debugNode = cc.PhysicsDebugNode.create(this.space);
            debugNode.setVisible(boolValue);
            this.addChild(debugNode);
        },
        update: function(dt) {
			dt = clamp(dt, 0, 0.2);
            this.space.step(dt);
			//monkeyBodyConnector.setAngle(0);
			
        }
    });


    var layer = new Joints();
    layer.init();
    layer.Joints();
    ek.layer.getParent().addChild(layer, 3);
})();

ek.layer.getParent().addChild(s_tailCoilBranch, 4);


