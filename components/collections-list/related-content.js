import React from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

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
    const { row, value, index, route } = this.props;
    return (
      <div className="c-related-content">
        <ul>

          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[{
                to: 'window'
              }]}
              targetOffset="-4px 0"
              classes={{
                element: 'c-tooltip'
              }}
            >
              <a
                onMouseEnter={() => this.toggleTooltip('datasetsActive', true)}
                onMouseLeave={() => this.toggleTooltip('datasetsActive', false)}>
                <Icon name="icon-layers" className="c-icon -small" /> <span>{this.state.datasets.length}</span>
              </a>

              {this.state.datasetsActive &&
                <div><span>Datasets {this.state.datasets.length}</span></div>}
            </TetherComponent>
          </li>

          <li>
            <TetherComponent
              attachment="bottom center"
              constraints={[{
                to: 'window'
              }]}
              targetOffset="-4px 0"
              classes={{
                element: 'c-tooltip'
              }}
            >
              <a
                onMouseEnter={() => this.toggleTooltip('widgetsActive', true)}
                onMouseLeave={() => this.toggleTooltip('widgetsActive', false)}>
                <Icon name="icon-widgets" className="c-icon -small" /> <span>{this.state.widgets.length}</span>
              </a>
              {this.state.widgetsActive &&
                <div><span>Widgets {this.state.widgets.length}</span></div>}
            </TetherComponent>
          </li>

        </ul>
      </div>
    );
  }
}

CollectionsRelatedContent.propTypes = {
  value: PropTypes.object.isRequired
};

export default connect(
  state => ({
    user: state.user
  })
)(CollectionsRelatedContent);
