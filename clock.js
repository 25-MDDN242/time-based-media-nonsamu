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

background(skyColor);
  drawMetronome(width/4,height/2, obj)
  drawTuner(width /2, height /2 , obj)
}

function drawMetronome(x, y, obj) {
  push();
  translate(x, y);

  // Metronome Body (Outer and Inner)
  fill(150, 75, 0); stroke(0); strokeWeight(2);
  quad(-70, 100, 70, 100, 20, -100, -20, -100);

  fill(10); strokeWeight(4);
  quad(-55, 90, 55, 90, 10, -90, -10, -90);

  // --- Pendulum ---
  push();
  translate(0, 50); // Pivot point

  // Swing motion
  let millisProgress = obj.millis / 1000;
  let swingRange = 30;
  let angle = radians(lerp(obj.seconds % 2 ? swingRange : -swingRange, obj.seconds % 2 ? -swingRange : swingRange, millisProgress));
  rotate(angle);

  // Pendulum Rod
  stroke(150); strokeWeight(6);
  line(0, 0, 0, -150);

  // Trapezoid Weight
  fill(230); noStroke();
  quad(-8, -70, 8, -70, 15, -90, -15, -90);

  pop(); // End pendulum

  // Pivot Point
  fill(0); ellipse(0, 50, 10, 10);

  // Metronome Base
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

  let tunerWidth = 200;
  let tunerHeight = 120;

  // Background rectangle
  fill(20);
  stroke(0);
  strokeWeight(4);
  rectMode(CENTER);
  rect(0, 0, tunerWidth, tunerHeight, 12);

  // **Time Calculations**
  let totalTime = 60 * 1000; // 1 minute in milliseconds
  let currentMillis = obj.seconds * 1000 + obj.millis;
  let remainingTime = totalTime - currentMillis;
  let progress = currentMillis / totalTime; // Progress from 0 to 1

  // **Dynamic Deviation Update**
  let initialSpread = 5; // Max deviation at start of the minute
  let shrinkFactor = 3.5; // Shrinks faster at start, slower later
  let maxDeviation = initialSpread * pow(1 - progress, shrinkFactor);

  if (millis() - lastUpdateTime > 1000) {
    targetDeviation = random(-maxDeviation, maxDeviation);

    let isPreFinalPhase = remainingTime > 5000;
    
    // **Before Last 5s: Ensure Center Isn't Alone**
    if (isPreFinalPhase && abs(targetDeviation) < 0.1) {
      let choices = [-0.3, -0.2, -0.1, 0.1, 0.2, 0.3]; // Adds extra segment options
      targetDeviation = random(choices);
    }

    lastUpdateTime = millis();
  }

  // **Smoothly interpolate toward targetDeviation**
  currentDeviation = lerp(currentDeviation, targetDeviation, 0.1);

  // **Final 5 Seconds: Allow Center Alone**
  let inTune = abs(currentDeviation) <= 0.1 && remainingTime <= 5000;

  // Guide bars
  let guideHeight = 30;
  let guideWidth = tunerWidth * 0.8;
  let centerY = -tunerHeight / 4;

  stroke(80);
  strokeWeight(2);
  line(-guideWidth / 2, centerY, 0, centerY + guideHeight);
  line(guideWidth / 2, centerY, 0, centerY + guideHeight);

  let barCount = 12;
  let barSpacing = guideWidth / 2 / barCount;

  for (let i = 0; i <= barCount; i++) {
    let barHeight = map(i, 0, barCount, guideHeight, 5);
    let barDeviation = i / barCount;
    let active = abs(currentDeviation) >= barDeviation - 0.01;

    if (active) {
      if (inTune && i === 0) {
        fill(173, 216, 230); //Light Blue during last 5 seconds
      } else {
        fill(0, 0, 255, 200 - i * 10); // Blue otherwise
      }
    } else {
      fill(50);
    }

    noStroke();
    rect(-barSpacing * i, centerY + barHeight / 2, barSpacing * 0.8, barHeight, 2);
    rect(barSpacing * i, centerY + barHeight / 2, barSpacing * 0.8, barHeight, 2);
  }

  // **Minute Display**
  let currentMinute = obj.minutes; // Use provided clock minute

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(currentMinute, 0, tunerHeight / 4);
 
  pop();
}
