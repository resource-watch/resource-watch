import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import TetherComponent from 'react-tether';
import Icon from 'components/ui/icon';
import RadioGroup from 'components/form/RadioGroup';
import Checkbox from 'components/form/Checkbox';

// constants
import { BASEMAPS, LABELS } from 'components/map/constants';

// Utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class BasemapControls extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    labels: PropTypes.object,
    boundaries: PropTypes.bool,
    onChangeBasemap: PropTypes.func,
    onChangeLabels: PropTypes.func,
    onChangeBoundaries: PropTypes.func
  };

  static defaultProps = {
    // STORE
    basemap: {},
    labels: {},
    boundaries: false,

    // ACTIONS
    onChangeBasemap: (b) => { console.info(b); },
    onChangeLabels: (l) => { console.info(l); },
    onChangeBoundaries: (b) => { console.info(b); }
  };

  state = { active: false }

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
    logEvent('Explore Map', 'change basemap', basemap);
    this.props.onChangeBasemap(BASEMAPS[basemap]);
  }

  onLabelsChange = (labels) => {
    this.props.onChangeLabels(LABELS[labels]);
  }

  onBoundariesChange = (boundaries) => {
    this.props.onChangeBoundaries(boundaries.checked);
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
    const { basemap, labels, boundaries } = this.props;
    const { active } = this.state;

    return (
      <div className="c-basemap-control">
        <TetherComponent
          attachment="top right"
          constraints={[{ to: 'window' }]}
          targetOffset="8px 100%"
          classes={{ element: 'c-tooltip -arrow-right' }}
        >
          {/* First child: This is what the item will be tethered to */}
          <button
            type="button"
            className="basemap-control--btn"
            onClick={() => this.toggleDropdown(true)}
          >
            <Icon
              name="icon-layers"
              className="-small"
            />
          </button>

          {/* Second child: If present, this item will be tethered to the the first child */}
          {active &&
            <div>
              <RadioGroup
                options={Object.keys(BASEMAPS).map((k) => {
                  const bs = BASEMAPS[k];
                  return {
                    label: bs.label,
                    value: bs.id
                  };
                })}
                name="basemap"
                properties={{ default: basemap.id }}
                onChange={this.onBasemapChange}
              />

              <div className="divisor" />

              <RadioGroup
                options={Object.keys(LABELS).map(k => ({
                  label: LABELS[k].label,
                  value: LABELS[k].id
                }))}
                name="labels"
                properties={{ default: labels.id }}
                onChange={this.onLabelsChange}
              />

              <div className="divisor" />

              <Checkbox
                properties={{
                  name: 'boundaries',
                  title: 'Boundaries',
                  value: 'boundaries',
                  checked: boundaries
                }}
                onChange={this.onBoundariesChange}
              />
            </div>
          }
        </TetherComponent>
      </div>
    );
  }
}

export default BasemapControls;
