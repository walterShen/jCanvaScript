jCanvaScript.imageData=function(width,height)
{
	var imageData=obj();
	if(height===undefined)
	{
		var oldImageData=width;
		width=oldImageData.width.val;
		height=oldImageData.height.val;
	}
	imageData.width={val:width};
	imageData.height={val:height};
	imageData.data=[];
	imageData.setPixel=function(x,y,color)
	{
		var colorKeeper = parseColor(color);
		var index=(x + y * this.width.val) * 4;
		this.data[index+0] = colorKeeper.colorR.val;
		this.data[index+1] = colorKeeper.colorG.val;
		this.data[index+2] = colorKeeper.colorB.val;
		this.data[index+3] = colorKeeper.alpha.val*255;
		redraw(this);
		return this;
	}
	imageData.getPixel=function(x,y)
	{
		var index=(x + y * this.width.val) * 4;
		return [this.data[index+0],this.data[index+1],this.data[index+2],this.data[index+3]/255];
	}
	imageData.getX={val:0};
	imageData.getY={val:0};
	imageData.getData=function(x,y,width,height)
	{
		this.getX.val=x;
		this.getY.val=y;
		this.width.val=width;
		this.height.val=height;
		var ctx=canvases[this.canvas.number].optns.ctx;
		try{
				this.imgData=ctx.getImageData(this.getX.val,this.getY.val,this.width.val,this.height.val);
			}catch(e){
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				this.imgData=ctx.getImageData(this.getX.val,this.getY.val,this.width.val,this.height.val);
		}
		this.data=this.imgData.data;
		redraw(this);
		return this;
	}
	imageData.putData=function(x,y)
	{
		if(x!==undefined)this.x.val=x;
		if(y!==undefined)this.y.val=y;
		this.putData.val=true;
		redraw(this);
		return this;
	}
	imageData.putData.val=false;
	for(var i=0;i<imageData.width.val;i++)
		for(var j=0;j<imageData.height.val;j++)
		{
			index=(i+j*imageData.width.val)*4;
			imageData.data[index+0]=0;
			imageData.data[index+1]=0;
			imageData.data[index+2]=0;
			imageData.data[index+3]=0;
		}
	imageData.draw=function(ctx)
	{
		if(this.imgData===undefined)
		{
			this.imgData=ctx.createImageData(this.width.val,this.height.val);
			this.imgData.data=this.data.concat();
			this.data=this.imgData.data;
		}
		if(this.putData.val)
			ctx.putImageData(this.imgData,this.x.val,this.y.val);
	}
	return imageData;
}
jCanvaScript.image=function(img,sx,sy,swidth,sheight,dx,dy,dwidth,dheight)
{
	var image=obj();
	image.img={val:img};
	image.swidth={val:swidth||false};
	image.sheight={val:sheight||false};
	image.sx={val:sx};
	image.sy={val:sy};
	image.dx={val:dx||false};
	image.dy={val:dy||false};
	image.dwidth={val:dwidth||false};
	image.dheight={val:dheight||false};
	image.draw=function(ctx)
	{
		if(this.swidth.val==false && this.dx.val==false){ctx.drawImage(this.img.val,this.sx.val,this.sy.val);}
		else{if(this.dx.val==false)ctx.drawImage(this.img.val,this.sx.val,this.sy.val,this.swidth.val,this.sheight.val);
			else ctx.drawImage(this.img.val,this.sx.val,this.sy.val,this.swidth.val,this.sheight.val,this.dx.val,this.dy.val,this.dwidth.val,this.dheight.val);}
	}
	return image;
}