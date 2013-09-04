/*//Chapter 1 & 2

var MyApp = cc.Layer.extend(
{
    init:function()
    {
        
        var layer1 = cc.LayerColor.create(
            new cc.Color4B(33, 33, 28, 255), 600, 600)
        var busRoad = cc.Sprite.create(s_Road);

        layer1.setPosition(new cc.Point(0.0,0.0));
        layer1.addChild(busRoad);    

        
        var size = cc.Director.getInstance().getWinSize();
        busRoad.setPosition(new cc.Point(size.width/2,size.height/2));

        this.addChild(layer1);
        return true;
    }
});


var MyScene = cc.Scene.extend({

    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }

})
_________________________________________________________________________


//Chapter 3

var MyApp = cc.LayerColor.extend(
{   _busRoad:null,
    init:function(){
        this._super();
        //this.initWithColor(new cc.Color4B(0,0,0,255));
        var size = cc.Director.getInstance().getWinSize();

        this._busRoad = new busRoad();
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);

        this.setPosition(new cc.Point(0,0));

        this.addChild(this._busRoad);
        this._busRoad.setPosition(new cc.Point(size.width/2,size.height/2));
        this._busRoad.scheduleUpdate();
        this.schedule(this.update);

        return true;
    },
    onEnter:function(){
        this._super();
    },
    update:function(dt){
    },
    onTouchesEnded:function (pTouch,pEvent){
        this._busRoad.handleTouch(pTouch[0].getLocation());
    },
    onTouchesMoved:function(pTouch,pEvent){
        this._busRoad.handleTouchMove(pTouch[0].getLocation());
    },
    onKeyUp:function(e){

    },
    onKeyDown:function(e){
        this._busRoad.handleKey(e);
    }
});

var MyScene = cc.Scene.extend({

    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }

})
*/

