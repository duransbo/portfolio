document.getElementById('audio').volume = 1;
context = new AudioContext();
analyser = context.createAnalyser();
source = context.createMediaElementSource(document.getElementById('audio'));
source.connect(analyser);
analyser.connect(context.destination);
frec_array = new Uint8Array(analyser.frequencyBinCount);

canvasId = document.getElementById('home-bg');
canvas = canvasId.getContext('2d');
barInterval = 32;
canvasD();

window.onresize = function(){
	canvasD();
}

window.onscroll = function(){
	parallaxLogo();
}

function canvasD(){
	canvasId.width = document.getElementById('home').clientWidth - 1;
	canvasId.height = document.getElementById('home').clientHeight;
	widthEnd = canvasId.width;
	heightEnd = canvasId.height;
	widthCenter = widthEnd / 2;
	barSpace = widthEnd / (analyser.frequencyBinCount * 2);
}

function parallaxLogo(){
	parallax(
		0,
		document.getElementById('home').clientHeight,
		"tl",
		document.querySelector('.circle'),
		(document.getElementById('home').clientWidth / 2) - (document.querySelector('.circle').clientWidth / 2),
		(document.getElementById('home').clientHeight / 2) - (document.querySelector('.circle').clientHeight / 2),
		(document.getElementById('home').clientWidth / 2) - (document.querySelector('.circle').clientWidth / 2),
		(window.innerHeight / 2) - (document.querySelector('.circle').clientHeight / 2),
		"px"
	);
}

funcAnimation();

function funcAnimation(){
	requestAnimationFrame(funcAnimation);

	analyser.getByteFrequencyData(frec_array);
	canvas.fillStyle = 'rgb(' + parseInt(frec_array[0] / 8) + ',' + parseInt((frec_array[0] / 8) * (32 / 21)) + ',' + parseInt((frec_array[0] / 8) * (54 / 21)) + ')';
	canvas.fillRect(0, 0, widthEnd, heightEnd);
	canvas.fillStyle = '#f1e5df';
	canvas.beginPath();
	canvas.moveTo(widthCenter, heightEnd - frec_array[0]);
	for(i = 1; i < analyser.frequencyBinCount; i += barInterval){
		canvas.quadraticCurveTo(
			widthCenter + ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter + (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	canvas.lineTo(widthCenter + i, heightEnd);
	canvas.lineTo(widthCenter, heightEnd);
	canvas.moveTo(widthCenter, heightEnd - frec_array[0]);
	for(i = 1; i < analyser.frequencyBinCount; i += barInterval){
		canvas.quadraticCurveTo(
			widthCenter - ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter - (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	canvas.lineTo(widthCenter - i, heightEnd);
	canvas.lineTo(widthCenter, heightEnd);
	canvas.fill();
}

function parallax(iniP,endP,type,div,iniX,iniY,endX,endY,un,unY=un){
	scroll = window.pageYOffset || document.documentElement.scrollTop;
	if((scroll >= iniP) && (scroll <= endP)){
		move = ((scroll - iniP) * 100) / (endP - iniP);
		moveX = (iniX - (((iniX - endX) * move) / 100)) + un;
		moveY = (iniY - (((iniY - endY) * move) / 100)) + unY;

		switch(type){
			case 'bg':
				div.style.backgroundPosition = moveX + ' ' + moveY;
				break;

			case 'tl':
				div.style.top = moveY;
				div.style.left = moveX;
				break;

			default:
				alert('Type parallax|' + id + '| not valid');
				break;
		}
	}
}