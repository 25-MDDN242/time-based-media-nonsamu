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
  let skyColor = setColours(obj);
  background(skyColor);
  

  drawWindow()
  drawWindowsill()

  drawMetronome(width / 2.5,height/4*3, obj)
  drawTuner(width / 1.65, height /4*3 , obj)
  drawAmp(width * 0.84, height * 0.7);
  drawAmp(width / 6, height * 0.7);
}

let lastUpdateTime = 0;
let targetDeviation = 0;
let currentDeviation = 0;

function setColours(obj) {
  let hour = obj.hours;
  let minute = obj.minutes;
  let second = obj.seconds;
  let millis = obj.millis;

  //Convert full time into a smooth float (0 to 23.999...)
  let time = hour + minute / 60 + second / 3600 + millis / 3600000;

  //Define smooth sky colors at specific times
  let night = color(10, 10, 40);       // Deep Dark Blue (Midnight)
  let dawn = color(88, 52, 133);       // Purple (Dawn)
  let sunrise = color(232, 131, 72);   // Warm Orange (Sunrise)
  let midday = color(45, 104, 196);    // Bright Blue (Daytime)
  let sunset = color(250, 128, 114);   // Reddish-Orange (Sunset)
  let dusk = color(45, 45, 85);        // Deep Blue-Purple (Dusk)

  let currentColor;

  if (time < 2) {
    currentColor = night; //Midnight to early morning
  } 
  else if (time < 4) {
    let t = (time - 4) / 2; //Smooth transition from 2:00 → 4:00
    currentColor = lerpColor(night, dawn, t);
  } 
  else if (time < 6) {
    let t = (time - 6) / 2;
    currentColor = lerpColor(dawn, sunrise, t);
  } 
  else if (time < 12) {
    let t = (time - 8) / 4;
    currentColor = lerpColor(sunrise, midday, t);
  } 
  else if (time < 16) {
    currentColor = midday; // Midday stays bright blue
  } 
  else if (time < 18) {
    let t = (time - 16) / 2;
    currentColor = lerpColor(midday, sunset, t);
  } 
  else if (time < 20) {
    let t = (time - 18) / 2;
    currentColor = lerpColor(sunset, dusk, t);
  } 
  else if (time < 22) {
    let t = (time - 20) / 2;
    currentColor = lerpColor(dusk, night, t);
  } 
  else {
    currentColor = night; // Nighttime
  }

  return currentColor;
}

function drawMetronome(x, y, obj) {
  push();
  translate(x, y);

  let goldLight = color(255, 215, 0);  //Bright gold highlight
  let goldMid = color(218, 165, 32);   //Standard gold
  let goldDark = color(184, 134, 11);  //Shadowed gold
  let goldDarker = color(150, 109, 0)  //Gold Bevel

  //Metronome Body (Outer and Inner)
  fill(150, 75, 0); stroke(0); strokeWeight(4);
  quad(-70, 100, 70, 100, 20, -100, -20, -100);

  fill(10); strokeWeight(4);
  quad(-55, 90, 55, 90, 10, -90, -10, -90);

  fill(90); strokeWeight(3);
  quad(-5, 90, 5, 90, 5, -90, -5, -90);

  //Pendulum
  push();
  translate(0, 50); //Pivot point

  //Swing motion
  let millisProgress = obj.millis / 1000;
  let swingRange = 40;
  let angle = radians(lerp(obj.seconds % 2 ? swingRange : -swingRange, obj.seconds % 2 ? -swingRange : swingRange, millisProgress));
  rotate(angle);

  //Pendulum Rod
  stroke(150); strokeWeight(6);
  line(0, 0, 0, -150);

  //Trapezoid Weight
  fill(90); stroke(0); strokeWeight(2);
  quad(-8, -70, 8, -70, 15, -90, -15, -90);

  pop(); // End pendulum

  //Pivot Point
  fill(90); ellipse(0, 50, 10, 10);

  //Metronome Base
  fill(150, 75, 0); stroke(4); strokeWeight(4);
  quad(-70, 100, 70, 100, 60, 45, -60, 45);

  //Plate
  let goldOffsetY = 15;
  let goldPlateHeight = 25;

  for (let i = 0; i < goldPlateHeight; i++) {
    let inter = map(i, 0, goldPlateHeight, 0, 1);
    let goldShade = lerpColor(goldLight, goldDark, inter);
    stroke(goldShade);
    line(-51 + i / 4, 99.5 - goldOffsetY - i, 51 - i / 4, 99.5 - goldOffsetY - i);
  }

  //Plate Bevel
  stroke(goldDarker);
  strokeWeight(2);
  noFill();
  quad(-50, 100 - goldOffsetY, 50, 100 - goldOffsetY, 45, 100 - goldOffsetY - goldPlateHeight, -45, 100 - goldOffsetY - goldPlateHeight);

  pop();
}

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
  let maxDeviation = 5 * pow(1 - progress, 3);

  if (millis() - lastUpdateTime > 1000) {
    targetDeviation = random(-maxDeviation, maxDeviation);

    //Ensure center isn't alone before last 3s
    if (remainingTime > 3000 && abs(targetDeviation) < 0.1) {
      targetDeviation = random([-0.3, -0.2, 0.2, 0.3]);
    }

    lastUpdateTime = millis();
  }

  currentDeviation = lerp(currentDeviation, targetDeviation, 0.1);
  let inTune = abs(currentDeviation) <= 0.1 /*&& remainingTime <= 3000*/;
  
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

