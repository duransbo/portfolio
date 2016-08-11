context = new AudioContext();
analyser = context.createAnalyser();
source = context.createMediaElementSource(document.getElementById('audio'));
source.connect(analyser);
analyser.connect(context.destination);
frec_array = new Uint8Array(analyser.frequencyBinCount);

canvasId = document.getElementById('home-bg');
canvas = canvasId.getContext('2d');
barInterval = 3;
canvasD();

window.onresize = function(){
	canvasD();
}

function canvasD(){
	canvasId.width = document.getElementById('home').clientWidthz - 1;
	canvasId.height = document.getElementById('home').clientHeight;
	widthEnd = canvasId.width;
	heightEnd = canvasId.height;
	widthCenter = widthEnd / 2;
	barSpace = widthEnd / (analyser.frequencyBinCount * 2);
}

funcAnimation();

function funcAnimation(){
	requestAnimationFrame(funcAnimation);

	analyser.getByteFrequencyData(frec_array);
	canvas.fillStyle = 'rgb(' + parseInt(frec_array[0] / 10) + ',' + parseInt(frec_array[0] / 10) + ',' + parseInt(frec_array[0] / 10) + ')';
	canvas.fillRect(0, 0, widthEnd, heightEnd);
	canvas.fillStyle = '#fff';
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