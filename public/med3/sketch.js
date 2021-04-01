let serial;
let latestData;
var t;

function setup() {
  let back = select('#back');
  back.position(0, 0);

  serial = new p5.SerialPort();

  serial.list();
  serial.open('/dev/tty.usbmodem14101');

  serial.on('connected', serverConnected);

  serial.on('list', gotList);

  serial.on('data', gotData);

  serial.on('error', gotError);

  serial.on('open', gotOpen);

  serial.on('close', gotClose);


  pg = createGraphics(displayWidth, displayHeight);
  pg.hide();
  stroke(0, 15);
  noFill();
  t = 0;

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
  console.log(currentString);
  latestData = currentString;
}



function draw() {
  background(255, 255, 255);
  fill(0, 0, 0);
  text(latestData, 10, 10);
  // Polling method

  if (serial.available() > 0) {
    let data = serial.read();
    pg.background(200, 0, 255, 0);
    pg.beginShape();
    pg.noFill();
    let r = map(mouseX, 0, 900, 200, 106);
    let g = random(50, 200);
    let b = random(100, 250);
    let a = map(mouseX, 0, 255, 32, 50);
    strokeWeight(1);
    pg.stroke(r, g, b, a - 4);
    for (var i = 0; i < 200; i++) {
      var ang = map(i, 0, data, 0, TWO_PI);
      var rad = 200 * noise(i * map(0, 0.01, 0.0002, 0.0001, 0.04), t * 0.009);

      var x = rad * cos(ang);
      var y = rad * sin(ang);
      pg.curveVertex(x * 10, y + height / 2);
    }
    pg.endShape(CLOSE);

    t += 0.5;
    image(pg, 0, 0);

    var sparkle = {
      locationX: random(width),
      locationY: random(height),
      size: random(1, 6)
    }
  }

}
