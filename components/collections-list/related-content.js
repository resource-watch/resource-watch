import React from 'react';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';

import TetherComponent from 'react-tether';

// Components
import Icon from 'components/ui/Icon';

class CollectionsRelatedContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widgetsActive: false,
      layersActive: false
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
      <td key={index} className="main">
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
            <Icon name="icon-layers" className="c-icon -small" />
          </a>
          {this.state.datasetsActive && <span>Datasets -1</span>}
        </TetherComponent>

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
            <Icon name="icon-widgets" className="c-icon -small" />
          </a>
          {this.state.widgetsActive && <span>Widgets -1</span>}
        </TetherComponent>

      </td>
    );
  }
}

export default connect(
  state => ({
    user: state.user
  })
)(CollectionsRelatedContent);
