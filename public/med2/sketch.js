let serial;
let latestData;
// let portName = '/dev/tty.usbmodem141601';
let diameter; // not clear on the variable name, here
const count = 6
let radius;

let circles = [];
let ellipseDetail;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // pixelDensity(0.03);
  c1 = color(150, 60, 250);
  c2 = color(10, 20, 255);
  setGradient(c1, c2);

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

  let back = select('#back');
  back.position(0,0);
  
  let portName = "/dev/tty.usbmodem14101";
  let inputSerialPort, button;
  inputSerialPort = createInput('');
  inputSerialPort.position(width / 2 - 170, 75);
  inputSerialPort.size(300);
  inputSerialPort.value('/dev/tty.usbmodem14601');
  button = createButton('start');
  button.size(40);
  button.position(inputSerialPort.x + inputSerialPort.width, 75);

  button.mousePressed(() => {
    portName = inputSerialPort.value();
    serial = new p5.SerialPort();
    serial.list();
    serial.on('connected', serverConnected);
    serial.on('list', gotList);
    serial.on('data', gotData);
    serial.on('error', gotError);
    serial.on('open', gotOpen);
    serial.on('close', gotClose);
    serial.open(portName);
    inputSerialPort.value('');
  });
  serial = new p5.SerialPort();
  serial.list();
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
  serial.open(portName);
}

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  // console.log(currentString);
  latestData = currentString;
  ellipseDetail = split(latestData, ',');
}

function draw() {
  //background(255,255,10);
  fill(0, 0, 0);
  text(latestData, 10, 10);
  // Polling method

  if (serial.available() > 0) {
    // let data = serial.read();
    // ellipse(50,50,data,data);
    circles.forEach(circle => circle())
  } else {
    // ellipse(50,50,50,50);

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

const hueGetter = (offset = 0, inc = 0.01) => {
  let pc = 0
  let t = inc
  return () => {
    pc += t
    return Math.floor(noise(pc + (offset * 100)) * 360 * map(ellipseDetail[0],400,800,1,2))
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
    // ellipse(x, y, r, r, serial.read());
    ellipse(x, y, r, r, map(ellipseDetail[0], 400, 800, 0, 25));
    hue = (hue + 1) % 360;
  }
}