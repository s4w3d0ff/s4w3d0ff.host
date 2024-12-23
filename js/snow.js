const canvas = document.getElementById('snow-canvas');
const ctx = canvas.getContext('2d');
const windControl = document.getElementById('wind');
const sizeControl = document.getElementById('size');
const speedControl = document.getElementById('speed');
const accumulationControl = document.getElementById('accumulation');
const meltingControl = document.getElementById('melting');
const smoothingControl = document.getElementById('smoothing');
const spreadControl = document.getElementById('spread');
const turbulenceSpeedControl = document.getElementById('turbulence-speed');
const turbulenceAmplitudeControl = document.getElementById('turbulence-amplitude');

const windValue = document.getElementById('wind-value');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const accumulationValue = document.getElementById('accumulation-value');
const meltingValue = document.getElementById('melting-value');
const smoothingValue = document.getElementById('smoothing-value');
const spreadValue = document.getElementById('spread-value');
const turbulenceSpeedValue = document.getElementById('turbulence-speed-value');
const turbulenceAmplitudeValue = document.getElementById('turbulence-amplitude-value');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let wind = parseFloat(windControl.value);
let snowflakeSize = parseFloat(sizeControl.value);
let snowfallSpeed = parseFloat(speedControl.value);
let accumulationAmount = parseFloat(accumulationControl.value);
let meltingRate = parseFloat(meltingControl.value);
let smoothingFrequency = parseFloat(smoothingControl.value);
let spreadRadius = parseInt(spreadControl.value);
let turbulenceSpeed = parseInt(turbulenceSpeedControl.value);
let turbulenceAmplitude = parseFloat(turbulenceAmplitudeControl.value);

const snowflakes = [];
let groundHeights = Array(canvas.width).fill(0);

const updateSliderValue = (slider, display, onChange) => {
  slider.addEventListener('input', () => {
    display.textContent = slider.value;
    onChange(slider.value);
  });
};

updateSliderValue(windControl, windValue, (value) => wind = parseFloat(value));
updateSliderValue(sizeControl, sizeValue, (value) => snowflakeSize = parseFloat(value));
updateSliderValue(speedControl, speedValue, (value) => snowfallSpeed = parseFloat(value));
updateSliderValue(accumulationControl, accumulationValue, (value) => accumulationAmount = parseFloat(value));
updateSliderValue(meltingControl, meltingValue, (value) => meltingRate = parseFloat(value));
updateSliderValue(smoothingControl, smoothingValue, (value) => smoothingFrequency = parseFloat(value));
updateSliderValue(spreadControl, spreadValue, (value) => spreadRadius = parseInt(value));
updateSliderValue(turbulenceSpeedControl, turbulenceSpeedValue, (value) => turbulenceSpeed = parseInt(value));
updateSliderValue(turbulenceAmplitudeControl, turbulenceAmplitudeValue, (value) => turbulenceAmplitude = parseFloat(value));

// Recalculate density based on page width
const calculateDensity = () => canvas.width - 420;

// Adjust density with the new calculation
const adjustDensity = () => {
  const newDensity = calculateDensity();
  const difference = newDensity - snowflakes.length;
  if (difference > 0) {
    for (let i = 0; i < difference; i++) snowflakes.push(new Snowflake());
  } else {
    snowflakes.splice(difference);
  }
};

let animationTick = 0; // Global variable for sinusoidal oscillations

class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * snowflakeSize + 1;
    this.speedY = this.size * snowfallSpeed * 0.1 + Math.random() * 0.5;
    this.windResistance = 1 / this.size;
    this.turbulenceOffset = Math.random() * Math.PI * 2;
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.y += this.speedY;

    // Apply wind with sinusoidal turbulence
    const turbulence = Math.sin(animationTick / turbulenceSpeed + this.turbulenceOffset) * (turbulenceAmplitude / this.size);
    this.x += wind * this.windResistance + turbulence;

    if (this.y > canvas.height) {
      this.accumulate();
      this.reset();
    }

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }

  accumulate() {
    const index = Math.floor(this.x);
    const contribution = this.size * accumulationAmount;

    for (let offset = -spreadRadius; offset <= spreadRadius; offset++) {
      const targetIndex = index + offset;
      if (targetIndex >= 0 && targetIndex < canvas.width) {
        const distanceFactor = 1 - Math.abs(offset) / (spreadRadius + 1);
        groundHeights[targetIndex] += contribution * distanceFactor;
      }
    }
  }
}



const meltSnow = () => {
  for (let i = 0; i < groundHeights.length; i++) {
    groundHeights[i] = Math.max(groundHeights[i] - meltingRate, 0);
  }
};

const smoothGround = () => {
  const smoothed = [...groundHeights];
  for (let i = 1; i < groundHeights.length - 1; i++) {
    smoothed[i] = (groundHeights[i - 1] + groundHeights[i] + groundHeights[i + 1]) / 3;
  }
  groundHeights = smoothed;
};

const drawGround = () => {
  ctx.fillStyle = 'white';
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height - groundHeights[x];
    ctx.fillRect(x, y, 1, groundHeights[x]);
  }
};

const animate = () => {
  animationTick++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snowflakes.forEach((snowflake) => {
    snowflake.update();
    snowflake.draw();
  });

  meltSnow();

  if (Math.random() < smoothingFrequency) smoothGround();
  drawGround();

  requestAnimationFrame(animate);
};


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  groundHeights = Array(canvas.width).fill(0);
  adjustDensity();
});

// Initial setup
adjustDensity();
animate();



document.addEventListener('DOMContentLoaded', () => {
	const controls = document.getElementById('controls');
	const snowflakeIcon = document.getElementById('snowflake-icon');
	const closeButton = document.getElementById('close-controls');

	// Load saved settings from localStorage and set controls
	const settings = JSON.parse(localStorage.getItem('snowSettings')) || {};
	Object.keys(settings).forEach(key => {
		const input = document.getElementById(key);
		if (input) {
			input.value = settings[key];
			document.getElementById(`${key}-value`).textContent = settings[key];
		}
	});

	// Show controls when snowflake icon is clicked
	snowflakeIcon.addEventListener('click', () => {
		controls.style.display = 'block';
		snowflakeIcon.style.display = 'none';
	});

	// Hide controls, save settings, and show the snowflake icon when close button is clicked
	closeButton.addEventListener('click', () => {
		// Save current settings to localStorage
		const currentSettings = {};
		document.querySelectorAll('#controls input').forEach(input => {
			currentSettings[input.id] = input.value;
		});
		localStorage.setItem('snowSettings', JSON.stringify(currentSettings));

		// Hide controls and show the snowflake icon
		controls.style.display = 'none';
		snowflakeIcon.style.display = 'block';
	});

	// Update span values dynamically when inputs change
	document.querySelectorAll('#controls input').forEach(input => {
		input.addEventListener('input', (event) => {
			const span = document.getElementById(`${event.target.id}-value`);
			if (span) {
				span.textContent = event.target.value;
			}
		});
	});
});