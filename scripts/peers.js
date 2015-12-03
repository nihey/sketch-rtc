import MRTC from 'mrtc';
import Eventable from 'eventable';

module.exports = class Peers extends Eventable {
  constructor(options) {
    super()
    this.peers = {};
    this.signaller = options.signaller;
  }

  /*
   * Public API
   */

  add(id, signal=null) {
    if (!this.peers[id]) {
      this.peers[id] = new MRTC({dataChannel: true, offerer: signal === null});
      this.peers[id].on('signal', this.onSignal.bind(this, id));
      this.peers[id].on('channel-open', this.onOpen.bind(this, id));
      this.peers[id].on('channel-message', this.onData.bind(this, id));
      this.peers[id].on('channel-close', this.onClose.bind(this, id));
    }

    if (signal) {
      this.peers[id].addSignal(signal);
    }
  }

  send(data) {
    data = JSON.stringify(data);
    Object.keys(this.peers).forEach(function(key) {
      let channel = this.peers[key].channel;
      if (channel.readyState === 'open') {
        channel.send(data);
      }
    }, this);
  }

  /*
   * MRTC Hooks
   */

  onSignal(id, signal) {
    this.signaller.emit('signal', {
      dest: id,
      signal,
    });
  }

  onOpen(id) {
    this.trigger('connect', [id]);
  }

  onData(id, event) {
    this.trigger('data', [id, JSON.parse(event.data)]);
  }

  onClose(id) {
    this.trigger('disconnect', [id]);
  }
};
