
var ek = ek || {};

ek.Parallax = cc.ParallaxNode.extend(
{
	bgRatio:null,
	width:1024,
	height:768,
	bgLength:null,
	spriteLength:0,
	layerLength:0,

	addBackground:function(images, layerRatio){

        cc.log("layerRatio "+layerRatio);
        var img = null;
        var imageOffset = 0;

        images = images.hasOwnProperty('length') ? images : [images];
        this.bgRatio = layerRatio;
        for (var i = 0;i<images.length;i++)
        {
            img = cc.Sprite.create(images[i]);
            img.setAnchorPoint(0,0);
            img.setScaleX(1.01);
            if(i==0)
            {
                this.addChild(img, -1, cc.p(layerRatio, 0), cc.p(0,0));
            }
            else
            {
                imageOffset = (imageOffset+img.getContentSize().width);
                this.addChild(img, -1, cc.p(layerRatio, 0), cc.p(-imageOffset,0));
            }
        }
        img = cc.Sprite.create(images[0]);
        img.setAnchorPoint(0,0);
        img.setScaleX(1.01);
        imageOffset = (imageOffset+img.getContentSize().width);
        this.addChild(img, -1, cc.p(layerRatio, 0), cc.p(-(imageOffset),0));
        this.bgLength = imageOffset/layerRatio;
        cc.log(imageOffset+" this.bgLength "+this.bgLength);
        return this;
    },
    addLandscape:function(images, zDepth, anchorPoint){

        images = images.hasOwnProperty('length') ? images : [images];
        anchorPoint = (typeof(anchorPoint) == "undefined") ? cc.p(0,0) : anchorPoint;
        var landscapeSprite = cc.Sprite.create(images[0]);
        var spriteWidth = landscapeSprite.getContentSize().width;
        cc.log("hello "+landscapeSprite.getContentSize().width);
        var spriteRatio = (this.width+spriteWidth)/this.bgLength;
        landscapeSprite.setAnchorPoint(anchorPoint);
        this.addChild(landscapeSprite, zDepth, cc.p(spriteRatio, 0), cc.p(-(spriteWidth),0));
    },
    addSeamlessLandscape:function(images, zDepth, anchorPoint){

        images = images.hasOwnProperty('length') ? images : [images];
        anchorPoint = (typeof(anchorPoint) == "undefined") ? cc.p(0,0) : anchorPoint;
        var landscapeSprite = cc.Sprite.create(images[0]);
        var spriteWidth = landscapeSprite.getContentSize().width-1024;
        var spriteRatio = spriteWidth/this.bgLength;
        this.layerLength = this.bgLength*spriteRatio;
        landscapeSprite.setAnchorPoint(anchorPoint);
        this.addChild(landscapeSprite, zDepth, cc.p(spriteRatio, 0), cc.p(-(this.layerLength),0));
    },
    addTiledObject:function(images, layerRatio, zDepth, widthSize){

        images = images.hasOwnProperty('length') ? images : [images];
        this.spriteLength = widthSize;//img.getContentSize().width;
        
        var instancesNum = Math.ceil(this.bgLength/this.spriteLength)+(this.width/this.spriteLength);
        this.layerLength = this.bgLength*layerRatio;
        var difference = this.bgWidth-this.spriteLength;
        for(var i = -1; i <=instancesNum; i++)
        {                    
            var img = null;
            img = cc.Sprite.create(images[0]);
            img.setAnchorPoint(0,0);
            var diff = (bgWidth-difference);
            this.addChild(img, zDepth, cc.p(layerRatio, 0), cc.p((-(i*this.spriteLength)),0));
        }
        return this;
    },
   addRandomLoopSprites:function(images, layerRatio, zDepth, numClones){

        this.layerLength = this.bgLength*layerRatio;
        images = images.hasOwnProperty('length') ? images : [images];

        var oldRandom = 0;
        var currentRandom = 0;
        var randomXPos = 0;
        var loopObject0 = 0;
        var objectDisperseLength = Math.abs(this.bgLength - (this.width*2));

        //distance = objectDisperseLength/(numClones-2);

        for(var i = 0; i <= numClones ; i++)
        {
            var randomObjectNum = Math.round(Math.random()*(images.length-1))
            var loopObject = cc.Sprite.create(images[randomObjectNum]);
            loopObject.setAnchorPoint(0,0.5);
            var spriteLength = loopObject.getContentSize().width;
            cc.log("spriteLength "+spriteLength);
            if(i==0)
            {
                loopObject0 = randomObjectNum;
                this.addChild(loopObject, zDepth, cc.p(layerRatio, 0), cc.p(0,0));
            }
            else if(i==(numClones-1))
            {
                var loopObject = cc.Sprite.create(images[loopObject0]);
                loopObject.setAnchorPoint(0,0.5);
                this.addChild(loopObject, zDepth, cc.p(layerRatio, 0), cc.p(-(this.layerLength),0));
            }
            else 
            {
                currentRandom = (this.width+Math.random()*objectDisperseLength);
                if(Math.abs(currentRandom-oldRandom)>spriteLength)
                {
                    randomXPos = currentRandom;
                }else
                {
                    randomXPos = currentRandom+(Math.abs(currentRandom-oldRandom+spriteLength));
                }
                oldRandom = currentRandom;
                this.addChild(loopObject, zDepth, cc.p(layerRatio, 0), cc.p(-randomXPos,0));
                randomXPos = 0;
                currentRandom = 0;
            } 
        }
        return this;
    },
    addToHorizontalStack:function(objectStack, layerLength, addRatio){

        //this.layerLength = this.bgLength*layerRatio;
        var layerObjectStack = objectStack.hasOwnProperty('length') ? objectStack : [objectStack];
        var layerObjectLength = (typeof(layerLength) == "undefined") ? 0 : layerLength;
        var offsetYPos = 0;
        var layerRatio = 0;
        var layerWidth = 0;

        for(var i = 0; i < layerObjectStack.length ; i++)
        {
            if(typeof(layerObjectStack[i]) == "object"){
                layerWidth = layerWidth + layerObjectStack[i].x;
                console.log("layerWidth 1 "+layerWidth);
            }
            if(typeof(layerObjectStack[i]) == "string"){
                var stackObject = cc.Sprite.create(layerObjectStack[i]);
                layerWidth = layerWidth + stackObject.getContentSize().width;
                console.log("layerWidth 2 "+layerWidth+" WIDTH "+stackObject.getContentSize().width);
            }
        }
        
        console.log("layerWidth "+layerWidth+" layerLength "+layerLength);

        if(layerWidth < layerLength){

            layerWidth = layerLength
        }

        if(addRatio == false)
            layerRatio = 0;
        else
            layerRatio = layerWidth/this.bgLength;

        console.log("layerRatio " +layerRatio);

        var offsetH = 0;
        for(var i = 0; i < layerObjectStack.length ; i++)
        {
            if(typeof(layerObjectStack[i]) == "object"){
                offsetH = offsetH + layerObjectStack[i].x;
                offsetYPos = layerObjectStack[i].y;
            }
            if(typeof(layerObjectStack[i]) == "string"){
                var stackObject = cc.Sprite.create(layerObjectStack[i]);
                stackObject.setAnchorPoint(0,0);
                this.addChild(stackObject, 2, cc.p(layerRatio, 0), cc.p(-layerWidth+offsetH,offsetYPos));
                offsetH = offsetH + stackObject.getContentSize().width;
                console.log((-layerWidth+offsetH));
            }
        }

        var offsetH = 0;
        for(var i = 0; i < layerObjectStack.length ; i++)
        { 
            if(offsetH <= (this.width+this.width*.5))
            {
                if(typeof(layerObjectStack[i]) == "object"){
                    offsetH = offsetH + layerObjectStack[i].x;
                    offsetYPos = layerObjectStack[i].y;
                }
                if(typeof(layerObjectStack[i]) == "string"){
                    var stackObject = cc.Sprite.create(layerObjectStack[i]);
                    stackObject.setAnchorPoint(0,0);
                    this.addChild(stackObject, 2, cc.p(layerRatio, 0), cc.p(offsetH,offsetYPos));
                    offsetH = offsetH + stackObject.getContentSize().width;
                    console.log("offsetH populate "+offsetH);
                }
            }
            else
            {
                break;
            }
        }

        return this;
    },
    addToVerticalStack:function(objectStack){


    },
    loopParallaxLeft:function(){

        var goLeft = cc.MoveTo.create(10, cc.p(0, 0));
        var resetPosition = cc.MoveTo.create(0, cc.p(this.bgLength, 0));
        var seq = cc.Sequence.create(goLeft,resetPosition);

        this.stopAllActions();
         if(this.getPositionX() == 0)
        {
            this.runAction(cc.MoveTo.create(0, cc.p(0, 0)));
            this.runAction(cc.Repeat.create(seq,10));
        }
        else if(this.getPositionX() == this.bgLength)
        {
            this.runAction(resetPosition);
            this.runAction(cc.Repeat.create(seq,10));
        }
        else if(this.getPositionX() > 0 && this.getPositionX() < this.bgLength)
        {
            this.runAction(cc.Repeat.create(seq,10));
        }
    },
    loopParallaxRight:function(){

        var goRight = cc.MoveTo.create(10, cc.p(this.bgLength, 0));
        var resetPosition = cc.MoveTo.create(0, cc.p(0, 0));
        var seq = cc.Sequence.create(goRight,resetPosition);

        this.stopAllActions();
         if(this.getPositionX() == this.bgLength)
        {
            this.runAction(cc.MoveTo.create(0, cc.p(0, 0)));
            this.runAction(cc.Repeat.create(seq,10));
        }
        else if(this.getPositionX() == 0)
        {
            this.runAction(resetPosition);
            this.runAction(cc.Repeat.create(seq,10));
        }
        else if(this.getPositionX() > 0 && this.getPositionX() < this.bgLength)
        {
            this.runAction(cc.Repeat.create(seq,10));
        }
    }
});
