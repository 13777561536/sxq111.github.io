//alert("sxq");
window.onload=main;

var sxqtools={
    nodeListToArray:function(nodes)
    {
        var arr=[];
        for(var i=0;i<nodes.length;i++)
        {
            arr.push(nodes[i]);
        }
        return arr;
    },
    currentColor:null,
    toRGB:function(r,g,b){
        return "rgb("+r+","+g+","+b+")";
    },

};

function main()
{
    var canvas=document.getElementById("canvas");
    var context=canvas.getContext("2d");
    // context.moveTo(0,0);
    // context.lineTo(200,200);
    // context.stroke();
    // canvas.addEventListener("click",function(event){
    //     //alert("client :"+event.clientX+","+event.clientY);//client x,y相对于整个窗口
    //     console.log("listener offset :"+event.offsetX+","+event.offsetY);//offset 相对于该元素
    //     //alert("xy :"+event.x+","+event.y);//xy和clientxy一样
    // },false);//同种事件在前定义先触发


//-------------------tool buttons ------------------
    var btn1=document.getElementById("btn1");
    btn1.onclick=function(){
        context.fillStyle="#fff"
        context.fillRect(0,0,canvas.width,canvas.height);
        context.strokeStyle="#000"
        context.lineCap="round";
        context.lineWidth=10;
        pathlist.forEach(function(e){
            context.stroke(e);
        });
    };
    var btn2=document.getElementById("btn2");
    var image=new Image();
    btn2.onclick=function(){
        context.fillStyle="rgba(128,128,128,0.1)"
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle="rgb(0,0,0)";
        context.fillRect(0,0,canvas.width/2,canvas.height/2);
        image.src=canvas.toDataURL();
        //console.log();
    };

    var btn3=document.getElementById("btn3");
    var imgdata;
    btn3.onclick=function()
    {
        imgdata= context.getImageData(0,0,canvas.width,canvas.height);
    }

    var btn4=document.getElementById("btn4");
    btn4.onclick=function()
    {
        //context.putImageData(imgdata,0,0);
        context.drawImage(image,0,0);
    }
    //-------colors  drag----------
    var colors=document.getElementById("colors");
    colors.onmousedown=function(e){
        console.log("c:"+colors.clientLeft);// 等于左边框宽度
        console.log("o:"+colors.offsetLeft);//等于距离包含框的距离
        console.log("s:"+colors.scrollLeft);
        //console.log("l:"+colors.left);
        var extraX=e.clientX-colors.offsetLeft//
        var extraY=e.clientY-colors.offsetTop//用offset属性读，用style.top设置是最优的
        if(e.target==colors){
            colors.onmousemove=function(e2){
                colors.style.top=e2.clientY-extraY+"px";
                colors.style.left=e2.clientX-extraX+"px";
                if(colors.offsetLeft<0)
                {
                    colors.style.left=0+"px";
                    //return;
                }
                if(colors.offsetTop<0)
                {
                    colors.style.top=0+"px";
                    //return;
                }
                if(colors.offsetLeft>document.body.clientWidth-colors.offsetWidth)
                {
                    colors.style.left=document.body.clientWidth-colors.offsetWidth+"px";
                }
                if(colors.offsetTop>document.body.clientHeight-colors.offsetHeight)
                {
                    colors.style.top=document.body.clientHeight-colors.offsetHeight+"px";
                }
                
                //console.log("now x:"+colors.style.left);
            }
        }
    }
    colors.onmouseup=function(){
        colors.onmousemove=null;
    }
//----------------colorpickers--------------
//to do 尝试使用事件委托
var pickercanvas=document.getElementById("pickercanvas");
var pickercontext=pickercanvas.getContext("2d");
var blockheight=pickercanvas.height/8;
var blockwidth=pickercanvas.width/8;
console.log(pickercanvas.width+','+pickercanvas.height);
var x=0;
var y=0;
for(let r=0;r<4;r++)
    for(let g=0;g<4;g++)
        for(let b=0;b<4;b++)
        {//绘制色块
            pickercontext.fillStyle="rgb("+r*85+","+g*85+","+b*85+")"
            pickercontext.fillRect(x*blockwidth,y*blockheight,blockwidth,blockheight);
            pickercontext.strokeStyle="#000";
            pickercontext.lineWidth=2;
            pickercontext.strokeRect(x*blockwidth,y*blockheight,blockwidth,blockheight);
            x++;
            if(x>=8)
            {
                x=0;
                y++;
            }
        }
pickercanvas.onmousemove=function(e){
    pickercontext.strokeStyle="#000";
    for(let x=0;x<8;x++){
        for(let y=0;y<8;y++)
        {
            pickercontext.strokeStyle="#000";
            pickercontext.strokeRect(x*blockwidth,y*blockheight,blockwidth,blockheight);
        }
    }
    pickercontext.lineWidth=2;
    pickercontext.strokeStyle="#fff";
    //console.log(e.offsetX+','+e.offsetY);
    if(e.offsetX>0&&e.offsetX<pickercanvas.width&&e.offsetY>0&&e.offsetY<pickercanvas.height)
    {
        pickercontext.strokeRect(Math.floor(e.offsetX/blockwidth)*blockwidth,Math.floor(e.offsetY/blockheight)*blockheight,blockwidth,blockheight);
    }
}

var buttoncancle=document.getElementById("colorCancle");
var buttonok=document.getElementById("colorOk");

buttoncancle.onclick=function(){
    var colorboard=document.getElementById("pickerdiv");
    colorboard.style.display="none";
    selectedtarget.style.backgroundColor=origionColor;
}
buttonok.onclick=function(){
    var colorboard=document.getElementById("pickerdiv");
    colorboard.style.display="none";
}

var  origionColor;
var selectedtarget;
pickercanvas.onclick=function(e)
{
    var x=Math.floor(e.offsetX/blockwidth);
    var y=Math.floor(e.offsetY/blockheight);
    var pixels=pickercontext.getImageData(x*blockwidth+5,y*blockheight+5,1,1);
    var data=pixels.data;
    selectedtarget.style.backgroundColor=sxqtools.toRGB(data[0],data[1],data[2]);
    console.log(selectedtarget.style.backgroundColor);
    //console.log(sxqtools.toRGB(data[0],data[1],data[2]));
}
//colors.style.background
var colorpickers=colors.getElementsByClassName('colorpicker');
colors.ondblclick=function(e)
{
    //事件委托
    // var colorpickerarr=sxqtools.nodeListToArray(colorpickers);
    // colorpickerarr.forEach(function(e){
    //     e.style.borderColor="#000";
    // });
    var eventtarget=e.target;
    switch(eventtarget)
    {
        case e.currentTarget:
            console.log("board");
            break;
        default:
            if(selectedtarget){
                selectedtarget.style.borderColor="#000";
            }
            selectedtarget=eventtarget;
            eventtarget.style.borderColor="#ff0";
            var colorboard=document.getElementById("pickerdiv");
            colorboard.style.display="block";
            console.log(getComputedStyle(eventtarget,null).backgroundColor);
            origionColor=getComputedStyle(eventtarget,null).backgroundColor;
            console.log("origionColor: "+origionColor);
            console.log("picker");
            break;
    }
}

colors.onclick=function(e)
{
    //事件委托
    // var colorpickerarr=sxqtools.nodeListToArray(colorpickers);
    // colorpickerarr.forEach(function(e){
    //     e.style.borderColor="#000";
    // });
    var eventtarget=e.target;
    switch(eventtarget)
    {
        case e.currentTarget:
            console.log("board");
            break;
        default:
             if(selectedtarget){
                selectedtarget.style.borderColor="#000";
            }
            selectedtarget=eventtarget;
            sxqtools.currentColor=selectedtarget;
            console.log("currentColor:"+sxqtools.currentColor.style.backgroundColor);
            eventtarget.style.borderColor="#ff0";
            var colorboard=document.getElementById("pickerdiv");
            break;
    }
}

//-------------draw methods--------------
    var currentpath=new Path2D();
    var pathlist=[];
    var path=new Path2D();
    canvas.onmousedown=function(e)
    {
        if(sxqtools.currentColor &&sxqtools.currentColor.style.backgroundColor)
        {
            context.strokeStyle=sxqtools.currentColor.style.backgroundColor;
        }else{
            context.strokeStyle="#888";
        }
        
        context.lineWidth=3;
        currentpath.moveTo(e.offsetX,e.offsetY);
        path.moveTo(e.offsetX,e.offsetY);
        e.target.onmousemove=function(e2)
        {
            //context.fillStyle="#000";
             context.lineCap="round";//---很重要，如果是默认值会导致意想不到结果---
             currentpath.lineTo(e2.offsetX,e2.offsetY);
             //currentpath.arc(e2.offsetX,e2.offsetY,1,0,2*Math.PI,false);
             context.stroke(currentpath);
             //context.fill(currentpath);
             path.lineTo(e2.offsetX,e2.offsetY);
             path.moveTo(e2.offsetX,e2.offsetY);///---很重要，这样保证与currentpath绘制方式一致
             currentpath=new Path2D();
             currentpath.moveTo(e2.offsetX,e2.offsetY);
             console.log(" offset :"+e2.offsetX+","+e2.offsetY);
        }
        console.log("down");
    }
    
    canvas.onmouseup=function(e){
        
        //context.stroke(currentpath);
        var oldpath=path;
        path=new Path2D();
        pathlist.push(oldpath);
        e.target.onmousemove=null;
        console.log("up");
    }
  
}