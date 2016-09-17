document.querySelector('.menu-control').addEventListener("click", menuControl);
document.querySelector('.home-music-control b').addEventListener("click", musicControl);



window.onload = function () {
	loadCss('css/style.css',function () {
		var loading = document.querySelector('.loading');

		loading.innerHTML = "<p>Bem-vindo</p>";
		setTimeout(function () {
			musicSinc();
			menuControl();
			parallaxLogo();
			loading.style.opacity = 0;
			setTimeout(function () {
				loading.style.display = 'none';
				document.querySelector('.home-logo').style.opacity = 1;
				musicControl();
			}, 500);
		}, 1000);
	});
}



window.onresize = function() {
	canvasD();
	parallaxLogo();
}



window.onscroll = function() {
	parallaxLogo();

	var slogan = document.querySelector('.slogan');
	var logo = document.querySelector('.home-logo');
	if (
		slogan.classList.contains('ini') && (
			scroll > (
				document.querySelector('.home').clientHeight +
				(slogan.clientHeight / 2) -
				(logo.clientHeight / 2) -
				parseInt(logo.style.top) +
				menuHeight
			)
		)
	) {
		slogan.classList.remove('ini');
	}
}



function loadCss(url, callback) {
	var css = document.createElement('link');
    css.setAttribute('type', "text/css" );
    css.setAttribute('rel', "stylesheet" );
    css.setAttribute('href', url );
	css.onload = callback;
    document.getElementsByTagName("head").item(0).appendChild(css);
}



function menuControl() {
	var master = document.querySelector('.master').classList;
	var menuControl = document.querySelector('.menu-control > b');
	var logoStyle = document.querySelector('.home-logo').style;
	if (master.contains('on-menu')) {
		master.remove('on-menu');
		menuHeight = 0;
		menuControl.innerHTML = '&#xf0c9;';
	} else {
		master.add('on-menu');
		menuHeight = parseInt(document.querySelector('.menu-control').clientHeight);
		menuControl.innerHTML = '&#xf00d;';
	}
	logoStyle.transition = 'top .5s';
	parallaxLogo();
	setTimeout(function () {
		logoStyle.transition = '';
	}, 500);
}



function musicSinc() {
	context = new AudioContext();
	analyser = context.createAnalyser();
	source = context.createMediaElementSource(document.querySelector('.home-music'));
	source.connect(analyser);
	analyser.connect(context.destination);
	frec_array = new Uint8Array(analyser.frequencyBinCount);
	homeBg = document.querySelector('.home-bg');
	canvasD();
	funcAnimation();
}



function musicControl() {
	var music = document.querySelector('.home-music');
	var musicControl = document.querySelector('.home-music-control b');

	if (music.paused) {
	 	music.play();
	 	musicControl.innerHTML =  "&#xf04c";
    } else {
    	music.pause();
	 	musicControl.innerHTML =  "&#xf04b";
    }
}



function canvasD() {
	homeBg.width = document.querySelector('.home').clientWidth;
	homeBg.height = document.querySelector('.home').clientHeight;
	widthEnd = homeBg.width;
	heightEnd = homeBg.height;
	widthCenter = widthEnd / 2;
	barSpace = widthEnd / (analyser.frequencyBinCount * 2);
}



function parallaxLogo() {
	scroll = window.pageYOffset;
	var home = document.querySelector('.home');
	var logo = document.querySelector('.home-logo');

	parallax(
		(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		home.clientHeight + menuHeight,
		"tl",
		logo,
		(homeBg.clientWidth / 2) - (logo.clientWidth / 2),
		(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		(home.clientWidth / 2) - (logo.clientWidth / 2),
		(window.innerHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		"px"
	);
}



function funcAnimation() {
	requestAnimationFrame(funcAnimation);

	analyser.getByteFrequencyData(frec_array);
	barInterval = 8;
	f = 0;
	d = 8;
	homeBg.getContext('2d').clearRect(0,0,widthEnd,heightEnd);
	homeBg.getContext('2d').fillStyle = 'rgba(' + parseInt(frec_array[f] / d) + ',' + parseInt((frec_array[f] / d) * (32 / 21)) + ',' + parseInt((frec_array[f] / d) * (54 / 21)) + ',' + (1 - (frec_array[f] / 500)) + ')';
	homeBg.getContext('2d').fillRect(0, 0, widthEnd, heightEnd);
	homeBg.getContext('2d').fillStyle = 'rgb(241, 228, 222)';
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