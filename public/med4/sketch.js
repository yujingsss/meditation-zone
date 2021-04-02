let a = 1;
let ad = 1;
let portName;
let inputSerialPort, button;
let cnv;
let sphereR, sphereG, sphereB;
let rotateNum;
let acceleration;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight - 200, WEBGL);

  inputSerialPort = createInput('');
  inputSerialPort.position(width/2 - 170, 75);
  inputSerialPort.size(300);
  inputSerialPort.value('/dev/tty.usbmodem14601');
  button = createButton('start');
  button.size(40);
  button.position(inputSerialPort.x + inputSerialPort.width, 75);

  button.mousePressed(openSerialPort);

  sphereR = 220;
  sphereG = 180;
  sphereB = 245;
  rotateNum = 15000;
  acceleration = 0;
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

function draw() {
  background(255, 255, 255, 0.5);
  fill(255);
  noStroke();
  // a = a + ad;
  // if (a > 25){
  //   ad *= -1;
  // }
  // if (a < 1){
  //   ad *= -1;
  // }
  
  //large sphere color
  // fill(220, 180, 245);
  fill(sphereR, sphereG, sphereB);
  //rotate
  rotateY(millis()/rotateNum);
  rotateNum -= acceleration;
  if (acceleration == 100) {
    rotateNum -= acceleration;
    if (rotateNum <= 0) {
      acceleration = 0;
    }
  } 
  if (acceleration == 0) {
    rotateNum += 100;
    if (rotateNum >= 15000){
      acceleration = 0;
    }
  }
  rotateX(130);
  sphere(70 + a);
  fill(200, 45, 100, 90);
  torus(125, 4, 24, 16);
  
  fill(190, 190, 255);
  translate(200, 0, 0);
  sphere(5);
  
  fill(200, 220, 250);
  translate(-200, -200, 25);
  sphere(5);
  
  fill(250, 200, 250);
  translate(-200, 200, -50);
  sphere(5); 
  
  fill(225, 200, 255);
  translate(200, 200, 100);
  sphere(5);
  
  fill(240, 210, 250);
  translate(100, -50, -150);
  sphere(5);
  
  fill(200, 220, 250);
  translate(-200, 0, 50);
  sphere(5);
  
  fill(225, 210, 245);
  translate(0, -300, -100);
  sphere(5);
  
  fill(220, 200, 255);
  translate(300, 0, 200);
  sphere(5);
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

function serialEvent() {
  const inString = serial.readStringUntil('\r\n');
  if (inString.length > 0) {
    // console.log(inString);
    const sensors = split(inString, ','); // split the string on the commas
    const pulseSignal = sensors[0];
    a = map(pulseSignal, 400, 800, 0, 26);
    const photoResistorData = sensors[1];
    // console.log(photoResistorData);
    if (photoResistorData < 200) {
      acceleration = 100;
    } else {
      acceleration = 0;
    }
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  inputSerialPort.position(width/2 - 170, 75);
  button.position(inputSerialPort.x + inputSerialPort.width, 75);
}
