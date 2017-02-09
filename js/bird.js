var wrap = document.querySelector(".wrap");
var bird = document.getElementById("bird");
var gameOver = document.querySelector(".gameOver");
var start = document.querySelector(".start");
var home = document.querySelector(".home");
var timer = null;
var score = 0;  //得分
/**
 * 障碍物类，创造一上一下两个管道，高度随机，但中间空隙固定
 * @param {number} gap  上下管道之间的宽度，可用于设置游戏的难度
 */
function CreatBarrier(gap){
	this.gap = gap;  //两管道之间的间隙
	this.h1 = parseInt(Random(60,437-60-this.gap)); //上管道的高度
	this.h2 = 437-this.h1-this.gap;  //下管道的高度
	this.imgsrc1 = "img/up_pipe.png";  //上管道的图片
	this.imgsrc2 = "img/down_pipe.png";  //下管道的图片
	this.bgsrc1 = "img/up_mod.png";  //用于拼接上管道的背景图
	this.bgsrc2 = "img/down_mod.png";  //下管道
	
	this.init();
}	

//管道初始化方法
CreatBarrier.prototype.init = function(){
	//包着整个管道的最大的ul
	this.oUl = document.createElement("ul");
	this.oUl.id = "barrier";
	
	//上管道的一些初始化设置
	this.oLi1 = document.createElement("li");
	this.oImg1 = document.createElement("img");
	this.oImg1.src = this.imgsrc1;
	this.oLi1.style.cssText = "height: "+this.h1+"px;position: relative;margin-bottom: "+this.gap+"px;background-image: url("+this.bgsrc1+");";
	this.oImg1.style.cssText = "position: absolute;bottom: 0;left: 0;";
	this.oLi1.appendChild(this.oImg1);
	this.oUl.appendChild(this.oLi1);
	
	//下管道的一些初始化设置
	this.oLi2 = document.createElement("li");
	this.oImg2 = document.createElement("img");
	this.oImg2.src = this.imgsrc2;
	this.oLi2.style.cssText = "height: "+this.h2+"px;background-image: url("+this.bgsrc2+");";
	this.oLi2.appendChild(this.oImg2);
	this.oUl.appendChild(this.oLi2);
	
	//在游戏框外创建一个管道
	this.oUl.style.left = "343px";
	wrap.appendChild(this.oUl);
}

//管道在游戏框中的移动方法
CreatBarrier.prototype.move = function(){
	this.oUl.style.left = this.oUl.offsetLeft-2+'px';
}


/**
 * 开始游戏,用于控制整个游戏的流程
 * 1.管道的持续向左移动,并且移出游戏框后remove;
 * 2.草坪的移动
 * 3.小鸟与管道的碰撞检测
 * 4.得分——换图
 */
var barrier = []; //用于装入管道对象
var count = 99;  //累加,产生我需要的时间间隔
var gap;
var bgFloorX = 0;  //底部草坪的背景图位置的x值
var speedY = 0;   //下落速度
var rotate = 0;   //头的旋转速度
var bIndex = 0;   //判断碰撞检测时管道对象数组的索引 
var die = false;  //死亡标记,false表示还活着
function startGame(){
	count++;
	//产生管道的时间为  100*定时器的时间
	if(count%100==0){
		barrier.push(new CreatBarrier(gap));
	}
	//对每一个管道执行移动方法
	//当发现管道超出游戏框后,将其移除
	if(die==false){
		for (var i=0;i<barrier.length;i++) {
			barrier[i].move();
			//超出游戏框
			if(parseInt(barrier[i].oUl.style.left)<=-62){
				barrier[i].oUl.remove();
			}
		}
	}
	
	//底部草坪的移动, 鸟死了草就不移动了
	if(die==false){
		bgFloorX-=2;
		document.querySelector(".floor").style.backgroundPositionX = bgFloorX+'px'; 
		if(bgFloorX<=-343){
			bgFloorX = 0;
		}
	}
	
	//鸟的掉落
	//下落
	speedY+=0.4;  //模仿重力加速度
	bird.style.top = bird.offsetTop + speedY + 'px';
	
	//当鸟掉落到地上说明游戏结束
	/**
	 *************游戏结束  ***************
	 */
	if(bird.offsetTop>=390){
		bird.style.top = '390px';
		clearInterval(timer);
		gameOver.style.display="block";
		start.style.display = "block";
		home.style.display = 'block';
	}
	
	//鸟头的朝向的改变
	if(die==false){
		rotate+=2;
		bird.style.transform = "rotate("+rotate+"deg)";
	}
	
	//鸟的飞翔动画, 换图
	if(count/6%2==0){
		bird.src = "img/bird1.png";
	}
	else if(count/6%2==1){
		bird.src = "img/bird0.png";
	}
	
	/**
	 * 碰撞检测
	 */
	//当小鸟成功经过一个管道时,bIndex加1,下一次检测小鸟与下一个管道的碰撞
	if(barrier[bIndex].oUl.offsetLeft<=78){
		bIndex++;
		
		//**********得分**********
		score++;
		if(score>9){
			//十位
			document.querySelector(".score").children[0].src = "img/"+parseInt(score/10)+".jpg";
			//个位
			document.querySelector(".score").children[1].src = "img/"+score%10+".jpg";
		}
		else{
			document.querySelector(".score").children[0].src = "img/"+score+".jpg";
		}
	}
	//碰撞计算
	if(bird.offsetLeft+40>=barrier[bIndex].oUl.offsetLeft){
		if(bird.offsetTop<=barrier[bIndex].oUl.children[0].offsetHeight || bird.offsetTop>=barrier[bIndex].oUl.children[0].offsetHeight+gap-26){
			//此时小鸟已经碰到柱子了
			die = true;  //鸟已死亡
			bird.style.transform = "rotate(90deg)";
		}
	}	
}

