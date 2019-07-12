import React from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';

// Components
import Icon from 'components/ui/Icon';

class CollectionsRelatedContent extends React.Component {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      datasetsActive: false,
      widgetsActive: false,
      datasets: value.resources.filter(resource => resource.type === 'dataset'),
      widgets: value.resources.filter(resource => resource.type === 'widget')
    };

    // BINDINGS
    this.toggleTooltip = debounce(this.toggleTooltip.bind(this), 50);
  }

  toggleTooltip(specificDropdown, to) {
    this.setState({
      ...{
        datasetsActive: false,
        widgetsActive: false
      },
      [specificDropdown]: to
    });
  }

  render() {
    const { row } = this.props;
    const { datasets, widgets, widgetsActive, datasetsActive } = this.state;

    return (
      <div className="c-related-content">
        <ul>
          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[
                { to: 'window' }
              ]}
              targetOffset="-4px 0"
              classes={{ element: 'c-tooltip' }}
            >

                <a
                  onMouseEnter={() => this.toggleTooltip('datasetsActive', true)}
                  onMouseLeave={() => this.toggleTooltip('datasetsActive', false)}
                >
                  <Icon name="icon-table2" className="c-icon -small" />{' '}
                  <span>{datasets.length}</span>
                </a>

              {datasetsActive && (
                <div>
                  <span>Datasets {datasets.length}</span>
                </div>
              )}
            </TetherComponent>
          </li>

          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[
                { to: 'window' }
              ]}
              targetOffset="-4px 0"
              classes={{ element: 'c-tooltip' }}
            >
                <a
                  onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                  onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}
                >
                  <Icon name="icon-widgets" className="c-icon -small" />{' '}
                  <span>{widgets.length}</span>
                </a>
              {widgetsActive && (
                <div>
                  <span>Widgets {widgets.length}</span>
                </div>
              )}
            </TetherComponent>
          </li>
        </ul>
      </div>
    );
  }
}

CollectionsRelatedContent.propTypes = {
  value: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired
};

export default CollectionsRelatedContent;
