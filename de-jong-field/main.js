const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random.js');
const math = require('canvas-sketch-util/math.js');
const colormap = require('colormap');
const interpolate = require('color-interpolate');
import DeJongPoint from './DeJongPoint.js';
import Particle from './Particle.js'
const Tweakpane = require('tweakpane');

const settings = {
	// dimensions: [window.innerWidth, window.innerHeight],
	dimensions: [1080, 1080],
	animate: true
};

const colors = colormap({
	colormap: 'salinity',
	nshades: 500
});

const cursor = { x: 0, y: 0 };
let elCanvas;

// global variables
const numDeJongPoint = 6000;
const r = 1;
const timeChange = 10 * 60;
let timeLeft = timeChange;
let indexDeJong = 0;
let frotFactor = 0.9;

let deJongPoints = [];

// list of set of parameters a, b, c, d for de jong points
const abcd_params = [
	{ a: 1.641, b: 1.902, c: 0.316, d: 1.525 },
	{ a: 0.970, b: -1.899, c: 1.381, d: -1.506 },
	{ a: 1.4, b: -2.3, c: 2.4, d: -2.1 },
	{ a: 2.01, b: -2.53, c: 1.61, d: -0.33 },
	{ a: -2.7, b: -0.09, c: -0.86, d: -2.2 },
	{ a: -0.827, b: -1.637, c: 1.659, d: -0.943 },
	{ a: -2.24, b: 0.43, c: -0.65, d: -2.43 },
	{ a: -2, b: -2, c: -1.2, d: 2 },
	{ a: -0.709, b: 1.638, c: 0.452, d: 1.740 }
];

const sketch = ({ context, width, height, canvas }) => {

	// interaction with mouse
	elCanvas = canvas;
	canvas.addEventListener('mousemove', onMouseMove);
	const factor = 1000;

	// background
	context.fillStyle = '#EEEAE0';
	context.fillRect(0, 0, width, height);

	// stock de jong points
	stockDeJongPoints(abcd_params, width, height);

	// init random_points and particles
	let random_points = [];
	let particles = [];
	for (let i = 0; i < numDeJongPoint; i++) {
		const random_point = { x: random.range(0, width), y: random.range(0, height)};
		random_points.push(random_point);
		particles.push(new Particle(random_point.x, random_point.y, width, height));
	}

	return ({ context, width, height }) => {
		// background
		context.fillStyle = '#EEEAE0';
		context.fillRect(0, 0, width, height);

		// deJongPoints[indexDeJong].draw(context);

		// particles are attracted to the de jong matrice
		if (timeLeft > timeChange * 0.5) {
			for (let i = 0; i < numDeJongPoint; i++) {
				particles[i].attracted(deJongPoints[indexDeJong].points[i]);
				particles[i].update();
				particles[i].draw(context);
			}
		}

		// particles are attracted to a random matrice
		if (timeLeft <= timeChange * 0.5 && timeLeft > 0) {
			for (let i = 0; i < numDeJongPoint; i++) {
				particles[i].attracted(random_points[i]);
				particles[i].update();
				particles[i].draw(context);
			}
		}

		if (timeLeft <= 0) {
			// randomize random_points
			random_points.forEach((point) => {
				point.x = random.range(0, width);
				point.y = random.range(0, height);
			});
			// change de jong set
			indexDeJong = (indexDeJong + 1) % abcd_params.length;
			// re init timeLeft
			timeLeft = timeChange;
		}

		timeLeft--;
	};
}

// functions part

const stockDeJongPoints = (abcd_params, width, height) => {
	// calculate and stock the points for each set of parameters 
	abcd_params.forEach((param) => {
		let deJongPoint = new DeJongPoint(param, width, height, numDeJongPoint);
		deJongPoints.push(deJongPoint);
	});
};



const nextDeJong = (context) => {

};


const onMouseMove = (e) => {
	const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
	cursor.x = x;
	cursor.y = y;
};


const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;
	folder = pane.addFolder({ title: 'parameters' });
	folder.addInput(params, 'a', { min: -3, max: +3, step: 0.01 });
	folder.addInput(params, 'b', { min: -3, max: +3, step: 0.01 });
	folder.addInput(params, 'c', { min: -3, max: +3, step: 0.01 });
	folder.addInput(params, 'd', { min: -3, max: +3, step: 0.01 });
};

// createPane();
canvasSketch(sketch, settings);


