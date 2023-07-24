const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const colormap = require('colormap');
const interpolate = require('color-interpolate');


const colors = colormap({
	colormap: 'salinity',
	nshades: 500,
});


export default class DeJongPoint {
	constructor(param, width, height, numDeJongPoint) {
		this.width = width;
		this.height = height;
		this.param = param;
		this.numDeJongPoint = numDeJongPoint;

		this.points = []
		this.stockDeJongPoint();

	}

	stockDeJongPoint() {
		console.log("stockDeJongPoint for parameters: " + this.param.a + " " + this.param.b + " " + this.param.c + " " + this.param.d);
		// calculate and stock the points for each set of parameters 
		let x = 0;
		let y = 0;
		let newX, newY;
		let minX = Number.POSITIVE_INFINITY;
		let maxX = Number.NEGATIVE_INFINITY;
		let minY = Number.POSITIVE_INFINITY;
		let maxY = Number.NEGATIVE_INFINITY;
		let pts = [];
		for (let i = 0; i < this.numDeJongPoint; i++) {
			// console.log("one x: " + x + " y: " + y);
			newX = Math.sin(this.param.a * y) - Math.cos(this.param.b * x);
			newY = Math.sin(this.param.c * x) - Math.cos(this.param.d * y);
			x = newX;
			y = newY;
			minX = Math.min(minX, x);
			maxX = Math.max(maxX, x);
			minY = Math.min(minY, y);
			maxY = Math.max(maxY, y);
			pts.push({ x: x, y: y });
		}
		// calculate scale_x et scale_y 
		const deltaX = maxX - minX;
		const scale_x = (0.8 * this.width) / Math.max(deltaX, 1);
		const deltaY = maxY - minY;
		const scale_y = (0.8 * this.height) / Math.max(deltaY, 1);

		// get the center of the points
		const centerX = (minX + maxX) / 2;
		const centerY = (minY + maxY) / 2;

		// console.log("minX: " + minX + " maxX: " + maxX + " minY: " + minY + " maxY: " + maxY);
		// console.log("deltaX: " + deltaX + " deltaY: " + deltaY);
		// console.log("scale_x: " + scale_x + " scale_y: " + scale_y);

		// scale according to the dimension and 0.0
		pts.forEach((point) => {
			point.x = (point.x - centerX) * scale_x + this.width * 0.5;
			point.y = (point.y - centerY) * scale_y + this.height * 0.5;
		});

		this.points = pts;
	}

	draw(context) {
		console.log("draw de jong points");
		context.save();
		context.globalAlpha = 1;
		context.fillStyle = "black";
		// context.translate(this.width * 0.5, this.height * 0.5);
		const r = 1;

		this.points.forEach((point) => {
			// context.fillStyle = random.pick(colors);
			context.beginPath();
			context.arc(point.x, point.y, r, 0, Math.PI * 2);
			context.fill();
		});
		context.restore();
	}

}