//开始按钮
start.onclick=function(){		
	//判断用户选择的游戏难度
	if(btnChoose[0].style.background==''){
		gap=140;  //初级难度	
	}
	else if(btnChoose[1].style.background==''){
		gap=110;  //中级难度	
	}
	else if(btnChoose[2].style.background==''){
		gap=80;  //高级难度	
	}
	else{
		alert('请选择游戏难度~ (^_^)');
		return
	}
	
	//将开始按钮,banner等一些块隐藏
	this.style.display = "none";
	document.querySelector(".banner").style.display = "none";
	gameOver.style.display = "none";
	document.getElementById("menu").style.display = "none";
	
	initGame();
	timer = setInterval(startGame,24);
}


/**
 * 初中高游戏等级的选择按钮
 */
var btnChoose=document.querySelectorAll(".choose");
for (var i=0;i<btnChoose.length;i++) {
	btnChoose[i].style.background='gray';  //先将所有难度按钮变灰
	//定义难度按钮的点击事件
	btnChoose[i].onclick=function(){
		for (var j=0;j<btnChoose.length;j++) {
			btnChoose[j].style.background='gray';
		}
		this.style.background=''; //此难度被选中
	}
}

/**
 * 鼠标点击让鸟上升
 */
document.onclick=function(){
	//只有鸟还活着的时候才有效
	if(die==false){
		speedY = -4;
		rotate = -30;
	}
}

//按方向键上键也可让鸟上升
document.onkeydown=function(event){
	if(event.keyCode==38){
		//只有鸟还活着的时候才有效
		if(die==false){
			speedY = -4;
			rotate = -30;
		}
	}
}

/**
 * 游戏初始化函数
 */
function initGame(){
	//将之前所有的管道清除
	for (var i=0;i<barrier.length;i++) {
		barrier[i].oUl.remove();
	}
	//将鸟的位置初始化
	bird.style.top = "220px";
	bird.style.transform = "rotate(0)";
	
	//将回到主页按钮隐藏
	home.style.display = 'none';
	
	//分数复位
	document.querySelector(".score").children[0].src = "img/0.jpg";
	document.querySelector(".score").children[1].src = "";
	
	score = 0;   //将得分初始化
	barrier = []; //用于装入管道对象
	count = 99;  //累加,产生我需要的时间间隔
	bgFloorX = 0;  //底部草坪的背景图位置的x值
	speedY = 0;   //下落速度
	rotate = 0;   //头的旋转速度
	bIndex = 0;   //判断碰撞检测时管道对象数组的索引 
	die = false;  //死亡标记,false表示还活着
}

//回到主页的按钮
home.onclick=function(){
	initGame();
	document.getElementById("menu").style.display = "block";
	start.style.display = "block";
	document.querySelector(".banner").style.display = "block";
	gameOver.style.display = "none";
}

/* 产生一个指定范围的随机数
 * @start  number 随机数的开始值
 * @end    number 随机数的结束值
 * @return number start~end范围的随机数
 */
function Random(start,end){    
	return Math.random()*(end-start)+start;    
}