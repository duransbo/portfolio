/* GENERIC FUNCTIONS */
var getElement = function (id) {
	return document.querySelector(id);
};



var addEvent = function (id, event, func) {

	var elements = document.querySelectorAll(id);

	for (i = 0; i < elements.length; i++) {
		elements[i].addEventListener(event, func);
	}

};



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

};



var parallaxLogo = function () {

	var home = getElement('.home');
	var logo = getElement('.home-logo');

	menuHeight = getElement('.master').classList.contains('on-menu') ? 50 : 0;
	objScroll.parallax(
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

};
/* !GENERIC FUNCTIONS */



/* CLASSES */
var ClassLoad = function () {

	var self = this;



	self.css = function (prmUrl, prmCallback = function () {}) {

		var css = document.createElement('link');

		css.setAttribute('href', prmUrl );
		css.setAttribute('rel', "stylesheet" );
		css.setAttribute('type', "text/css" );
		css.onload = prmCallback;
		document.getElementsByTagName('head').item(0).appendChild(css);

	};



	self.js = function (prmUrl, prmCallback = function () {}) {

		var js = document.createElement('script');

		js.setAttribute('src', prmUrl );
		js.setAttribute('type', "text/javascript" );
		js.onload = prmCallback;
		document.getElementsByTagName('body').item(0).appendChild(js);

	};

};



var ClassScroll = function () {

	var self = this;



	self.y = function () {
		return window.scrollY;
	};



	self.go = function () {

		var id = this.href;
		var url = location.href;
		var seg = .5;
		var jumpProp = 25;
		var sub = getElement('.menu-control').clientHeight;
		var iniY = window.scrollY;
		var endY;
		var jumpNumber;
		var jumpSize;
		var jumpRest;
		var scrolling;
		var i;

		event.preventDefault();
		location.href = '#' + id.replace(url.replace(/#(\w*\/?)*/, ''), '');
		endY = window.scrollY - 70;
		jumpNumber = parseInt(Math.sqrt(Math.pow(endY - iniY, 2)) / jumpProp);
		if(jumpNumber >= 1){
			window.scrollTo(0, iniY);
			jumpSize =  parseInt(Math.sqrt(Math.pow(endY - iniY, 2)) / jumpNumber);
			jumpSizeRest = Math.sqrt(Math.pow(endY - iniY, 2)) - (jumpSize * jumpNumber);
			if(iniY > endY){
				jumpSize *= -1;
				jumpSizeRest *= -1;
			}
			i = jumpNumber;
			scrolling = setInterval(function () {
				if (i == 0) {
					window.scrollBy(0, jumpSizeRest);
					clearInterval(scrolling);
				} else {
					window.scrollBy(0, jumpSize);
					i--;
				}
			}, (seg * 1000) / jumpNumber);
		}

	};



	self.parallax = function (iniP,endP,type,div,iniX,iniY,endX,endY,un,unY=un) {

		var scroll = window.scrollY;

		if (scroll >= iniP && scroll <= endP) {
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
	};

};



var ClassMenu = function () {

	var self = this;
	var menu = getElement('.menu-control');
	var home = getElement('.home');
	var logo = getElement('.home-logo');
	var slogan = getElement('.slogan');
	var about = getElement('.about');
	var experience = getElement('.experience');



	self.color = function () {

		var scroll = window.scrollY;

		if (
			slogan.classList.contains('ini')
			&& scroll > home.clientHeight + (slogan.clientHeight / 2) - (logo.clientHeight / 2) - parseInt(logo.style.top) + menuHeight
		) {
			slogan.classList.remove('ini');
		}
		if (
			!menu.classList.contains('invert')
			&& (
				scroll > home.clientHeight + about.clientHeight + experience.clientHeight + (slogan.clientHeight * 2) - (menu.clientHeight / 2)
				|| (
					scroll > home.clientHeight - (menu.clientHeight / 2)
					&& scroll <= home.clientHeight + about.clientHeight + (slogan.clientHeight * 2) - (menu.clientHeight / 2)
				)
			)
		) {
			menu.classList.add('invert');
		} else if (
			menu.classList.contains('invert')
			&& (
				scroll <= home.clientHeight - (menu.clientHeight / 2)
				|| (
					scroll > home.clientHeight + about.clientHeight + (slogan.clientHeight * 2) - (menu.clientHeight / 2)
					&& scroll <= home.clientHeight + about.clientHeight + experience.clientHeight + (slogan.clientHeight * 2) - (menu.clientHeight / 2)
				)
			)
		) {
			menu.classList.remove('invert');
		}
	};

};



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

	};



	self.animation = function () {

		var frecInterval = 8;
		var frecColor = 0;
		var frecColorLim = 8;
		var i;
		var canvas = bg.getContext('2d');
		var grd = canvas.createLinearGradient(0, heightEnd - 10, 0, heightEnd - 255);

		requestAnimationFrame(self.animation);
		analyser.getByteFrequencyData(frecArray);
		canvas.clearRect(0, 0, widthEnd, heightEnd);
		canvas.fillStyle = 'rgba(' + parseInt(frecArray[frecColor] / frecColorLim) + ',' + parseInt((frecArray[frecColor] / frecColorLim) * (32 / 21)) + ',' + parseInt((frecArray[frecColor] / frecColorLim) * (54 / 21)) + ',' + (1 - (frecArray[frecColor] / 500)) + ')';
		canvas.fillRect(0, 0, widthEnd, heightEnd);
		grd.addColorStop(0,'rgba(241, 228, 222, 1)');
		grd.addColorStop(1,'rgba(241, 228, 222, 0)');
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



/* CODE */
var i;
var objLoad = new ClassLoad();
var objScroll = new ClassScroll();
var objMenu = new ClassMenu();
var objMusic = new ClassMusic();
/* !CODE */



/* EVENTS ADDED */
addEvent('.menu-control', 'click', menuControl);
addEvent('.home-music-control b', 'click', objMusic.play);
addEvent('.link-scroll', 'click', objScroll.go);
/* !EVENTS ADDED */



/* WINDOW EVENTS */
window.onload = function () {

	objLoad.css('css/files.css', function () {

		var loading = getElement('.loading');

		loading.innerHTML = "<p>Bem-vindo</p>";
		objMusic.create();
		objMusic.sinc();
		objMusic.sizing();
		objMusic.animation();
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

};



window.onresize = function () {

	objMusic.sizing();
	parallaxLogo();

};



window.onscroll = function () {

	parallaxLogo();
	objMenu.color();

};
/* !WINDOW EVENTS */