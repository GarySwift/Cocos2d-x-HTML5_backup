var background = ek.get('background');

var CloudLayer = cc.Layer.extend({
	cloudImage:null,
	upperBound:730,
	bottomBound: 500,
	rightBound:1400,
	leftBound: -300,
	ctor:function(id){
		this._super();
		cc.associateWithNative(this, cc.Layer);
		this.scheduleUpdate();
		this.cloudImage= ek.get(id);
		this.init();
	},
	init:function(){
		this.cloudImage.setPosition(cc.p( ek.rand(this.leftBound-200,this.rightBound-160) , ek.rand(this.bottomBound,this.upperBound) ));
		this.moveCloud();
		this.addChild(this.cloudImage);
	},
	moveCloud:function(){
		var vx = 15;
		var dx =  this.rightBound - this.cloudImage.getPosition().x;
		var tmax = dx/vx;
		var tmin = 50;
		
		(tmax<tmin)? tmax=tmin+.1 : tmax=tmax;
		
		var t = ek.rand(tmin,tmax);
		var seq = cc.Sequence.create(
			cc.MoveTo.create(t, cc.p( this.rightBound , this.cloudImage.getPosition().y )),
			cc.CallFunc.create(this.scheduledDelay,this)
		);
		
		this.cloudImage.runAction(seq);
	},
	scheduledDelay:function(){
		console.log(this.cloudImage.id + ' out') 
		this.scheduleOnce(this.repositionCloud, ek.rand(1,5));
	},
	repositionCloud:function(){
		console.log(this.cloudImage.id + ' in') 
		this.cloudImage.setPosition(cc.p( this.leftBound , ek.rand(this.bottomBound,this.upperBound) ));
		this.moveCloud();

	}
});

var cloud1 = new CloudLayer('cloud1');
var cloud2 = new CloudLayer('cloud2');
var cloud3 = new CloudLayer('cloud3');
var cloud4 = new CloudLayer('cloud4');
background.addChild(cloud1,background.props.ZIndex+1);
background.addChild(cloud2,background.props.ZIndex+1);
background.addChild(cloud3,background.props.ZIndex+1);
background.addChild(cloud4,background.props.ZIndex+1);
