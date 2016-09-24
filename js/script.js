getElement('.menu-control').addEventListener("click", menuControl);
getElement('.home-music-control b').addEventListener("click", musicControl);



window.onload = function () {
	loadCss('css/base.css');
	loadCss('css/style.css', function () {
		var loading = getElement('.loading');

		loading.innerHTML = "<p>Bem-vindo</p>";
		musicSinc();
		menuControl();
		setTimeout(function () {
			loading.style.opacity = 0;
			setTimeout(function () {
				loading.style.display = 'none';
				getElement('.home-logo').style.opacity = 1;
				musicControl();
			}, 500);
		}, 500);
	});
}



window.onresize = function () {
	canvasD();
	parallaxLogo();
}



window.onscroll = function () {
	parallaxLogo();

	var slogan = getElement('.slogan');
	var logo = getElement('.home-logo');
	if (
		slogan.classList.contains('ini') && (
			scroll > (
				getElement('.home').clientHeight +
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



function loadCss(url, callback = function () {}) {
	var css = document.createElement('link');
    css.setAttribute('type', "text/css" );
    css.setAttribute('rel', "stylesheet" );
    css.setAttribute('href', url );
	css.onload = callback;
    document.getElementsByTagName('head').item(0).appendChild(css);
}



function menuControl() {
	var master = getElement('.master').classList;
	var menuControl = getElement('.menu-control > b');
	var logoStyle = getElement('.home-logo').style;
	if (master.contains('on-menu')) {
		master.remove('on-menu');
		menuHeight = 0;
		menuControl.innerHTML = '&#xf0c9;';
	} else {
		master.add('on-menu');
		menuHeight = parseInt(getElement('.menu-control').clientHeight);
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
	source = context.createMediaElementSource(getElement('.home-music'));
	source.connect(analyser);
	analyser.connect(context.destination);
	frec_array = new Uint8Array(analyser.frequencyBinCount);
	homeBg = getElement('.home-bg');
	canvasD();
	funcAnimation();
}



function musicControl() {
	var music = getElement('.home-music');
	var musicControl = getElement('.home-music-control b');

	if (music.paused) {
	 	music.play();
	 	musicControl.innerHTML =  "&#xf04c";
    } else {
    	music.pause();
	 	musicControl.innerHTML =  "&#xf04b";
    }
}



function canvasD() {
	homeBg.width = getElement('.home').clientWidth;
	homeBg.height = getElement('.home').clientHeight;
	widthEnd = homeBg.width;
	heightEnd = homeBg.height;
	widthCenter = widthEnd / 2;
	barSpace = widthEnd / (analyser.frequencyBinCount * 2);
}



function parallaxLogo() {
	scroll = window.pageYOffset;
	var home = getElement('.home');
	var logo = getElement('.home-logo');

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
	canvasCtx = homeBg.getContext('2d');
	canvasCtx.clearRect(0,0,widthEnd,heightEnd);
	canvasCtx.fillStyle = 'rgba(' + parseInt(frec_array[f] / d) + ',' + parseInt((frec_array[f] / d) * (32 / 21)) + ',' + parseInt((frec_array[f] / d) * (54 / 21)) + ',' + (1 - (frec_array[f] / 500)) + ')';
	canvasCtx.fillRect(0, 0, widthEnd, heightEnd);
	canvasCtx.fillStyle = 'rgb(241, 228, 222)';
	canvasCtx.beginPath();
	canvasCtx.moveTo(widthCenter, heightEnd - frec_array[0]);
	for (i = 1; i < analyser.frequencyBinCount; i += barInterval) {
		canvasCtx.quadraticCurveTo(
			widthCenter + ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter + (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	canvasCtx.lineTo(widthCenter + i, heightEnd);
	canvasCtx.lineTo(widthCenter, heightEnd);
	canvasCtx.moveTo(widthCenter, heightEnd - frec_array[0]);
	for (i = 1; i < analyser.frequencyBinCount; i += barInterval) {
		canvasCtx.quadraticCurveTo(
			widthCenter - ((i - (barInterval / 2)) * barSpace),
			heightEnd - frec_array[i] - ((frec_array[i - barInterval] - frec_array[i]) / 2),
			widthCenter - (i * barSpace),
			heightEnd - frec_array[i]
		);
	}
	canvasCtx.lineTo(widthCenter - i, heightEnd);
	canvasCtx.lineTo(widthCenter, heightEnd);
	canvasCtx.fill();
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



function getElement(id) {
	return document.querySelector(id);
}