const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const colormap = require('colormap');
const interpolate = require('color-interpolate');


const colors = colormap({
	colormap: 'salinity',
	nshades: 1000,
});


export default class Particle {
	constructor(x, y, width, height) {
		this.width = width;
		this.height = height;

		// aspect
		this.radius = 1;
		// this.color = colors[0]
		this.color = random.pick(colors);
		// this.color = "red"
		this.colorsIndex = 0;

		// position
		this.x = x;
		this.y = y;

		// acceleration
		this.ax = 0;
		this.ay = 0;

		// velocity
		this.vx = 0;
		this.vy = 0;
	}

	edge() {
		if (this.x > this.width) {
			this.x = 0;
		}
		else if (this.x < 0) {
			this.x = this.width;
		}
		if (this.y > this.height) {
			this.y = 0;
		}
		else if (this.y < 0) {
			this.y = this.height;
		}
	}

	randomAcceleration() {
		this.ax = random.range(0, 1);
		this.ay = random.range(0, 1);
	}

	attracted(point) {
		const dx = point.x - this.x;
		const dy = point.y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const forceMagnitude = 0.4 / distance;
		const fx = dx * forceMagnitude;
		const fy = dy * forceMagnitude;
		this.ax += fx;
		this.ay += fy;
	}

	update() {
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= 0.95;
		this.vy *= 0.95 ;
		this.ax = 0;
		this.ay = 0;
		// parcours les couleurs au fur et a mesures
		// this.colorsIndex += 1;
		// if (this.colorsIndex >= colors.length) {
		// 	this.colorsIndex = 0;
		// }
		// this.color = colors[this.colorsIndex];

	}

	draw(context) {
		context.save();
		// context.translate(this.width * 0.5, this.height * 0.5);
		context.fillStyle = this.color;
		context.globalAlpha = 1;

		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		context.fill();
		context.restore();
		this.edge();
	}

}