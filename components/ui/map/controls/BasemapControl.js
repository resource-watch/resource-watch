import React from 'react';
import PropTypes from 'prop-types';

import { LABELS } from 'components/ui/map/constants';

// Redux
import { connect } from 'react-redux';
import { setBasemap, setLabels } from 'redactions/explore';

// Components
import TetherComponent from 'react-tether';
import Icon from 'components/ui/Icon';
import RadioGroup from 'components/form/RadioGroup';

class BasemapControl extends React.Component {
  static propTypes = {
    // STORE
    basemapControl: PropTypes.object,
    basemap: PropTypes.object,
    labels: PropTypes.string,

    // ACTIONS
    setBasemap: PropTypes.func,
    setLabels: PropTypes.func
  };

  state = {
    active: false
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onScreenClick);
  }

  onScreenClick = (e) => {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.toggleDropdown(false);
    }
  }

  onBasemapChange = (basemap) => {
    const { basemapControl } = this.props;

    this.props.setBasemap(basemapControl.basemaps[basemap]);
  }

  onLabelChange = (labels) => {
    this.props.setLabels(labels);
  }

  toggleDropdown = (to) => {
    const active = (typeof to !== 'undefined' && to !== null) ? to : !this.state.active;

    this.setState({ active });

    requestAnimationFrame(() => {
      if (to) {
        window.addEventListener('click', this.onScreenClick);
      } else {
        window.removeEventListener('click', this.onScreenClick);
      }
    });
    this.setState({ active });
  }

  // RENDER
  render() {
    const { basemap, basemapControl, labels } = this.props;
    const { active } = this.state;

    return (
      <TetherComponent
        attachment="top right"
        constraints={[{
          to: 'window'
        }]}
        targetOffset="8px 100%"
        classes={{
          element: 'c-tooltip -arrow-right'
        }}
      >
        {/* First child: This is what the item will be tethered to */}
        <button type="button" className="basemap-button" onClick={() => this.toggleDropdown(true)}>
          <Icon name="icon-layers" className="-small" />
        </button>

        {/* Second child: If present, this item will be tethered to the the first child */}
        {active &&
          <div>
            <RadioGroup
              options={Object.keys(basemapControl.basemaps).map((k) => {
                const bs = basemapControl.basemaps[k];
                return {
                  label: bs.label,
                  value: bs.id
                };
              })}
              name="basemap"
              properties={{
                default: basemap.id
              }}
              onChange={this.onBasemapChange}
            />
            <div className="divisor" />
            <RadioGroup
              options={Object.keys(LABELS).map(k => ({
                label: LABELS[k].label,
                value: LABELS[k].id
              }))}
              name="labels"
              properties={{
                default: labels
              }}
              onChange={this.onLabelChange}
            />
          </div>
        }
      </TetherComponent>
    );
  }
}

export default (connect(
  state => ({
    basemap: state.explore.basemap,
    basemapControl: state.explore.basemapControl,
    labels: state.explore.labels
  }),
  {
    setBasemap,
    setLabels
  }
)(BasemapControl));
