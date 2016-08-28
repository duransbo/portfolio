document.querySelector('.home-music').volume = 1;
context = new AudioContext();
analyser = context.createAnalyser();
source = context.createMediaElementSource(document.querySelector('.home-music'));
source.connect(analyser);
analyser.connect(context.destination);
frec_array = new Uint8Array(analyser.frequencyBinCount);

homeBg = document.querySelector('.home-bg');
document.querySelector('.home-music-play').addEventListener("click", musicStart);

window.onload = function() {
	canvasD();
	funcAnimation();
	parallaxLogo();
	document.querySelector('.home-logo').style.opacity = 1;
}

window.onresize = function() {
	canvasD();
	parallaxLogo();
}

window.onscroll = function() {
	parallaxLogo();
}


function musicStart() {
	if (document.querySelector('.home-music').paused) {
	 	document.querySelector('.home-music').play();
	 	document.querySelector('.home-music-play').innerHTML =  "&#xf04c";
    } else {
    	document.querySelector('.home-music').pause();
	 	document.querySelector('.home-music-play').innerHTML =  "&#xf04b";
    }
}


function canvasD() {
	homeBg.width = document.querySelector('.home').clientWidth - 1;
	homeBg.height = document.querySelector('.home').clientHeight;
	widthEnd = homeBg.width;
	heightEnd = homeBg.height;
	widthCenter = widthEnd / 2;
	barSpace = widthEnd / (analyser.frequencyBinCount * 2);
}

function parallaxLogo() {
	parallax(
		(document.querySelector('.home').clientHeight / 2) - (document.querySelector('.home-logo').clientHeight / 2),
		document.querySelector('.home').clientHeight,
		"tl",
		document.querySelector('.home-logo'),
		(document.querySelector('.home').clientWidth / 2) - (document.querySelector('.home-logo').clientWidth / 2),
		(document.querySelector('.home').clientHeight / 2) - (document.querySelector('.home-logo').clientHeight / 2),
		(document.querySelector('.home').clientWidth / 2) - (document.querySelector('.home-logo').clientWidth / 2),
		(window.innerHeight / 2) - (document.querySelector('.home-logo').clientHeight / 2),
		"px"
	);
}

function funcAnimation() {
	requestAnimationFrame(funcAnimation);

	analyser.getByteFrequencyData(frec_array);
	barInterval = 8;
	f = 0;
	d = 8;
	homeBg.getContext('2d').fillStyle = 'rgb(' + parseInt(frec_array[f] / d) + ',' + parseInt((frec_array[f] / d) * (32 / 21)) + ',' + parseInt((frec_array[f] / d) * (54 / 21)) + ')';
	homeBg.getContext('2d').fillRect(0, 0, widthEnd, heightEnd);
	homeBg.getContext('2d').fillStyle = '#f1e5df';
	homeBg.getContext('2d').beginPath();
	homeBg.getContext('2d').moveTo(widthCenter, heightEnd - frec_array[0]);
	for (i = 1; i < analyser.frequencyBinCount; i += barInterval) {
		homeBg.getContext('2d').quadraticCurveTo(
			widthCenter + ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter + (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	homeBg.getContext('2d').lineTo(widthCenter + i, heightEnd);
	homeBg.getContext('2d').lineTo(widthCenter, heightEnd);
	homeBg.getContext('2d').moveTo(widthCenter, heightEnd - frec_array[0]);
	for (i = 1; i < analyser.frequencyBinCount; i += barInterval) {
		homeBg.getContext('2d').quadraticCurveTo(
			widthCenter - ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter - (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	homeBg.getContext('2d').lineTo(widthCenter - i, heightEnd);
	homeBg.getContext('2d').lineTo(widthCenter, heightEnd);
	homeBg.getContext('2d').fill();
}

function parallax(iniP,endP,type,div,iniX,iniY,endX,endY,un,unY=un) {

	scroll = window.pageYOffset || document.documentElement.scrollTop;
	if ((scroll >= iniP) && (scroll <= endP)) {
		move = ((scroll - iniP) * 100) / (endP - iniP);
		moveX = (iniX - (((iniX - endX) * move) / 100)) + un;
		moveY = (iniY - (((iniY - endY) * move) / 100)) + unY;
	} else if (scroll < iniP) {
		moveX = iniX + un;
		moveY = iniY + unY;
	} else {
		moveX = endX + un;
		moveY = endY + unY;
	}

	switch (type) {
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