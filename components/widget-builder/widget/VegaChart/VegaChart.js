// source: https://github.com/kristw/react-vega

import PropTypes from 'prop-types';
import React from 'react';
import vg from 'vega';
import { capitalize, isDefined, isFunction } from './utils';

class Vega extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    spec: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    padding: PropTypes.object,
    viewport: PropTypes.array,
    renderer: PropTypes.string,
    data: PropTypes.object,
    updateOptions: PropTypes.object,
    config: PropTypes.object
  }

  static defaultProps = {
    width: 400,
    height: 300
  }

  static isSameViewport(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((value, index) => value === b[index]);
    }
    return a === b;
  }

  static isSamePadding(a, b) {
    if (isDefined(a) && isDefined(b)) {
      return a.top === b.top
        && a.left === b.left
        && a.right === b.right
        && a.bottom === b.bottom;
    }
    return a === b;
  }

  static isSameData(a, b) {
    return a === b && !isFunction(a);
  }

  static isSameSpec(a, b) {
    return a === b
      || JSON.stringify(a) === JSON.stringify(b);
  }

  static listenerName(signalName) {
    return `onSignal${capitalize(signalName)}`;
  }

  componentDidMount() {
    this.createVis(this.props.spec);
  }

  shouldComponentUpdate(nextProps) {
    const a = this.props;
    const b = nextProps;
    return ['width', 'height', 'renderer', 'spec', 'data', 'className', 'style', 'config']
      .some(name => a[name] !== b[name])
      || !Vega.isSameViewport(a.viewport, b.viewport)
      || !Vega.isSamePadding(a.padding, b.padding);
  }

  componentDidUpdate(prevProps) {
    if (!Vega.isSameSpec(this.props.spec, prevProps.spec)) {
      this.clearListeners(this.props.spec);
      this.createVis(this.props.spec);
    } else if (this.vis) {
      const props = this.props;
      const spec = this.props.spec;
      let changed = false;

      // update view properties
      ['width', 'height', 'renderer'].forEach((field) => {
        if (props[field] !== prevProps[field]) {
          this.vis[field](props[field] || spec[field]);
          changed = true;
        }
      });

      if (!Vega.isSameViewport) {
        this.vis.viewport(props.viewport || spec.viewport);
        changed = true;
      }
      if (!Vega.isSamePadding) {
        this.vis.padding(props.padding || spec.padding);
        changed = true;
      }

      // update data
      if (spec.data && props.data) {
        this.vis.update();
        spec.data.forEach((d) => {
          const oldData = prevProps.data[d.name];
          const newData = props.data[d.name];
          if (!Vega.isSameData(oldData, newData)) {
            this.updateData(d.name, newData);
            changed = true;
          }
        });
      }

      if (changed) {
        this.vis.update(props.updateOptions);
      }
    }
  }

  componentWillUnmount() {
    this.clearListeners(this.props.spec);
  }

  createVis(spec) {
    if (spec) {
      const { width, height, padding, viewport, data, config, renderer } = this.props;
      // Parse the vega spec and create the vis
      vg.parse.spec(spec, config, (chart) => {
        const vis = chart({ el: this.element });

        // Attach listeners onto the signals
        if (spec.signals) {
          spec.signals.forEach((signal) => {
            vis.onSignal(signal.name, (...args) => {
              const listener = this.props[Vega.listenerName(signal.name)];
              if (listener) {
                listener.apply(this, args);
              }
            });
          });
        }

        // store the vis object to be used on later updates
        this.vis = vis;

        vis
          .width(width || spec.width)
          .height(height || spec.height)
          .padding(padding || spec.padding)
          .viewport(viewport || spec.viewport);
        if (renderer) {
          vis.renderer(renderer);
        }
        if (spec.data && data) {
          vis.update();
          spec.data.forEach((d) => {
            this.updateData(d.name, data[d.name]);
          });
        }
        vis.update();
      });
    } else {
      this.clearListeners(this.props.spec);
      this.vis = null;
    }
    return this;
  }

  updateData(name, value) {
    if (value) {
      if (isFunction(value)) {
        value(this.vis.data(name));
      } else {
        this.vis.data(name)
          .remove(() => true)
          .insert(value);
      }
    }
  }

  // Remove listeners from the signals
  clearListeners(spec) {
    const vis = this.vis;
    if (vis && spec && spec.signals) {
      spec.signals.forEach(signal => vis.offSignal(signal.name));
    }
    return this;
  }

  render() {
    return (
      // Create the container Vega draws inside
      <div
        ref={(c) => { this.element = c; }}
        className={this.props.className}
        style={this.props.style}
      />
    );
  }
}

export default Vega;
