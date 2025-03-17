/*
 * use p5.js to draw a clock on a 960x500 canvas
 */
function draw_clock(obj) {
  // draw your own clock here based on the values of obj:
  //    obj.hours goes from 0-23
  //    obj.minutes goes from 0-59
  //    obj.seconds goes from 0-59
  //    obj.millis goes from 0-999
  //    obj.seconds_until_alarm is:
  //        < 0 if no alarm is set
  //        = 0 if the alarm is currently going off
  //        > 0 --> the number of seconds until alarm should go off
  background(50); //  beige
  fill(200); // dark grey
  textSize(40);
  textAlign(CENTER, CENTER);
  text("YOUR MAIN CLOCK CODE GOES HERE", width / 2, 200);
  
  // Sky Color based on hour
  let hour = obj.hours;
  let skyColor;

  if (hour >= 6 && hour < 12) { // Morning
    skyColor = color(135, 206, 235); // light blue
  } else if (hour >= 12 && hour < 18) { // Afternoon
    skyColor = color(70, 130, 180); // deeper blue
  } else if (hour >= 18 && hour < 20) { // Sunset
    skyColor = color(250, 128, 114); // orange-red
  } else { // Night
    skyColor = color(25, 25, 112); // dark blue
  }

  // Music Stand
  push();
  fill(60);
  rect(width / 2 - 75, height / 2, 150, 10); // top board
  rect(width / 2 - 5, height / 2 + 10, 10, 150); // stand post
  triangle(width / 2 - 30, height / 2 + 160, width / 2 + 30, height / 2 + 160, width / 2, height / 2 + 200); // base
  pop();

  // Page Number
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(obj.minutes, width / 2, height / 2 + 5);

  // Metronome Base
  push();
  translate(width / 4 * 3, height / 2 + 100);
  fill(100);
  rect(-20, 0, 40, 100); // stand

  // Swing Arm
  let angle = sin(radians(obj.seconds * 6)) * 30; // swings back and forth, 6 degrees per second
  rotate(radians(angle));
  strokeWeight(4);
  stroke(0);
  line(0, 0, 0, -100); // pendulum arm
  fill(200, 50, 50);
  ellipse(0, -100, 20); // bob
  pop();

background(skyColor);

  fill(249, 140, 255);// pink
  ellipse(width / 3, 350, 150);
  fill(140, 255, 251) // blue
  ellipse(width / 2, 350, 150);
  fill(175, 133, 255); // purple
  ellipse(width / 3 * 2, 350, 150);

}
