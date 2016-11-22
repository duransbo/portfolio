/* GENERIC FUNCTIONS */
var funcGetElement = function (prmId) {
	return document.querySelector(prmId);
};



var funcAddEvent = function (prmId, prmEvent, prmFunc) {

	var elements = document.querySelectorAll(prmId);
	var i;

	for (i = 0; i < elements.length; i++) {
		elements[i].addEventListener(prmEvent, prmFunc);
	}

};
/* !GENERIC FUNCTIONS */



/* CLASSES */
var ClassLoad = function () {

	var mtdCss = function (prmUrl, prmCallback = function () {}) {

		var css = document.createElement('link');

		css.setAttribute('href', prmUrl );
		css.setAttribute('rel', "stylesheet" );
		css.setAttribute('type', "text/css" );
		css.onload = prmCallback;
		document.getElementsByTagName('head').item(0).appendChild(css);

	};



	var mtdJs = function (prmUrl, prmCallback = function () {}) {

		var js = document.createElement('script');

		js.setAttribute('src', prmUrl );
		js.setAttribute('type', "text/javascript" );
		js.onload = prmCallback;
		document.getElementsByTagName('body').item(0).appendChild(js);

	};



	return {
		css : mtdCss,
		js : mtdJs
	};
};



var ClassScroll = function () {

	var mtdY = function () {
		return window.scrollY;
	};



	var mtdGo = function (e) {

		var id = this.href;
		var url = location.href;
		var seg = .5;
		var jumpProp = 25;
		var sub = funcGetElement('.menu-control').clientHeight;
		var prmIniY = window.scrollY;
		var prmEndY;
		var jumpNumber;
		var jumpSize;
		var jumpRest;
		var interval;
		var i;

		var scrolling = function () {
			if (i == 0) {
				window.scrollBy(0, jumpSizeRest);
				clearInterval(interval);
			} else {
				window.scrollBy(0, jumpSize);
				i--;
			}
		}

		e.preventDefault();
		location.href = '#' + id.replace(url.replace(/#(\w*\/?)*/, ''), '');
		prmEndY = window.scrollY - sub;
		jumpNumber = parseInt(Math.sqrt(Math.pow(prmEndY - prmIniY, 2)) / jumpProp);
		if (jumpNumber >= 1) {
			window.scrollTo(0, prmIniY);
			jumpSize =  parseInt(Math.sqrt(Math.pow(prmEndY - prmIniY, 2)) / jumpNumber);
			jumpSizeRest = Math.sqrt(Math.pow(prmEndY - prmIniY, 2)) - (jumpSize * jumpNumber);
			if (prmIniY > prmEndY) {
				jumpSize *= -1;
				jumpSizeRest *= -1;
			}
			i = jumpNumber;
			interval = setInterval(scrolling, (seg * 1000) / jumpNumber);
		}

	};



	var mtdParallax = function (prmId, prmType, prmIniParallax, prmEndParallax, prmIniX, prmIniY, prmEndX, prmEndY, prmUni, prmUniY = prmUni) {

		var scroll = window.scrollY;
		var move;
		var moveX;
		var moveY;

		if (
			scroll >= prmIniParallax
			&& scroll <= prmEndParallax
		) {
			move = ((scroll - prmIniParallax) * 100) / (prmEndParallax - prmIniParallax);
			moveX = (prmIniX - (((prmIniX - prmEndX) * move) / 100)) + prmUni;
			moveY = (prmIniY - (((prmIniY - prmEndY) * move) / 100)) + prmUniY;
		} else if (scroll < prmIniParallax) {
			moveX = prmIniX + prmUni;
			moveY = prmIniY + prmUniY;
		} else {
			moveX = prmEndX + prmUni;
			moveY = prmEndY + prmUniY;
		}

		switch (prmType) {
			case 'bg':
				prmId.style.backgroundPosition = moveX + ' ' + moveY;
				break;

			case 'tl':
				prmId.style.top = moveY;
				prmId.style.left = moveX;
				break;

		   default:
				alert('Type parallax|' + prmId + '| not valid');
				break;
		}
	};



	return {
		y : mtdY,
		go : mtdGo,
		parallax : mtdParallax
	};
};



var ClassLogo = function () {

	var mtdEffect = function () {

		var home = funcGetElement('.home');
		var logo = funcGetElement('.home-logo');
		var menuHeight = funcGetElement('.master').classList.contains('on-menu') ? 50 : 0;
		var objScroll = new ClassScroll();

		objScroll.parallax(
			logo,
			'tl',
			(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
			home.clientHeight + menuHeight,
			(home.clientWidth / 2) - (logo.clientWidth / 2),
			(home.clientHeight / 2) - (logo.clientHeight / 2) + menuHeight,
			(home.clientWidth / 2) - (logo.clientWidth / 2),
			(window.innerHeight / 2) - (logo.clientHeight / 2) + menuHeight,
			"px"
		);

	};



	return {
		effect : mtdEffect
	};
};



var ClassMenu = function () {

	var atrMenu = funcGetElement('.menu-control');
	var atrHome = funcGetElement('.home');
	var atrLogo = funcGetElement('.home-logo');
	var atrSlogan = funcGetElement('.slogan.first');
	var atrAbout = funcGetElement('.about');
	var atrExperience = funcGetElement('.experiences');
	var atrMenuHeight = 0;



	var mtdControl = function () {

		var master = funcGetElement('.master').classList;
		var menuButton = funcGetElement('.menu-control');
		var logoStyle = atrLogo.style;
		var objLogo = new ClassLogo();

		var logoReset = function () {
			logoStyle.transition = '';
		};

		if (master.contains('on-menu')) {
			master.remove('on-menu');
			atrMenuHeight = 50;
			menuButton.innerHTML = '&#xf0c9;';
		} else {
			master.add('on-menu');
			atrMenuHeight = 0;
			menuButton.innerHTML = '&#xf00d;';
		}
		logoStyle.transition = 'top .5s';
		objLogo.effect();
		setTimeout(logoReset, 500);

	};



	var mtdColor = function () {

		var scroll = window.scrollY;

		if (scroll > atrHome.clientHeight + (atrSlogan.clientHeight / 2) - (atrLogo.clientHeight / 2) - parseInt(atrLogo.style.top) + atrMenuHeight) {
			atrSlogan.classList.remove('ini');
		}
		if (
			!atrMenu.classList.contains('invert')
			&& (
				scroll > atrHome.clientHeight - (atrMenu.clientHeight / 2)
				&& scroll <= atrHome.clientHeight + atrAbout.clientHeight + atrSlogan.clientHeight - (atrMenu.clientHeight / 2)
			)
		) {
			atrMenu.classList.add('invert');
		} else if (
			atrMenu.classList.contains('invert')
			&& (
				scroll <= atrHome.clientHeight - (atrMenu.clientHeight / 2)
				|| scroll > atrHome.clientHeight + atrAbout.clientHeight + atrSlogan.clientHeight - (atrMenu.clientHeight / 2)
			)
		) {
			atrMenu.classList.remove('invert');
		}
	};



	return {
		control : mtdControl,
		color : mtdColor
	};
};



var ClassMusic = function () {

	var atrHome = funcGetElement('.home');
	var atrHomeMusic = funcGetElement('.home-music');
	var atrPlayButton = funcGetElement('.home-music-control b');
	var atrHomeBg;
	var atrCanvas;
	var atrWidthEnd;
	var atrHeightEnd;
	var atrWidthCenter;
	var atrFrecNumber;
	var atrFrecAnalyser;
	var atrFrecArray;



	var mtdCreate = function () {

		var canvas = document.createElement('canvas');

		canvas.setAttribute('class', 'home-bg');
		atrHome.appendChild(canvas);
		atrHomeBg = funcGetElement('.home-bg');
		atrCanvas = atrHomeBg.getContext('2d');

	};



	var mtdSinc = function () {

		var context = new AudioContext();
		var source = context.createMediaElementSource(atrHomeMusic);

		atrFrecAnalyser = context.createAnalyser();
		source.connect(atrFrecAnalyser);
		atrFrecAnalyser.connect(context.destination);
		atrFrecArray = new Uint8Array(atrFrecAnalyser.frequencyBinCount);

	};



	var mtdSizing = function () {

		atrHomeBg.width = atrHome.clientWidth;
		atrHomeBg.height = atrHome.clientHeight;
		atrWidthEnd = atrHomeBg.width;
		atrHeightEnd = atrHomeBg.height;
		atrWidthCenter = atrWidthEnd / 2;
		atrFrecNumber = atrWidthEnd / (atrFrecAnalyser.frequencyBinCount * 2);

	};



	var mtdAnimation = function () {

		requestAnimationFrame(mtdAnimation);

		atrCanvas.clearRect(0, 0, atrWidthEnd, atrHeightEnd);
		if (!atrHomeMusic.paused) {

			var frecInterval = 8;
			var frecColor = 0;
			var frecColorLim = 16;
			var grd = atrCanvas.createLinearGradient(0, atrHeightEnd - 10, 0, atrHeightEnd - 255);
			var i;

			atrFrecAnalyser.getByteFrequencyData(atrFrecArray);
			atrCanvas.fillStyle = 'rgba(' + parseInt(atrFrecArray[frecColor] / frecColorLim) + ',' + parseInt((atrFrecArray[frecColor] / frecColorLim) * (32 / 21)) + ',' + parseInt((atrFrecArray[frecColor] / frecColorLim) * (54 / 21)) + ',' + (1 - (atrFrecArray[frecColor] / 500)) + ')';
			atrCanvas.fillRect(0, 0, atrWidthEnd, atrHeightEnd);
			grd.addColorStop(0,'rgba(241, 228, 222, 1)');
			grd.addColorStop(1,'rgba(241, 228, 222, 0)');
			atrCanvas.fillStyle = grd;
			atrCanvas.beginPath();
			atrCanvas.moveTo(atrWidthCenter, atrHeightEnd - atrFrecArray[0]);
			for (i = 0; i < atrFrecAnalyser.frequencyBinCount; i += frecInterval) {
				atrCanvas.quadraticCurveTo(
					atrWidthCenter + ((i - (frecInterval / 2)) * atrFrecNumber),
					atrHeightEnd - atrFrecArray[i] - ((atrFrecArray[i - frecInterval] - atrFrecArray[i]) / 2),
					atrWidthCenter + (i * atrFrecNumber),
					atrHeightEnd - atrFrecArray[i]
				);
			}
			atrCanvas.lineTo(atrWidthCenter + i, atrHeightEnd);
			atrCanvas.lineTo(atrWidthCenter, atrHeightEnd);
			atrCanvas.moveTo(atrWidthCenter, atrHeightEnd - atrFrecArray[0]);
			for (i = 0; i < atrFrecAnalyser.frequencyBinCount; i += frecInterval) {
				atrCanvas.quadraticCurveTo(
					atrWidthCenter - ((i - (frecInterval / 2)) * atrFrecNumber),
					atrHeightEnd - atrFrecArray[i] - ((atrFrecArray[i - frecInterval] - atrFrecArray[i]) / 2),
					atrWidthCenter - (i * atrFrecNumber),
					atrHeightEnd - atrFrecArray[i]
				);
			}
			atrCanvas.lineTo(atrWidthCenter - i, atrHeightEnd);
			atrCanvas.lineTo(atrWidthCenter, atrHeightEnd);
			atrCanvas.fill();
		}

	};



	var mtdPlay = function () {
		if (atrHomeMusic.paused) {
		 	atrHomeMusic.play();
		 	atrPlayButton.innerHTML =  "&#xf04c";
			atrHomeBg.style.opacity = 1;
		} else {
			atrHomeMusic.pause();
			atrPlayButton.innerHTML =  "&#xf04b";
			atrHomeBg.style.opacity = .5;
		}
	};



	return {
		create : mtdCreate,
		sinc : mtdSinc,
		sizing : mtdSizing,
		animation : mtdAnimation,
		play : mtdPlay
	};
};
/* !CLASSES */



/* CODE */
var i;
var objLoad = new ClassLoad();
var objScroll = new ClassScroll();
var objMenu = new ClassMenu();
var objLogo = new ClassLogo();
var objMusic = new ClassMusic();
/* !CODE */



/* EVENTS ADDED */
funcAddEvent('.menu-control', 'click', objMenu.control);
funcAddEvent('.home-music-control b', 'click', objMusic.play);
funcAddEvent('.link-scroll', 'click', objScroll.go);
/* !EVENTS ADDED */



/* WINDOW EVENTS */
window.onload = function () {

	var loadFiles = function () {

		var loading = funcGetElement('.loading');

		var offLoading = function () {

			var show = function () {
				loading.style.display = 'none';
				funcGetElement('.home-logo').style.opacity = 1;
				objMusic.play();
			}

			loading.style.opacity = 0;
			setTimeout(show, 500);

		};

		loading.innerHTML = "<p>Bem-vindo</p>";
		objMusic.create();
		objMusic.sinc();
		objMusic.sizing();
		objMusic.animation();
		objLogo.effect();
		setTimeout(offLoading, 500);

	};

	objLoad.css('asset/css/files.css', loadFiles);

};



window.onresize = function () {

	objMusic.sizing();
	objLogo.effect();

};



window.onscroll = function () {

	objMenu.color();
	objLogo.effect();
	objScroll.parallax(funcGetElement('.home'), 'bg', 0, funcGetElement('.home').clientHeight, 50, -100, 50, 200, '%', 'px');

};
/* !WINDOW EVENTS */