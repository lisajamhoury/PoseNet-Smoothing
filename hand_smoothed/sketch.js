// PoseNet Simple Smoothing Example
// https://medium.com/@lisajamhoury/simple-smoothing-for-posenet-keypoints

// Sketch to show the effect of averaging PoseNet right wrist keypoint values across multiple frames.

// The sketch starts with no smoothing.
// Press 1 to turn on smoothing.
// Press 2 to increase smoothing by increments of 5.

// include this to use p5 autofill in vscode
// see https://stackoverflow.com/questions/30136319/what-is-reference-path-in-vscode
/// <reference path="../shared/p5.d/p5.d.ts" />
/// <reference path="../shared/p5.d/p5.global-mode.d.ts" />

const HANDTRACKW = 864;
const HANDTRACKH = 67.5;

const VIDEOW = 640;
const VIDEOH = 480;

const XINC = 5;
const CLR = 'rgba(200, 63, 84, 0.5)';

let smooth = false;
let recentXs = [];
let numXs = 0;

// Posenet variables
let video;
let poseNet;

// Variables to hold poses
let myPose = {};
let myRHand;

// Setup() is a p5 function
// See this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html
function setup() {
  // Create p5 canvas
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);

  // Create webcam capture for posenet
  video = createCapture(VIDEO);
  video.size(VIDEOW, VIDEOH);
  // Hide the webcam element
  video.hide();

  // Posenet option to make posenet mirror user
  const options = {
    flipHorizontal: true,
  };

  // Create poseNet to run on webcam and call 'modelReady' when model loaded
  poseNet = ml5.poseNet(video, options, modelReady);

  // Everytime we get a pose from posenet, call "getPose"
  // and pass in the results
  poseNet.on('pose', (results) => getPose(results));
}

// Draw() is a p5 function
// See this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html
function draw() {
  // Only proceed if there is a pose from posenet
  if (typeof myPose.pose === 'undefined') {
    console.log('Waiting for pose to begin!');
    return;
  }

  // Get right hand from pose
  myRHand = getHand(myPose, false);
  myRHand = mapHand(myRHand);

  // Draw background
  background(0);

  // Draw track
  noStroke();
  fill(255);
  rect(width / 2, height / 2, HANDTRACKW, HANDTRACKH);

  // Draw hand
  push();
  const offsetX = (width - HANDTRACKW) / 2;
  const offsetY = (height - HANDTRACKH) / 2;
  translate(offsetX, offsetY);
  noStroke();
  fill(CLR);
  ellipse(myRHand.x, HANDTRACKH / 2, 50);
  pop();

  drawMyVideo();

  // Draw text
  stroke(0);
  textSize(28);
  textAlign(CENTER);
  text('Smoothing:  ' + smooth, width / 2, height / 2 - 120);
  text(
    'Number of frames averaged: ' + numXs,
    width / 2,
    height / 2 - 90,
  );
}

// When posenet model is ready, let us know!
function modelReady() {
  console.log('Model Loaded');
}

// Function to get and send pose from posenet
function getPose(poses) {
  // We're using single detection so we'll only have one pose
  // which will be at [0] in the array
  myPose = poses[0];
}

// Function to get hand out of the pose
function getHand(pose, mirror) {
  // Return the wrist
  return pose.pose.rightWrist;
}

function mapHand(hand) {
  let tempHand = {};
  tempHand.x = map(hand.x, 0, VIDEOW, 0, HANDTRACKW);
  tempHand.y = map(hand.y, 0, VIDEOH, 0, HANDTRACKH);

  if (smooth) tempHand.x = averageX(tempHand.x);

  return tempHand;
}

function averageX(x) {
  // the first time this runs we add the current x to the array n number of times
  if (recentXs.length < 1) {
    console.log('this should only run once');
    for (let i = 0; i < numXs; i++) {
      recentXs.push(x);
    }
    // if the number of frames to average is increased, add more to the array
  } else if (recentXs.length < numXs) {
    console.log('adding more xs');
    const moreXs = numXs - recentXs.length;
    for (let i = 0; i < moreXs; i++) {
      recentXs.push(x);
    }
    // otherwise update only the most recent number
  } else {
    recentXs.shift(); // removes first item from array
    recentXs.push(x); // adds new x to end of array
  }

  let sum = 0;
  for (let i = 0; i < recentXs.length; i++) {
    sum += recentXs[i];
  }

  // return the average x value
  return sum / recentXs.length;
}

// draw the users webcam
function drawMyVideo() {
  push();
  translate(0.5 * VIDEOW, 0);
  scale(-0.5, 0.5);
  image(video, 0, 0, VIDEOW, VIDEOH);
  pop();
}

// keyTyped() is a p5 function
// See the p5 reference if this is new to you
// https://p5js.org/reference/#/p5/keyTyped
function keyTyped() {
  // press 0 to stop the sketch
  if (key === '0') {
    noLoop();
  }
  // press 1 to toggle smoothing
  if (key === '1') {
    smooth = !smooth;
    numXs += XINC;
  }

  // press 2 to increase number of frame to average
  if (key === '2') {
    numXs += XINC;
  }
}

// resize the p5 canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