function drawWindow() {
  let frameWidth = width * 0.7;
  let frameHeight = height * 0.8;
  let frameX = width / 2;
  let frameY = height / 2;

  //Wall
  fill(245, 222, 179);
  noStroke();
  rect(0, 0, width, height);

  //Sky
  fill(setColours(obj));
  rectMode(CENTER);
  rect(frameX, frameY, frameWidth, frameHeight);

  drawGround(obj, frameX, frameY, frameWidth, frameHeight);

  drawStars(obj);

  //Patches (This is scuffed. Pls fix)
  fill(245, 222, 179);
  noStroke();
  rect(400, frameY + frameHeight / 2 + 25, width, height - (frameY + frameHeight / 2));
  rect(75, 400, frameX - frameWidth / 2, height/4);
  rect(frameX + frameWidth / 2 + 75, 400, width - (frameX + frameWidth / 2), height/4)

  //Window Frame
  stroke(100,50,20);
  strokeWeight(30);
  noFill();
  rect(frameX, frameY, frameWidth*0.97, frameHeight*0.96);

  stroke(120, 70, 30);
  strokeWeight(20);
  noFill();
  rect(frameX, frameY, frameWidth, frameHeight);

  //Window Panes
  stroke(100,50,20);
  strokeWeight(15);
  line(frameX * 0.75, frameY/1.25, frameX * 1.25, frameY/1.25); // Horizontal divider
  line(frameX * 0.75, frameY - frameHeight / 2+20, frameX * 0.75, frameY + frameHeight / 2-20); // Vertical divider
  line(frameX * 1.25, frameY - frameHeight / 2+20, frameX * 1.25, frameY + frameHeight / 2-20);

  stroke(80, 50, 20);
  rect(frameX, frameY-frameHeight / 3.4 , frameX * 0.44, frameY * 0.425)

  
}

function drawWindowsill() {
  let sillHeight = 30;
  let sillY = height - sillHeight;

  fill(120, 70, 30); // Wood color
  noStroke();
  rectMode(CORNER);
  rect(0, sillY, width, sillHeight); // Horizontal shelf

  // Add shadow for realism
  fill(80, 50, 20, 150); // Darker brown with transparency
  rect(0, sillY + sillHeight - 5, width, 10);
}

function drawGround(obj, frameX, frameY, frameWidth, frameHeight) {
  let hour = obj.hours;
  let minute = obj.minutes;
  
  //Ground Colour transitions
  let nightGreen = color(10, 50, 10);
  let dayGreen = color(50, 200, 50);

  let time = hour + minute / 60;
  let groundColor;

  if (time < 6) {
    groundColor = nightGreen;
  } else if (time < 12) {
    let t = (time - 6) / 6;
    groundColor = lerpColor(nightGreen, dayGreen, t);
  } else if (time < 18) {
    groundColor = dayGreen;
  } else if (time < 24) {
    let t = (time - 18) / 6;
    groundColor = lerpColor(dayGreen, nightGreen, t);
  } else {
    groundColor = nightGreen;
  }

  fill(groundColor);
  noStroke();
  let groundY = frameY + frameHeight / 4;
  ellipse(frameX, groundY / 0.85, frameWidth * 1.2, frameHeight * 0.3);
}

