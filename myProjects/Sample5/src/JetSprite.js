

var JetSprite = cc.Sprite.extend({
	_currentRotation:0,
	ctor:function(){
		this.initWithFile(s_Jet);
	},

	update:function(dt){
		//this.setRotation(this._currentRotation)
		//this.runAction(cc.)
	},

	handleKey:function(e)
	{
		var angle;

		if(e === cc.KEY.up)
		{
			angle = this.getAngle(300,301);
		}
		else if(e === cc.KEY.down)
		{
			angle = this.getAngle(300,299)
		}

		if(e === cc.KEY.right)
		{
			angle = this.getAngle(301,300)
		}
		else if(e === cc.KEY.left)
		{
			angle = this.getAngle(299,300)
		}

		this.animateJet(angle);
	},

	handleTouch:function(touchLocation)
	{
		this.animateJet(this.getAngle(touchLocation.x, touchLocation.y));
		cc.log("in handle touch")
	},

	getAngle:function(xTouchPos, yTouchPos)
	{
		var angle = Math.atan2(xTouchPos - 300, yTouchPos - 300);
		angle = angle * (180/Math.PI);
		return angle;
	},

	animateJet:function(angle)
	{

		this.runAction(cc.EaseBackOut.create(cc.RotateTo.create(.5,angle)));
	},

	handleTouchMove:function(touchLocation){
		
		//cc.log("in handle touch move")
	}
})