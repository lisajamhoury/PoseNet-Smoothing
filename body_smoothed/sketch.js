// PoseNet Simple Smoothing Example
// https://medium.com/@lisajamhoury/simple-smoothing-for-posenet-keypoints

// Sketch to show the effect of averaging all PoseNet keypoint values across multiple frames.
// The sketch starts by default averages the 5 most recent values for each keypoint.
// Change the number of smoothed frames on line 1 of keypoint.js

// include this for to use autofill in vscode
// see https://stackoverflow.com/questions/30136319/what-is-reference-path-in-vscode
/// <reference path="../shared/p5.d/p5.d.ts" />
/// <reference path="../shared/p5.d/p5.global-mode.d.ts" />

import { Player } from './modules/player.js';

let video;
let poseNet;

let player1;

let updatePose = false;
let newPose = {};

// this sketch uses es6 modules, so window.setup is needed
// see https://bl.ocks.org/GoSubRoutine/da4939559d8b786df13f5694ea2edd30
window.setup = function () {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  player1 = new Player();

  // flip posenet data to mirror user
  const options = {
    flipHorizontal: true,
  };

  // see https://learn.ml5js.org/#/reference/posenet
  poseNet = ml5.poseNet(video, options, modelReady);
  poseNet.on('pose', (results) => getPose(results));
};

window.draw = function () {
  // only update pose if there is new data
  if (updatePose === true) {
    player1.update(newPose);
    updatePose = false;
  }

  // wait for pose data to draw
  if (typeof player1.pose === 'undefined') {
    console.log('waiting for player1 pose!');
    return;
  }

  // mirror and draw video
  background(0);
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  player1.draw(true);

  // Use for debugging
  // drawFramerate();
};

// When posenet model is ready, let us know!
function modelReady() {
  console.log('Model Loaded');
}

// Get pose from posenet
function getPose(poses) {
  if (typeof poses[0] !== 'undefined') {
    newPose = poses[0];
    updatePose = true;
  }
}

// Draw framerate, use in draw for debugging
function drawFramerate() {
  fill(0);
  stroke(0);
  text(getFrameRate(), 10, 10);
}

// Press any key to stop the sketch
window.keyTyped = function () {
  if (key === '0') {
    noLoop();
  }
};
