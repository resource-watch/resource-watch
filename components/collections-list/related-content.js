import React from 'react';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import { Link } from 'routes';

// Components
import Icon from 'components/ui/icon';

class CollectionsRelatedContent extends React.Component {
  state = {
    datasetsActive: false,
    widgetsActive: false,
    datasets: this.props.value.filter(resource => resource.type === 'dataset'),
    widgets: this.props.value.filter(resource => resource.type === 'widget')
  };

  toggleTooltip = (specificDropdown, to) => {
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
              constraints={[{ to: 'window' }]}
              targetOffset="-4px 0"
              classes={{ element: 'c-tooltip' }}
            >
              <Link route="myrw" params={{ tab: 'datasets', subtab: row.id }} >
                <a
                  onMouseEnter={() => this.toggleTooltip('datasetsActive', true)}
                  onMouseLeave={() => this.toggleTooltip('datasetsActive', false)}
                >
                  <Icon name="icon-table2" className="c-icon -small" /> <span>{datasets.length}</span>
                </a>
              </Link>

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
              constraints={[{ to: 'window' }]}
              targetOffset="-4px 0"
              classes={{ element: 'c-tooltip' }}
            >
              <Link route="myrw" params={{ tab: 'widgets', subtab: row.id }} >
                <a
                  onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                  onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}
                >
                  <Icon name="icon-widgets" className="c-icon -small" /> <span>{widgets.length}</span>
                </a>
              </Link>
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
