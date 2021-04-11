const SMOOTHAMT = 5;
const SMOOTHING = true;

class Keypoint {
  constructor() {
    this.position = { x: null, y: null };
    this.visible = true;
    this.smoothing = SMOOTHING;
    this.smoothAmt = SMOOTHAMT;
    this.pastX = [];
    this.pastY = [];
  }

  setPosition(position) {
    if (!this.smoothing) {
      this.position = position;
    } else {
      this.position = this.getSmoothPosition(position);
    }
  }

  setVisibility(score) {
    if (score > 0.5) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  }

  draw() {
    noStroke();
    fill(255);
    ellipse(this.position.x, this.position.y, 20);
  }

  getSmoothPosition(position) {
    const smoothPos = { x: null, y: null };
    smoothPos.x = this.getSmoothCoord(position.x, this.pastX);
    smoothPos.y = this.getSmoothCoord(position.y, this.pastY);

    return smoothPos;
  }

  getSmoothCoord(coord, frameArray) {
    // the first time this runs we add the current x to the array n number of times
    if (frameArray.length < 1) {
      for (let i = 0; i < this.smoothAmt; i++) {
        frameArray.push(coord);
      }
      // every other time it runs we update only the most recent value in the array
    } else {
      frameArray.shift(); // removes first item from array
      frameArray.push(coord); // adds new x to end of array
    }
    // add all the x values
    let sum = 0;
    for (let i = 0; i < frameArray.length; i++) {
      sum += frameArray[i];
    }
    // return the average
    return sum / frameArray.length;
  }
}

export { Keypoint };
