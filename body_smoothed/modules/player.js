import { Keypoint } from './keypoint.js';

class Player {
  constructor() {
    this.pose;
    this.orderedPose = [];
    this.init();
  }

  init() {
    // posenet has 17 keypoints
    for (let i = 0; i < 17; i++) {
      this.orderedPose[i] = new Keypoint();
    }
  }

  update(newPose) {
    this.pose = _.cloneDeep(newPose);
    this.assignKeypoints();
  }

  assignKeypoints() {
    const orderedPose = this.orderedPose;
    const keypoints = this.pose.pose.keypoints;

    for (let i = 0; i < orderedPose.length; i++) {
      let keypoint = orderedPose[i];
      keypoint.setPosition(keypoints[i].position);
      keypoint.setVisibility(keypoints[i].score);
    }
  }

  draw() {
    const keypoints = this.orderedPose;

    if (keypoints.length === 0) return;

    for (let i = 0; i < keypoints.length; i++) {
      keypoints[i].draw();
    }
  }
}

export { Player };
