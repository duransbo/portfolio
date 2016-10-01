/* CLASSES  */
var ClassMusic = function () {

	var self = this;
	var home = getElement('.home');
	var music = getElement('.home-music');
	var playButton = getElement('.home-music-control b');
	var bg;
	var widthEnd;
	var heightEnd;
	var widthCenter;
	var barSpace;
	var analyser;



	self.create = function () {

		var canvas = document.createElement('canvas');

		canvas.setAttribute('class', 'home-bg');
		home.appendChild(canvas);
		bg = getElement('.home-bg');

		self.sinc();

	};



	self.sizing = function () {
		bg.width = home.clientWidth;
		bg.height = home.clientHeight;
		widthEnd = bg.width;
		heightEnd = bg.height;
		widthCenter = widthEnd / 2;
		barSpace = widthEnd / (analyser.frequencyBinCount * 2);
	};



	self.sinc = function () {

		var context = new AudioContext();
		var source = context.createMediaElementSource(music);

		analyser = context.createAnalyser();
		source.connect(analyser);
		analyser.connect(context.destination);
		frecArray = new Uint8Array(analyser.frequencyBinCount);

		self.sizing();
		self.animation();

	};



	self.animation = function () {

		var	frecInterval = 8;
		var	frecColor = 0;
		var	frecColorLim = 8;
		var i;
		var canvas = bg.getContext('2d');
		var grd = canvas.createLinearGradient(0, heightEnd, 0, 0);


		requestAnimationFrame(self.animation);


		analyser.getByteFrequencyData(frecArray);


		canvas.clearRect(0, 0, widthEnd, heightEnd);
		canvas.fillStyle = 'rgba(' + parseInt(frecArray[frecColor] / frecColorLim) + ',' + parseInt((frecArray[frecColor] / frecColorLim) * (32 / 21)) + ',' + parseInt((frecArray[frecColor] / frecColorLim) * (54 / 21)) + ',' + (1 - (frecArray[frecColor] / 500)) + ')';
		canvas.fillRect(0, 0, widthEnd, heightEnd);
		grd.addColorStop(0,'rgb(241, 228, 222)');
		grd.addColorStop(1,'transparent');
		canvas.fillStyle = grd;
		canvas.beginPath();
		canvas.moveTo(widthCenter, heightEnd - frecArray[0]);
		for (i = 1; i < analyser.frequencyBinCount; i += frecInterval) {
			canvas.quadraticCurveTo(
				widthCenter + ((i - (frecInterval / 2)) * barSpace),
				heightEnd - frecArray[i] - ((frecArray[i - frecInterval] - frecArray[i]) / 2),
				widthCenter + (i * barSpace),
				heightEnd - frecArray[i]
			);
		}
		canvas.lineTo(widthCenter + i, heightEnd);
		canvas.lineTo(widthCenter, heightEnd);
		canvas.moveTo(widthCenter, heightEnd - frecArray[0]);
		for (i = 1; i < analyser.frequencyBinCount; i += frecInterval) {
			canvas.quadraticCurveTo(
				widthCenter - ((i - (frecInterval / 2)) * barSpace),
				heightEnd - frecArray[i] - ((frecArray[i - frecInterval] - frecArray[i]) / 2),
				widthCenter - (i * barSpace),
				heightEnd - frecArray[i]
			);
		}
		canvas.lineTo(widthCenter - i, heightEnd);
		canvas.lineTo(widthCenter, heightEnd);
		canvas.fill();

	};



	self.play = function () {
		if (music.paused) {
		 	music.play();
		 	playButton.innerHTML =  "&#xf04c";
	    } else {
	    	music.pause();
		 	playButton.innerHTML =  "&#xf04b";
	    }
	};

};
/* !CLASSES */



/* FUNCTIONS */
var loadCss = function (url, callback = function () {}) {
	var css = document.createElement('link');
    css.setAttribute('type', "text/css" );
    css.setAttribute('rel', "stylesheet" );
    css.setAttribute('href', url );
	css.onload = callback;
    document.getElementsByTagName('head').item(0).appendChild(css);
}



var getElement = function (id) {
	return document.querySelector(id);
}



var menuControl = function () {
	var master = getElement('.master').classList;
	var menuControl = getElement('.menu-control > b');
	var logoStyle = getElement('.home-logo').style;
	master.toggle('on-menu');
	menuControl.innerHTML = master.contains('on-menu') ? '&#xf00d;' : '&#xf0c9;';
	logoStyle.transition = 'top .5s';
	parallaxLogo();
	setTimeout(function () {
		logoStyle.transition = '';
	}, 500);
}



var parallaxLogo = function () {
	scroll = window.pageYOffset;
	menuHeight = getElement('.master').classList.contains('on-menu') ? 50 : 0;
	var home = getElement('.home');
	var logo = getElement('.home-logo');

	parallax(
		(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		home.clientHeight + menuHeight,
		"tl",
		logo,
		(home.clientWidth / 2) - (logo.clientWidth / 2),
		(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		(home.clientWidth / 2) - (logo.clientWidth / 2),
		(window.innerHeight / 2) - (logo.clientHeight / 2) + menuHeight,
		"px"
	);
}



var parallax = function (iniP,endP,type,div,iniX,iniY,endX,endY,un,unY=un) {

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
/* !FUNCTIONS */



/* CODE */
var objMusic = new ClassMusic();
/* !CODE */



/* WINDOW EVENTS */
window.onload = function () {
	loadCss('css/style.css', function () {
		var loading = getElement('.loading');

		loading.innerHTML = "<p>Bem-vindo</p>";
		objMusic.create();
		parallaxLogo();
		setTimeout(function () {
			loading.style.opacity = 0;
			setTimeout(function () {
				loading.style.display = 'none';
				getElement('.home-logo').style.opacity = 1;
				objMusic.play();
			}, 500);
		}, 500);
	});
}



window.onresize = function () {
	objMusic.sizing();
	parallaxLogo();
}



window.onscroll = function () {
	parallaxLogo();

	var menu = getElement('.menu-control');
	var home = getElement('.home');
	var logo = getElement('.home-logo');
	var slogan = getElement('.slogan');

	if (
		slogan.classList.contains('ini') && (
			scroll > (
				home.clientHeight +
				(slogan.clientHeight / 2) -
				(logo.clientHeight / 2) -
				parseInt(logo.style.top) +
				menuHeight
			)
		)
	) {
		slogan.classList.remove('ini');
	}
	if (!menu.classList.contains('invert') && (scroll > home.clientHeight - (menu.clientHeight / 2))) {
		menu.classList.add('invert');
	} else if (menu.classList.contains('invert') && (scroll <= home.clientHeight - (menu.clientHeight / 2))) {
		menu.classList.remove('invert');
	}
}
/* !WINDOW EVENTS */



/* ADD EVENTS */
getElement('.menu-control').addEventListener("click", menuControl);
getElement('.home-music-control b').addEventListener("click", objMusic.play);
/* !ADD EVENTS */