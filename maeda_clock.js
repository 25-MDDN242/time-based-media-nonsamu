// Update this function to draw you own maeda clock on a 960x500 canvas
function draw_clock(obj) {
  // YOUR MAIN CLOCK CODE GOES HERE
  background(50); //  beige
  fill(200); // dark grey
  textSize(40);
  textAlign(CENTER, CENTER);
  text("YOUR MAEDA CLOCK CODE GOES HERE", width/2, height/2);

  angleMode(DEGREES);

  let secondsToDegrees = map(obj.seconds, 0, 59, 0, 360);
  background(0);

  push();
  translate(width / 2, height / 2);
  rotate(secondsToDegrees);
  fill(200);
  textSize(40);
  textAlign(CENTER, CENTER);
  if (obj.hours <= 0 && obj.hours < 12) {
    text('AM', 0, 0);
  } else {
    text('PM', 0, 0);
  }
  fill(255);
  drawVerticalText(obj.minutes.toString(), 0, -140);
  fill(255,0,0);
  drawVerticalText(":", 0, -185);
  fill(255);
  drawVerticalText(obj.hours.toString(), 0, -260);
  pop();
}

function drawVerticalText(txt, x, y) {
  for (let i = 0; i < txt.length; i++) {
    text(txt[i], x, y + i * 40);
  }
}
