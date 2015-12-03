module.exports = class Eventable {
  constructor() {
    this.events = [];
  }

  /*
   * Event System
   */

  on(action, callback) {
    this.events[action] = this.events[action] || [];
    this.events[action].push(callback);
  }

  off(action, callback) {
    this.events[action] = this.events[action] || [];

    if (callback) {
      // If a callback has been specified delete it specifically
      var index = this.events[action].indexOf(callback);
      (index !== -1) && this.events[action].splice(index, 1);
      return index !== -1;
    }

    // Else just erase all callbacks
    this.events[action] = [];
  }

  trigger(action, args=[]) {
    this.events[action] = this.events[action] || [];

    // Fire all events with the given callback
    this.events[action].forEach(function(callback) {
      callback.apply(null, args);
    });
  }
}
