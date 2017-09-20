import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

const actions = {};
actions.toggleDock = (opened, opts = {}) => emitter.emit('toggleDock', opened, opts);
actions.setDockOptions = (opts = {}) => emitter.emit('setDockOptions', opts);

export const EE = emitter;
export default actions;
