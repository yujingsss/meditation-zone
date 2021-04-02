let serial;
let latestData;
// let portName = '/dev/tty.usbmodem14101';
let portName = '/dev/tty.usbmodem14601';

let diameter; // not clear on the variable name, here
const count = 6
let radius;

let circles = []

let inputSerialPort, button;
let cnv;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // pixelDensity(0.03);
  c1 = color(150, 60, 250);
  c2 = color(10, 20, 255);
  setGradient(c1, c2);

  let back = select('#back');
  back.position(0, 0);

  diameter = width / count;
  radius = diameter / 2
  const rows = Math.floor(height / diameter)
  // background(0);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(19);
  for (let r = 1; r <= rows; r++) {
    const y = (diameter * r) - radius
    for (let i = 1; i <= count; i++) {
      circles.push(makeCircle({
        radius,
        x: diameter * i - radius,
        y
      }))
    }
  }

  inputSerialPort = createInput('');
  inputSerialPort.position(width / 2 - 170, 75);
  inputSerialPort.size(300);
  inputSerialPort.value('/dev/tty.usbmodem14601');
  button = createButton('start');
  button.size(40);
  button.position(inputSerialPort.x + inputSerialPort.width, 75);

  button.mousePressed(openSerialPort);
}

function keyPressed() {
  if (keyCode === ENTER) {
    openSerialPort();
  }
  if (key === 's' || key === 'S') {
    save(cnv, 'meditation.jpg');
  }
}

function openSerialPort() {
  // console.log(inputSerialPort.value());
  portName = inputSerialPort.value();
  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  serial.list();
  serial.open(portName);
  inputSerialPort.value('');
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function portClose() {
  console.log("Serial Port is Closed");
  // latestData = "Serial Port is Closed";
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function serialEvent() {
  // let currentString = serial.readLine();
  // trim(currentString);
  // if (!currentString) return;
  // console.log(currentString);
  // latestData = currentString;
  const inString = serial.readStringUntil('\r\n');
  if (inString.length > 0) {
    // console.log(inString);
    const sensors = split(inString, ','); // split the string on the commas
    const pulseSignal = sensors[0];
    latestData = pulseSignal;
    console.log(latestData);
    // const photoResistorData = sensors[1];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  inputSerialPort.position(width / 2 - 170, 75);
  button.position(inputSerialPort.x + inputSerialPort.width, 75);
}

function draw() {
  //background(255,255,10);
  fill(0, 0, 0);
  text(latestData, 10, 10);
  // Polling method

  if (serial.available() > 0) {
    let data = serial.read();
    // ellipse(50,50,data,data);
    circles.forEach(circle => circle())
  }
  else {
    // ellipse(50,50,50,50);
  }

}

const hueGetter = (offset = 0, inc = 0.01) => {
  let pc = 0
  let t = inc
  return () => {
    pc += t
    return Math.floor(noise(pc + (offset * 100)) * 360)
  }
}

const makeCircle = ({
  radius,
  x,
  y
}) => {
  const getHue = hueGetter(x + y)
  return () => drawGradient({
    x,
    y,
    radius,
    getHue
  })
}

function drawGradient({
  x,
  y,
  radius,
  getHue
}) {
  let hue = getHue()
  for (let r = radius; r > 0; --r) {
    fill(hue, 90, 90);
    ellipse(x, y, r, r, serial.read());
    hue = (hue + 1) % 360;
  }
}

function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}