var MyApp = cc.LayerColor.extend(
{
    bgWidth:null,
    bgRatio:null,
    parallaxEffectNode:null,
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
    init:function()
    {
        bgRatio = 0.2;
        bgWidth = 1024;

        var size = cc.Director.getInstance().getWinSize();

        var menuItem1 = new cc.MenuItemFont.create("Move Left",this.moveLeft, this);
        var menuItem2 = new cc.MenuItemFont.create("Move Right",this.moveRight, this);
        var menuItem3 = new cc.MenuItemFont.create("Move Up",this.moveUp, this);
        var menuItem4 = new cc.MenuItemFont.create("Move Down",this.moveDown, this);

        menuItem1.setFontSize(14);
        menuItem2.setFontSize(14);
        menuItem3.setFontSize(14);
        menuItem4.setFontSize(14);

        menuItem1.setAnchorPoint(0,0.5);
        menuItem2.setAnchorPoint(0,0.5);
        menuItem3.setAnchorPoint(0,0.5);
        menuItem4.setAnchorPoint(0,0.5);

        menuItem1.setPosition(new cc.Point(20,size.height-30));
        menuItem2.setPosition(new cc.Point(20,size.height-50));
        menuItem3.setPosition(new cc.Point(20,size.height-70));
        menuItem4.setPosition(new cc.Point(20,size.height-90));

        parallaxEffectNode = cc.ParallaxNode.create();

        parallaxImage1 = cc.Sprite.create(s_parallax1);
        parallaxImage2 = cc.Sprite.create(s_parallax2);
        parallaxImage3 = cc.Sprite.create(s_parallax3);
        //busRoad = cc.Sprite.create(s_Road); 

        parallaxImage1.setAnchorPoint(0,0);
        parallaxImage2.setAnchorPoint(0,0);
        parallaxImage3.setAnchorPoint(0,0);
        //busRoad.setAnchorPoint(0,0);

        //cc.log("parallaxImage2 "+parallaxImage2.getContentSize().width);
        //cc.log("parallaxImage2 "+parallaxImage3.getContentSize().width);
        parallaxEffectNode.addChild(parallaxImage1, -1, cc.p(bgRatio, 0), cc.p(0,0));
        parallaxEffectNode.addChild(parallaxImage2, -1, cc.p(bgRatio, 0), cc.p(-1536,0));
        parallaxEffectNode.addChild(parallaxImage3, -1, cc.p(bgRatio, 0), cc.p(-2560,0));

        var roadRatio = 1.6;
        var bgLength = ((bgWidth+1536)*roadRatio)/bgRatio;
        var spriteLength = 1024;
        var instancesNum = Math.ceil(bgLength/spriteLength)+(1024/spriteLength);
        var difference = bgWidth-spriteLength;
        cc.log("difference "+difference+" bgWidth "+bgWidth+" spriteLength "+spriteLength);
        for(var i = -1; i <=instancesNum; i++)
        {
            var busRoad = cc.Sprite.create(s_Road);
            busRoad.setAnchorPoint(0,0);
            var diff = (bgWidth-difference)
            cc.log("diff "+diff);
            parallaxEffectNode.addChild(busRoad, 2, cc.p(roadRatio, 0), cc.p((-(i*diff)),0));    
        }


        var lampRatio = .8;
        spriteLength = 512;
        bgLength = ((bgWidth+1536)*lampRatio)/bgRatio;
        instancesNum = Math.ceil(bgLength/spriteLength)+(1024/spriteLength);
        for(var i = -1; i <=instancesNum; i++)
        {
            var sideLamp = cc.Sprite.create(s_sideLamp);
            sideLamp.setAnchorPoint(0,0);
            parallaxEffectNode.addChild(sideLamp, 3, cc.p(lampRatio, 0), cc.p(-(i*spriteLength)+1024,0));
            
        }


        var buildingRatio = 0.4;
        spriteLength = 515;
        instancesNum = 4;
        bgLength = ((bgWidth+1536)*buildingRatio)/bgRatio;

        var spreadDistance = Math.abs(bgLength - (1024*2));
        var distance = spreadDistance/(instancesNum-2);
        
        var counter = 0;
        var oldRandom = 0;
        var generateRandom = 0;
        var randomX = 0;
        //cc.log(bgLength+" distance --- "+distance);
        for(var i = 0; i <= instancesNum ; i++)
        {
            var sBuilding1 = cc.Sprite.create(s_Building1);
            sBuilding1.setAnchorPoint(0,0.5);
            if(i==0)
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(0,0));
            }
            else if(i==(instancesNum-1))
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-(bgLength),0));//-((i*spriteLength)+1024)
            }
            else 
            {
                //cc.log(i+" spreadDistance "+spreadDistance);
                //var buildingPositions = i*(spreadDistance/(instancesNum-1));
                //var nodespaceValueX = sBuilding1.convertToNodeSpace(cc.p(-(i*distance),0)).x;
                generateRandom = (1024+Math.random()*spreadDistance)

                //var greeting = "Good" + ((now.getHours() > 17) ? " evening." : " day.");
                if(Math.abs(generateRandom-oldRandom)>spriteLength)
                {
                    randomX = generateRandom;
                }else
                {
                    randomX = generateRandom+(Math.abs(generateRandom-oldRandom+spriteLength));
                }
                //(Math.abs(generateRandom-oldRandom) > 820) ?generateRandom: generateRandom+(Math.abs(generateRandom-oldRandom))
                oldRandom = generateRandom;
                //cc.log("randomX "+randomX);
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-randomX,0));//-((i*spriteLength)+1024)
                randomX = 0;
                generateRandom = 0;
                //counter++;
            }
            //cc.log("bgLength "+((i*spriteLength)+1024));
            //cc.log("counter "+counter);
            
        }

        buildingRatio = .6;
        spriteLength = 794;
        instancesNum = 4;
        bgLength = ((bgWidth+1536)*buildingRatio)/bgRatio;

        spreadDistance = Math.abs(bgLength - (1024*2));
        distance = spreadDistance/(instancesNum-2);
        
        counter = 0;
        oldRandom = 0;
        generateRandom = 0;
        randomX = 0;

         for(var i = 0; i <= instancesNum ; i++)
        {
            var sBuilding1 = cc.Sprite.create(s_Building2);
            sBuilding1.setAnchorPoint(0,0.5);
            if(i==0)
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(0,0));
            }
            else if(i==(instancesNum-1))
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-(bgLength),0));//-((i*spriteLength)+1024)
            }
            else 
            {
                //cc.log(i+" spreadDistance "+spreadDistance);
                //var buildingPositions = i*(spreadDistance/(instancesNum-1));
                //var nodespaceValueX = sBuilding1.convertToNodeSpace(cc.p(-(i*distance),0)).x;
                generateRandom = (1024+Math.random()*spreadDistance)

                //var greeting = "Good" + ((now.getHours() > 17) ? " evening." : " day.");
                if(Math.abs(generateRandom-oldRandom)>spriteLength)
                {
                    randomX = generateRandom;
                    //cc.log("randomx "+generateRandom)
                }else
                {
                    randomX = generateRandom+(Math.abs(generateRandom-oldRandom+spriteLength));
                     //cc.log("randomx new "+generateRandom)
                }
                //(Math.abs(generateRandom-oldRandom) > 820) ?generateRandom: generateRandom+(Math.abs(generateRandom-oldRandom))
                oldRandom = generateRandom;
                //cc.log("randomX "+randomX);
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-randomX,0));//-((i*spriteLength)+1024)
                randomX = 0;
                generateRandom = 0;
                //counter++;
            }
            //cc.log("bgLength "+((i*spriteLength)+1024));
            //cc.log("counter "+counter);
            
        }

        buildingRatio = 2;
        spriteLength = 820;
        instancesNum = 10;
        bgLength = ((bgWidth+1536)*buildingRatio)/bgRatio;

        spreadDistance = Math.abs(bgLength - (1024*2));
        distance = spreadDistance/(instancesNum-2);
        
        counter = 0;
        oldRandom = 0;
        generateRandom = 0;
        randomX = 0;

        cc.log("bgLength "+bgLength);

         for(var i = 0; i <= instancesNum ; i++)
        {
            var sBuilding1 = cc.Sprite.create(s_Building3);
            sBuilding1.setAnchorPoint(0,0.5);
            if(i==0)
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(0,0));
            }
            else if(i==(instancesNum-1))
            {
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-(bgLength),0));//-((i*spriteLength)+1024)
            }
            else 
            {
                //cc.log(i+" spreadDistance "+spreadDistance);
                //var buildingPositions = i*(spreadDistance/(instancesNum-1));
                //var nodespaceValueX = sBuilding1.convertToNodeSpace(cc.p(-(i*distance),0)).x;
                generateRandom = (1024+Math.random()*spreadDistance)

                //var greeting = "Good" + ((now.getHours() > 17) ? " evening." : " day.");
                if(Math.abs(generateRandom-oldRandom)>spriteLength)
                {
                    randomX = generateRandom;
                }else
                {
                    randomX = generateRandom+(Math.abs(generateRandom-oldRandom+spriteLength));
                }
                //(Math.abs(generateRandom-oldRandom) > 820) ?generateRandom: generateRandom+(Math.abs(generateRandom-oldRandom))
                oldRandom = generateRandom;
                cc.log("randomX building 3 - "+randomX);
                parallaxEffectNode.addChild(sBuilding1, 1, cc.p(buildingRatio, 0), cc.p(-randomX,0));//-((i*spriteLength)+1024)
                randomX = 0;
                generateRandom = 0;
                //counter++;
            }
            //cc.log("bgLength "+((i*spriteLength)+1024));
            //cc.log("counter "+counter);
            
        }
        
        /*var buildingRatio = 0.3;
        var spriteLength = 1024;
        var instancesNum = bgLength/spriteLength;
        cc.log("instancesNum "+instancesNum);
        for(var i = -1; i <=(instancesNum+(Math.ceil(bgRatio+buildingRatio)*Math.floor(buildingRatio))); i++)
        {
            var sBuilding1 = cc.Sprite.create(s_Building1);
            sBuilding1.setAnchorPoint(0,0);   
        }*/
        var moveToWidth = (1024+1536)/bgRatio;
        var menu = cc.Menu.create(menuItem1,menuItem2,menuItem3,menuItem4);
        menu.setPosition(new cc.Point(0,0));

        this.addChild(menu,1);
        this.addChild(parallaxEffectNode);
        parallaxEffectNode.runAction(cc.MoveTo.create(.01, cc.p(0, 0)));
        return this;
    },/*
    onEnter:function(){
        parallaxEffectNode.addChild(sky, -1, cc.p(0.2, 0.5), cc.p(0,0));
        parallaxEffectNode.addChild(buildingBack, -1, cc.p(0.6, 0.5), cc.p((1024-buildingBack.getContentSize().width),0));
        parallaxEffectNode.addChild(buildingFront, -1, cc.p(0.4, 0.5), cc.p((1024-buildingFront.getContentSize().width),0));
        parallaxEffectNode.addChild(road,  1, cc.p(1.3, 2), cc.p((1024-road.width),0));
        parallaxEffectNode.addChild(sideWalk, -1, cc.p(1.3, 0.5), cc.p((1024-sideWalk.width),0));
    },*/
    moveLeft:function(){

        var moveToWidth = (1024+1536)/bgRatio;
        var goLeft = cc.MoveTo.create(10, cc.p(0, 0));
        var resetPosition = cc.MoveTo.create(0, cc.p(moveToWidth, 0));
        var seq = cc.Sequence.create(goLeft,resetPosition);
        
        parallaxEffectNode.stopAllActions();

        if(parallaxEffectNode.getPositionX() == 0)
        {
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }
        else if(parallaxEffectNode.getPositionX() == moveToWidth)
        {
            cc.log("here")
            parallaxEffectNode.runAction(cc.MoveTo.create(0, cc.p(0, 0)));
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }else if(parallaxEffectNode.getPositionX() > 0 && parallaxEffectNode.getPositionX() < moveToWidth)
        {
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }
    },
    moveRight:function(){

        var moveToWidth = (1024+1536)/bgRatio;
        var goRight = cc.MoveTo.create(10, cc.p(moveToWidth, 0));
        var resetPosition = cc.MoveTo.create(0, cc.p(0, 0));
        var seq = cc.Sequence.create(goRight,resetPosition);
        
        parallaxEffectNode.stopAllActions();

         if(parallaxEffectNode.getPositionX() == moveToWidth)
        {
            parallaxEffectNode.runAction(cc.MoveTo.create(0, cc.p(0, 0)));
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }
        else if(parallaxEffectNode.getPositionX() == 0)
        {
            parallaxEffectNode.runAction(resetPosition);
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }
        else if(parallaxEffectNode.getPositionX() > 0 && parallaxEffectNode.getPositionX() < moveToWidth)
        {
            parallaxEffectNode.runAction(cc.Repeat.create(seq,10));
        }
        //parallaxEffectNode.schedule(this.update);
        //parallaxEffectNode.runAction(cc.MoveTo.create(0, cc.p(1500, 0)));
        /*var jetPoint = busRoad.convertToWorldSpace(cc.PointZero()).x;
        console.log("jetPoint ",jetPoint)
        if(jetPoint > (1300))
        {
            
            // console.log("i am in here ",busRoad.convertToNodeSpace(cc.p(-300,0)));
            //busRoad.setPositionX(busRoad.convertToNodeSpace(cc.p(-300,0)));
        }*/
    },
    update:function(){
        //console.log(busRoad.convertToWorldSpace(cc.PointZero()).x);
        var jetPoint = busRoad.convertToWorldSpace(cc.PointZero()).x;
        parallaxEffectNode.setPositionX(parallaxEffectNode.getPositionX()+1);
        if(jetPoint > (10))
        {
            console.log("jetPoint ",jetPoint)
            // console.log("i am in here ",busRoad.convertToNodeSpace(cc.p(-300,0)));
            busRoad.setPositionX(cc.p(0,0));
        }
    },
    /*moveUp:function(){
        cc.log("Move Up");
        var goDown = cc.MoveBy.create(2, cc.p(0, 100));
        var go = cc.MoveBy.create(2, cc.p(0, 400));
        var seq = cc.Sequence.create(goDown);
        parallaxEffectNode.runAction(cc.Repeat.create(seq,1));
    },
    moveDown:function(){
        cc.log("Move Down");
        // now create some actions that will move the 'void' node
        // and the children of the 'void' node will move at different
        // speed, thus, simulation the 3D environment
        var goUp = cc.MoveBy.create(4, cc.p(0, 100));
        var goDown = goUp.reverse();
        var go = cc.MoveBy.create(8, cc.p(200, 0));
        var goBack = go.reverse();
        var seq = cc.Sequence.create(goUp, go, goDown, goBack);
        parallaxEffectNode.runAction((cc.RepeatForever.create(seq) ));

        this.addChild(parallaxEffectNode);
       
    },*/
    exit:function(){
        // document.location.href = "http://www.gamefromscratch.com";
    }
});


var MyScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MyApp();
        layer.init();
        this.addChild(layer);
    }
});






