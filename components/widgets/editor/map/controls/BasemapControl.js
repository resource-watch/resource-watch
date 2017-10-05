import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { setBasemap } from 'redactions/explore';

// Components
import TetherComponent from 'react-tether';
import Icon from 'components/widgets/editor/ui/Icon';
import RadioGroup from 'components/widgets/editor/form/RadioGroup';

class BasemapControl extends React.Component {
  static propTypes = {
    // STORE
    basemapControl: PropTypes.object,
    basemap: PropTypes.object,

    // ACTIONS
    setBasemap: PropTypes.func
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
    const { basemap, basemapControl } = this.props;
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
        }
      </TetherComponent>
    );
  }
}

export default (connect(
  state => ({
    basemap: state.explore.basemap,
    basemapControl: state.explore.basemapControl
  }),
  {
    setBasemap
  }
)(BasemapControl));
