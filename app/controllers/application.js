import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class ApplicationController extends Controller {
  /**
   * Runs `callback` shortly after the next browser Frame is produced.
   * ref: https://webperf.tips/tip/measuring-paint-time
   */
  runAfterFramePaint(callback) {
    let done = false;

    // Queue a "before Render Steps" callback via requestAnimationFrame.
    requestAnimationFrame(() => {
      // MessageChannel is one of the highest priority task queues
      // which will be executed after the frame has painted.
      const messageChannel = new MessageChannel();

      // Setup the callback to run in a Task
      messageChannel.port1.onmessage = () => {
        done = true;
        callback();
      };

      // Queue the Task on the Task Queue
      messageChannel.port2.postMessage(undefined);
    });
  }

  @action
  trackPainted() {
    this.runAfterFramePaint(() => {
      performance.mark("paint");

      try {
        performance.measure(
          "init-to-paint",
          "init",
          "paint"
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to measure init-to-paint", e);
      }
    });
  }
}