let stars = []; // Array to store stars
let starCount = 100; // Number of stars

function drawStars(obj) {
  // 🪟 **Get Window Boundaries**
  let frameWidth = width * 0.7;
  let frameHeight = height * 0.8;
  let frameX = width / 2;
  let frameY = height / 2;

  let left = frameX - frameWidth / 2;
  let right = frameX + frameWidth / 2;
  let top = frameY - frameHeight / 2;
  let bottom = frameY; // Keep stars only in the **upper** half of the window

  // 🌟 **1. Generate Stars Inside Window Only Once**
  if (stars.length === 0) {
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: random(left + 10, right - 10), // Keep stars inside window horizontally
        y: random(top + 35, bottom + frameHeight/4), // Keep stars in upper window
        size: random(1, 3),
        baseBrightness: random(150, 255) // Max brightness per star
      });
    }
  }

  // 🌙 **2. Determine Star Brightness Based on Time of Day**
  let hour = obj.hours;
  let minute = obj.minutes;
  let time = hour + minute / 60; // Convert time into a smooth float

  let brightness = 0; // Default: No stars in daytime

  if (time < 5 || time > 21) { 
    brightness = 255; // Full brightness at night (10 PM - 5 AM)
  } else if (time >= 5 && time < 8) {
    brightness = map(time, 5, 8, 255, 0, true); // Fade out from 5 AM to 8 AM
  } else if (time >= 18 && time < 21) {
    brightness = map(time, 18, 21, 0, 255, true); // Fade in from 6 PM to 9 PM
  }

  // 🌟 **3. Draw Stars Within Window Only**
  noStroke();
  for (let star of stars) {
    let starAlpha = min(star.baseBrightness, brightness); // Adjust brightness
    if (starAlpha > 0) { // Only draw if visible
      fill(255, 255, 255, starAlpha);
      ellipse(star.x, star.y, star.size);
    }
  }
}

function drawAmp(x, y) {
  push();
  translate(x, y);

  // Colors
  let ampBodyColor = color(20, 20, 20);  // Black amp body
  let grillColor = color(40, 40, 40);    // Dark grill mesh
  let panelGold = color(218, 165, 32);   // Gold control panel
  let knobColor = color(220);            // White/Silver knobs
  let speakerDark = color(30, 30, 30);   // Speaker inner shadow
  let speakerLight = color(80, 80, 80);  // Speaker outer rim
  let inputJackColor = color(10);        // Black input jack
  let switchColor = color(255, 0, 0);    // Red on/off switch

  // Amp Body
  fill(ampBodyColor);
  stroke(0);
  strokeWeight(6);
  rectMode(CENTER);
  rect(0, 0, 220, 260, 10);

  noFill();
  stroke(0);
  strokeWeight(5);
  rect(0, 0, 220, 260, 10);

  // Control Panel
  fill(panelGold);
  stroke(0);
  strokeWeight(3);
  rect(0, -90, 190, 45, 5);

  // Knobs
  let knobY = -90;
  let knobSpacing = 30; // Reduced spacing to make room for switch
  for (let i = -1; i <= 2; i++) {  // Shifted left
    fill(knobColor);
    stroke(0);
    ellipse(i * knobSpacing - 10, knobY, 14, 14); // 4 Knobs instead of 5
  }

  // Input Jack (Leftmost element)
  fill(inputJackColor);
  stroke(220);
  strokeWeight(2);
  ellipse(-80, knobY, 12, 12); // Input jack circle

  // On/Off Switch (Rightmost element)
  fill(switchColor);
  stroke(0);
  strokeWeight(2);
  rect(70, knobY, 10, 18, 3); // Small vertical rocker switch

  // Speaker Grill Area
  fill(grillColor);
  stroke(10);
  strokeWeight(2);
  rect(0, 50, 180, 140, 5); // Grill frame

  // Speaker
  fill(speakerLight);
  stroke(0);
  strokeWeight(2);
  ellipse(0, 50, 120, 120); // Outer Speaker Rim

  fill(speakerDark);
  ellipse(0, 50, 100, 100); // Inner Speaker Cone

  fill(0);
  ellipse(0, 50, 40, 40); // Speaker Center Cap

  //Logo
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(24);
  textFont("Comic Sans");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Marshall", 0, -40);

  pop();
}
