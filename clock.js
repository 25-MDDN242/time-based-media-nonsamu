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
  let skyColor = setColours(obj.hours);
  background(skyColor);

  /*if (hour >= 6 && hour < 12) { // Morning
    skyColor = color(135, 206, 235); // light blue
  } else if (hour >= 12 && hour < 18) { // Afternoon
    skyColor = color(70, 130, 180); // deeper blue
  } else if (hour >= 18 && hour < 20) { // Sunset
    skyColor = color(250, 128, 114); // orange-red
  } else { // Night
    skyColor = color(25, 25, 112); // dark blue
  }*/

  background(skyColor);
  drawMetronome(width/4,height/2, obj)
  drawTuner(width /2, height /2 , obj)
}

function setColours(hour) {
  let bgColor;

  switch (true) { 
    case (hour <= 4 || hour >= 20): 
      bgColor = color(0); // Black (Night)
      break;

    case (hour > 5 && hour <= 6): 
    case (hour > 18 && hour <= 19):
      bgColor = color(232, 131, 72); // Orange (Sunrise/Sunset)
      break;

    case (hour > 4 && hour <= 5): 
    case (hour > 19 && hour <= 20): 
      bgColor = color(88, 52, 133); // Purple (Dawn/Dusk)
      break;

    case (hour >= 7 && hour < 18): 
      bgColor = color(45, 221, 227); // Blue (Daytime)
      break;

    default: 
      bgColor = color(0); // Fallback (Black)
  }

  return bgColor;
}

function drawMetronome(x, y, obj) {
  push();
  translate(x, y);

  // Metronome Body (Outer and Inner)
  fill(150, 75, 0); stroke(0); strokeWeight(2);
  quad(-70, 100, 70, 100, 20, -100, -20, -100);

  fill(10); strokeWeight(4);
  quad(-55, 90, 55, 90, 10, -90, -10, -90);

  //Pendulum
  push();
  translate(0, 50); //Pivot point

  //Swing motion
  let millisProgress = obj.millis / 1000;
  let swingRange = 30;
  let angle = radians(lerp(obj.seconds % 2 ? swingRange : -swingRange, obj.seconds % 2 ? -swingRange : swingRange, millisProgress));
  rotate(angle);

  //Pendulum Rod
  stroke(150); strokeWeight(6);
  line(0, 0, 0, -150);

  //Trapezoid Weight
  fill(90); noStroke();
  quad(-8, -70, 8, -70, 15, -90, -15, -90);

  pop(); // End pendulum

  //Pivot Point
  fill(90); ellipse(0, 50, 10, 10);

  //Metronome Base
  fill(150, 75, 0); stroke(0); strokeWeight(2);
  quad(-70, 100, 70, 100, 60, 45, -60, 45);

  pop();
}

let lastUpdateTime = 0;
let targetDeviation = 0;
let currentDeviation = 0;

function drawTuner(x, y, obj) {
  push();
  translate(x, y);

  //Tuner Pedal Shape
  let tunerWidth = 120, tunerHeight = 200;
  fill(20);
  stroke(0);
  strokeWeight(4);
  rectMode(CENTER);
  rect(0, 0, tunerWidth, tunerHeight, 12);

  //Time Calculations
  let totalTime = 60000;
  let currentMillis = obj.seconds * 1000 + obj.millis;
  let remainingTime = totalTime - currentMillis;
  let progress = currentMillis / totalTime;

  //Deviation Update
  let maxDeviation = 5 * pow(1 - progress, 3.5);

  if (millis() - lastUpdateTime > 1000) {
    targetDeviation = random(-maxDeviation, maxDeviation);

    //Ensure center isn't alone before last 5s
    if (remainingTime > 5000 && abs(targetDeviation) < 0.1) {
      targetDeviation = random([-0.3, -0.2, -0.1, 0.1, 0.2, 0.3]);
    }

    lastUpdateTime = millis();
  }

  currentDeviation = lerp(currentDeviation, targetDeviation, 0.1);
  let inTune = abs(currentDeviation) <= 0.1 && remainingTime <= 5000;
  
  //Screen Background (Black Display)
  let screenWidth = tunerWidth * 0.8;
  let screenHeight = tunerHeight * 0.55;
  let screenY = -tunerHeight * 0.135;
  
  fill(0); //Black background for the screen
  noStroke();
  rect(0, screenY, screenWidth, screenHeight, 8);

  //Bars
  let guideHeight = 30, guideWidth = 80, centerY = -75;
  let barCount = 7, barSpacing = guideWidth / (2 * barCount);

  stroke(20);
  strokeWeight(2);
  line(-guideWidth / 2, centerY, 0, centerY + guideHeight);
  line(guideWidth / 2, centerY, 0, centerY + guideHeight);

  for (let i = 0; i <= barCount; i++) {
    let barHeight = map(i, 4, barCount, guideHeight * 1.5, 40);
    let active = abs(currentDeviation) >= i / barCount - 0.01;

    fill(active ? (inTune && i === 0 ? color(173, 216, 230) : color(0, 0, 255, 200 - i * 10)) : 50);
    noStroke();
    rect(-barSpacing * i, centerY + barHeight / 2, barSpacing * 0.8, barHeight, 2);
    rect(barSpacing * i, centerY + barHeight / 2, barSpacing * 0.8, barHeight, 2);
  }

  //Minute Display
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(obj.minutes, 0,8);

  //Footswitch
  let switchY = tunerHeight / 2 - tunerHeight * 0.2;
  fill(100);
  stroke(50);
  strokeWeight(3);
  ellipse(0, switchY, 30, 30);

  pop();
}
