function obj(x,y,service)
{	
	var opacity=function(n)
	{
		return this.attr('opacity',n);
	}
	opacity.val=1;	
	var fn = [];
	var name = function(name)
	{
		return this.attr('name',name)
	}
	name.val='';
	var visible=function(visibility)
	{
		return this.attr('visible',visibility);
	}
	visible.val=true;
	var composite=function(composite)
	{
		return this.attr('composite',composite);
	}
	composite.val='source-over';
	var droppable=function(fn)
	{
		this.droppable.val=true;
		if(fn!==undefined)this.droppable.fn=fn;
		return this;
	}
	droppable.val=false;
	droppable.fn=function(draggedObject){};
	var draggable=function(object,params,fn)
	{
		var dragObj=this;
		if(typeof params==='function')
		{
			fn=params;
			params=undefined;
		}
		if(typeof object=='function')
		{
			fn=object;
			object=undefined;
		}
		this.draggable.shiftX=0;
		this.draggable.shiftY=0;
		if(params!==undefined)
		{
			if(params.shiftX!==undefined){this.draggable.shiftX=params.shiftX;params.shiftX=undefined;}
			if(params.shiftY!==undefined){this.draggable.shiftY=params.shiftY;params.shiftY=undefined;}
		}
		if(object!==undefined)
		{
			if(object.id)dragObj=(params===undefined)? object.visible(false) : object.animate(params).visible(false);
			if(object=='clone')
			{
				dragObj=this.clone(params).visible(false);
				this.draggable.type='clone';
			}
		}
		this.draggable.val=true;
		this.draggable.x=this.x.val;
		this.draggable.y=this.y.val;
		this.draggable.dx=this.transformdx.val;
		this.draggable.dy=this.transformdy.val;
		this.draggable.object=dragObj;
		this.draggable.params=params;
		this.draggable.fn=fn||false;
		var optns=canvases[this.canvas.number].optns;
		optns.mousemove.val=true;
		optns.mousedown.val=true;
		optns.mouseup.val=true;
		return this;
	}
	draggable.val=false;
	var olayer=function(idLayer)
	{
		return layer(idLayer,this,'objs');
	}
	olayer.val=canvases[0].id.val+'Layer_0';
	olayer.number=0;
	var ocanvas=function(idCanvas)
	{
		return canvas(idCanvas,this,'objs');
	}
	ocanvas.number=0;
	var focus=function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=true;
			if(typeof this.onfocus=='function')this.onfocus();
		}
		else this.onfocus=fn;
		return this;
	}
	focus.val=false;
	var obj={
	x:{val:x||0},
	y:{val:y||0},
	opacity:opacity,
	fn:fn,
	id:function(id)
	{
		return this.attr('id',id);
	},
	name:name,
	clone:function(params)
	{
		var clone=shapes('rgba(0,0,0,0)');
		for(var key in this)
		{
			if(key=='id' || key=='level' || key=='canvas' || key=='layer' || key=="draggable" || key=="droppable" || key=="click" || key.substr(0,5)=="mouse" || key.substr(0,3)=="key")continue;
			if(!clone.hasOwnProperty(key))
			{
				switch(typeof this[key])
				{
					case 'object':clone[key]={};break;
					default:clone[key]=this[key];
				}
			}
			for(var subKey in this[key])
			{
				clone[key][subKey]=this[key][subKey];
			}
		}
		clone.layer(canvases[this.canvas.number].layers[this.layer.number].id.val);
		if(params===undefined) return clone;
		return clone.animate(params);
	},
	visible:visible,
	shadowX: {val:0},
	shadowY: {val:0},
	shadowBlur: {val:0},
	shadowColor: {val:'rgba(0,0,0,0)'},
	shadowColorR: {val:0},
	shadowColorG: {val:0},
	shadowColorB: {val:0},
	shadowColorA: {val:0},
	shadow: function(options)
	{
		for(var key in options)
		switch (key)
		{
			case 'x':
				this.shadowX.val=options.x;
				break;
			case 'y':
				this.shadowY.val=options.y;
				break;
			case 'blur':
				this.shadowBlur.val=options.blur;
				break;
			case 'color':
				var colorKeeper = parseColor(options.color);
				this.shadowColor = options.color.val;
				this.shadowColorR = colorKeeper.colorR;
				this.shadowColorG = colorKeeper.colorG;
				this.shadowColorB = colorKeeper.colorB;
				this.shadowColorA = colorKeeper.alpha;
				break;
		}
		redraw(this);
		return this;
	},
	composite:composite,
	setOptns:function(ctx)
	{
		ctx.globalAlpha = this.opacity.val;
		ctx.shadowOffsetX = this.shadowX.val;  
		ctx.shadowOffsetY = this.shadowY.val;  
		ctx.shadowBlur = this.shadowBlur.val;
		ctx.globalCompositeOperation=this.composite.val;
		ctx.shadowColor = 'rgba('+this.shadowColorR.val+','+this.shadowColorG.val+','+this.shadowColorB.val+','+this.shadowColorA.val+')';
		if(this.scale.matrix)
		{
			this.matrix(multiplyM(this.matrix(),this.scale.matrix));
			this.scale.matrix=false;
		}
		if(this.rotate.matrix)
		{
			this.matrix(multiplyM(this.matrix(),this.rotate.matrix));
			this.rotate.matrix=false;
		}
		ctx.transform(this.transform11.val,this.transform12.val,this.transform21.val,this.transform22.val,this.transformdx.val,this.transformdy.val);
		return this;
	},
	up:function(n)
	{						
		if(n === undefined)n=1;
		if(n == 'top')n=canvases[this.canvas.number].layers[this.layer.number].objs.length-1;
		this.level.val+=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	down:function(n)
	{						
		if(n == undefined)n=1;
		if(n == 'bottom')n=this.level.val;
		this.level.val-=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	level:function(n)
	{
		if(n == undefined)return this.level.val;
		this.level.val=n;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
		redraw(this);
		return this;
	},
	layer:olayer,
	canvas:ocanvas,
	del:function()
	{
		this.draw=false;
		canvases[this.canvas.number].layers[this.layer.number].optns.anyObjDeleted = true;
		redraw(this);
	},
	focus:focus,
	blur:function(fn)
	{
		if(fn===undefined)
		{
			this.focus.val=false;
			if(typeof this.onblur == 'function')this.onblur();
		}
		else this.onblur=fn;
		return this;
	},
	click: function(fn)
	{
		return setMouseEvent.call(this,fn,'click');
	},
	keypress: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeypress');
	},
	keydown: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeydown');
	},
	keyup: function(fn)
	{
		return setKeyEvent.call(this,fn,'onkeyup');
	},
	mousedown: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousedown');
	},
	mouseup: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseup');
	},
	mousemove: function(fn)
	{
		return setMouseEvent.call(this,fn,'mousemove');
	},
	mouseover: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseover');
	},
	mouseout: function(fn)
	{
		return setMouseEvent.call(this,fn,'mouseout');
	},
	draggable:draggable,
	droppable:droppable,
	attr:function(parameter,value)
	{
		if(typeof parameter==='object')
			var parameters=parameter;
		else
		{
			if(this[parameter]===undefined)return undefined;
			if(value===undefined)
				return this[parameter].val;
			parameters={};
			parameters[parameter]=value;
		}
		return this.animate(parameters);
	},
	stop:function(jumpToEnd,runCallbacks)
	{
		this.animate.val=false;
		for(var key in this)
		{
			if(this[key]['from']!==undefined)
			{
				this[key]['from']=undefined;
				if(jumpToEnd!==undefined)
					if(jumpToEnd)
					{
						this[key]['val']=this[key]['to'];
						if(key=='rotateAngle'){this.rotate(this[key]['val']-this[key]['prev'],this.rotateX.val,this.rotateY.val);}
						if(key=='translateX'){this.translate(this[key]['val']-this[key]['prev'],0);}
						if(key=='translateY'){this.translate(0,this[key]['val']-this[key]['prev']);}
						if(key=='scaleX'){this.scale(this[key]['val']-this[key]['prev'],0);}
						if(key=='scaleY'){this.scale(0,this[key]['val']-this[key]['prev']);}
					}
			}
		}		
		var fnlimit=this.fn.length;
		if(runCallbacks===undefined)runCallbacks=false;
		for(var j=0;j<fnlimit;j++)
		{
			if(this['fn'][j]['func'] != 0 && !this['fn'][j]['count'] && this.fn[j].enabled)
			{
				this.fn[j].enabled=false;
				if(runCallbacks)
					this['fn'][j]['func'].apply(this);
			}
		}
		return this;
	},
	animate:function(options,duration,easing,onstep,fn)
	{
		this.animate.val=true;
		if(duration===undefined)duration=1;
		else
		{
			if(typeof duration == 'function')
			{
				fn=duration;
				duration=1;
			}
			if(typeof duration == 'object')
			{
				easing=duration;
				duration=1;
			}
		}
		if(duration!=1)duration=duration/1000*canvases[this.canvas.number].fps;
		if (easing===undefined)easing={fn:'linear',type:'in'};
		else
		{
			if(typeof easing == 'function')
			{
				fn=easing;
				easing={fn:'linear',type:'in'};
			}
			if (easing.type===undefined)easing.type='in';
		}
		if(onstep===undefined)onstep=false;
		else
		{
			if(typeof onstep == 'function')
			{
				fn=onstep;
				onstep=false;
			}
		}
		if(options.scale!==undefined)
		{
			this.scaleX.val=this.scaleY.val=this.scaleX.prev=this.scaleY.prev=0;
			if(typeof options.scale!='object')
			{
				options.scaleX=options.scaleY=options.scale;
			}
			else
			{
				options.scaleX=options.scale.x||0;
				options.scaleY=options.scale.y||0;
			}
		}
		if(options.translate!==undefined)
		{
			this.translateX.val=this.translateY.val=this.translateX.prev=this.translateY.prev=0;
			if(typeof options.translate!='object')
			{
				options.translateX=options.translateY=options.translate;
			}
			else
			{
				options.translateX=options.translate.x||0;
				options.translateY=options.translate.y||0;
			}
			options.translate=undefined;
		}
		if(options.rotate!==undefined)
		{
			options.rotateAngle=options.rotate.angle;
			this.rotateAngle.val=this.rotateAngle.prev=0;
			this.rotateX.val=options.rotate.x||0;
			this.rotateY.val=options.rotate.y||0;
			options.rotate=undefined;
		}
		if(options.color !== undefined)
		{
			var colorKeeper=parseColor(options.color);
			if(colorKeeper.color.notColor)
				this.color.notColor=colorKeeper.color.notColor;
			else
			{
				options.colorR=colorKeeper.colorR.val;
				options.colorG=colorKeeper.colorG.val;
				options.colorB=colorKeeper.colorB.val;
				options.alpha=colorKeeper.alpha.val;
			}
			options.color = undefined;
		}
		if(options.shadowColor !== undefined)
		{
			colorKeeper=parseColor(options.shadowColor);
			options.shadowColorR=colorKeeper.colorR.val;
			options.shadowColorG=colorKeeper.colorG.val;
			options.shadowColorB=colorKeeper.colorB.val;
			options.shadowColorA=colorKeeper.alpha.val;
			options.shadowColor = undefined;
		}
		if (fn)
		{
			var fnlimit=this.fn.length;
			this.fn[fnlimit]={func:fn,count:0,enabled:true};
		}
		if (options.level !== undefined)
		{
			canvases[this.canvas.number].layers[this.layer.number].optns.anyObjLevelChanged = true;
			if(options.level=='top')options.level=canvases[this.canvas.number].layers[this.layer.number].objs[this.level.val].length-1;
			else
				if (options.level=='bottom')options.level=0;	
		}
		var re = /[A-z]+?/;
		for(var key in options)
		{
			if(this[key] !== undefined && options[key]!==undefined)
			{
				if(options[key]!=this[key]['val'])
				{
					if(options[key].charAt)
					{
						if(options[key].charAt(1)=='=')
						{
							options[key]=this[key]['val']+parseInt(options[key].charAt(0)+options[key].substr(2));
						}
						else if(!re.test(options[key]))options[key]=parseInt(options[key]);
						else this[key]['val']=options[key];
					}
					if(duration==1)this[key]['val']=options[key];
					else
					{
						this[key]['from']=this[key]['val'];
						this[key]['to']=options[key];
						this[key]['duration']=duration;
						this[key]['step']=1;
						this[key]['easing']=easing;
						this[key]['onstep']=onstep;
						if(fn)
						{
							this.fn[fnlimit][key]=true;
							this.fn[fnlimit].count++;
						}
					}
				}
			}
		}
		if(duration==1)
		{
			if(options['rotateAngle'])
				this.rotate(this.rotateAngle.val,this.rotateX.val,this.rotateY.val);
			if(options['translateX']||options['translateY'])
				this.translate(this.translateX.val,this.translateY.val);
			if(options['scaleX']||options['scaleY'])
				this.scale(this.scaleX.val,this.scaleY.val);
		}
		redraw(this);
		return this;
	},
	matrix:function(m)
	{
		if(m===undefined)return [[this.transform11.val,this.transform21.val,this.transformdx.val],[this.transform12.val,this.transform22.val,this.transformdy.val]];
		this.transform11.val=m[0][0];
		this.transform21.val=m[0][1];
		this.transform12.val=m[1][0];
		this.transform22.val=m[1][1];
		this.transformdx.val=m[0][2];
		this.transformdy.val=m[1][2];
		return this;
	},
	translateX:{val:0},
	translateY:{val:0},
	translate:function(x,y)
	{
		this.matrix(multiplyM(this.matrix(),[[1,0,x],[0,1,y]]));
		redraw(this);
		return this;
	},
	scaleX:{val:0},
	scaleY:{val:0},
	scale:function(x,y)
	{
		if(y===undefined)y=x;
		if(this.scale.matrix)
			this.scale.matrix=multiplyM(this.scale.matrix,[[x,0,this.x.val*(1-x)],[0,y,this.y.val*(1-y)]]);
		else
			this.scale.matrix=[[x,0,this.x.val*(1-x)],[0,y,this.y.val*(1-y)]];
		redraw(this);
		return this;
	},
	rotateAngle:{val:0},
	rotateX:{val:0},
	rotateY:{val:0},
	rotate:function(x,x1,y1)
	{
		redraw(this);
		x=Math.PI*x/180;
		var cos=Math.cos(x);
		var sin=Math.sin(x);
		var matrix=[];
		if(x1===undefined)
		{
			matrix=[[cos,-sin,0],[sin,cos,0]];
		}
		else 
		{
			if(x1=='center')
			{
				var point=getObjectCenter(this);
				if(y1===undefined)
				{
					x1=point.x;
					y1=point.y;
				}
				else
				{
					x1=point.x+y1.x;
					y1=point.y+y1.y;
				}
			}
			matrix=[[cos,-sin,-x1*(cos-1)+y1*sin],[sin,cos,-y1*(cos-1)-x1*sin]];
		}
		if(this.rotate.matrix)
				this.rotate.matrix=multiplyM(this.rotate.matrix,matrix);
			else
				this.rotate.matrix=matrix;
		return this;
	},
	transform11:{val:1},
	transform12:{val:0},
	transform21:{val:0},
	transform22:{val:1},
	transformdx:{val:0},
	transformdy:{val:0},
	transform:function(m11,m12,m21,m22,dx,dy,reset)
	{
		if(reset!==undefined)
		{
			this.matrix([[m11,m21,dx],[m12,m22,dy]]);
		}
		else
		{
			var m=multiplyM(this.matrix(),[[m11,m21,dx],[m12,m22,dy]]);
			this.matrix(m);
		}
		redraw(this);
		return this;
	},
	beforeDraw:function(ctx)
	{
		if(!this.visible.val)return false;
		ctx.save();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			clipObject.visible.val=true;
			animating.call(clipObject);
			clipObject.setOptns(ctx);
			ctx.beginPath();
			clipObject.draw(ctx);
			ctx.clip();
		}
		this.setOptns(ctx);
		animating.call(this);
		ctx.beginPath();
		return true;
	},
	clip:function(object)
	{
		if(object===undefined)return this.clip.val;
		canvases[object.canvas.number].layers[object.layer.number].objs.splice(object.level.val,1);
		this.clip.val=object;
		return this;
	},
	afterDraw:function(optns)
	{
		optns.ctx.closePath();
		checkEvents(this,optns);
		optns.ctx.restore();
		if(this.clip.val)
		{
			var clipObject=this.clip.val;
			if(clipObject.afterDrawObj)clipObject.afterDrawObj(optns);
			else clipObject.afterDraw();
		}
	},
	isPointIn:function(x,y,global)
	{
		var ctx=canvases[this.canvas.number].optns.ctx;
		if(global!==undefined)
		{
			x-=canvases[this.canvas.number].optns.x;
			y-=canvases[this.canvas.number].optns.y;
		}
		ctx.save();
		ctx.beginPath();
		this.draw(ctx);
		var point=isPointInPath(this,x,y);
		ctx.closePath(); 
		ctx.restore();
		if(point)return true;
		return false;
	}
	}
	obj.rotate.matrix=obj.scale.matrix=false;
	if(service===undefined && canvases[lastCanvas]!==undefined && canvases[lastCanvas].layers[0]!==undefined)
	{	
		obj.level.val=obj.level.current=canvases[lastCanvas].layers[0].objs.length;
		canvases[lastCanvas].layers[0].objs[canvases[lastCanvas].layers[0].objs.length]=obj;
		obj.layer.number=0;
		obj.canvas.number=lastCanvas;
		obj.layer.val=canvases[lastCanvas].layers[0].id.val;
		redraw(obj);
	}
	return obj;
}