
var ek = ek || {};

ek.Parallax = cc.ParallaxNode.extend(
{
	bgRatio:null,
	width:1024,
	height:768,
	bgLength:null,
	spriteLength:0,
	layerLength:0,

	addBackground:function(images, layerRatio, showBackground){
        var img = null;
        var imageOffset = 0;

        images = images.hasOwnProperty('length') ? images : [images];
        this.bgRatio = layerRatio;
        for (var i = 0;i<images.length;i++)
        {
            img = cc.Sprite.create(images[i]);
            img.setAnchorPoint(0,0);
            img.setScaleX(1.01);
            if(showBackground == undefined || showBackground == true)
            {
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
        }
        img = cc.Sprite.create(images[0]);
        img.setAnchorPoint(0,0);
        img.setScaleX(1.01);
        imageOffset = (imageOffset+img.getContentSize().width);
        console.log("showBackground "+showBackground);
        if(showBackground == undefined || showBackground == true)
        {
            console.log("i am in add");
            this.addChild(img, -1, cc.p(layerRatio, 0), cc.p(-(imageOffset),0));
        }
        this.bgLength = imageOffset/layerRatio;
        return this;
    },
    addTiledObject:function(tileImageStack, numOfLoops){

        var tileObjectStack = tileImageStack.hasOwnProperty('length') ? tileImageStack : [tileImageStack];
        var layerObjectLength = 0;
        var offsetYPos = 0;
        var layerRatio = 0;
        var layerWidth = 0;

        for(var i = 0; i < tileObjectStack.length ; i++)
        {
            var stackObject = cc.Sprite.create(tileObjectStack[i]);
            layerWidth = layerWidth + stackObject.getContentSize().width;
        }
        layerObjectLength = layerWidth*numOfLoops;
        layerRatio = layerObjectLength/this.bgLength;
        
        var offsetH = 0;
        var tileArrayCounter = 0;
        for(var i = 0; i < (tileObjectStack.length*numOfLoops) ; i++)
        {
            var stackObject = null;
            if(tileArrayCounter < tileImageStack.length)
            {
                stackObject = cc.Sprite.create(tileObjectStack[tileArrayCounter]);
                stackObject.setAnchorPoint(0,0);
                this.addChild(stackObject, 2, cc.p(layerRatio, 0), cc.p(-layerObjectLength+offsetH,offsetYPos));
                offsetH = offsetH + stackObject.getContentSize().width;
                tileArrayCounter++;
            }else
            {
                tileArrayCounter = 0;
                stackObject = cc.Sprite.create(tileObjectStack[tileArrayCounter]);
                stackObject.setAnchorPoint(0,0);
                this.addChild(stackObject, 2, cc.p(layerRatio, 0), cc.p(-layerObjectLength+offsetH,offsetYPos));
                offsetH = offsetH + stackObject.getContentSize().width;
                tileArrayCounter++;
            } 
        }
        
        offsetH = 0;
        for(var i = 0; i < (tileObjectStack.length*numOfLoops) ; i++)
        { 
            if(offsetH <= (this.width+this.width*.5))
            {
                 var stackObject = null;
                if(tileArrayCounter < tileImageStack.length)
                {
                    stackObject = cc.Sprite.create(tileObjectStack[tileArrayCounter]);
                    stackObject.setAnchorPoint(0,0);
                    this.addChild(stackObject, 2, cc.p(layerRatio, 0), cc.p(offsetH,offsetYPos));
                    offsetH = offsetH + stackObject.getContentSize().width;
                    tileArrayCounter++;
                }else
                {
                    tileArrayCounter = 0;
                }
            }
            else
            {
                break;
            }
        }
        return this;
    },
    addToHorizontalStack:function(objectStack, layerLength, hasRatio){

        var layerObjectStack = objectStack.hasOwnProperty('length') ? objectStack : [objectStack];
        var layerObjectLength = (typeof(layerLength) == "undefined") ? 0 : layerLength;
        var offsetYPos = 0;
        var layerRatio = 0;
        var layerWidth = 0;

        for(var i = 0; i < layerObjectStack.length ; i++)
        {
            if(typeof(layerObjectStack[i]) == "object"){
                layerWidth = layerWidth + layerObjectStack[i].x;
            }
            if(typeof(layerObjectStack[i]) == "string"){
                var stackObject = cc.Sprite.create(layerObjectStack[i]);
                layerWidth = layerWidth + stackObject.getContentSize().width;
            }
        }

        if(layerWidth < layerLength){

            layerWidth = layerLength
        }

        if(hasRatio == false)
            layerRatio = 0;
        else
            layerRatio = layerWidth/this.bgLength;

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
            }
        }

        offsetH = 0;
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
                }
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
