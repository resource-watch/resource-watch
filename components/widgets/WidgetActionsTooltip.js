import React from 'react';
import PropTypes from 'prop-types';

class WidgetActionsTooltip extends React.Component {

  handleClick(link) {
    switch (link) { // eslint-disable-line default-case
      case 'go_to_dataset':
        this.props.onGoToDataset();
        break;
      case 'add_to_dashboard':
        this.props.onAddToDashboard();
        break;
      case 'share_embed':
        this.props.onShareEmbed();
        break;
    }
    this.props.toggleTooltip(false);
  }

  render() {
    return (
      <div className="c-widget-actions-tooltip">
        <ul>
          <li>
            <a
              role="button"
              tabIndex={0}
              onClick={() => this.handleClick('share_embed')}
            >
              Share/Embed
            </a>
          </li>
          <li>
            <a
              role="button"
              tabIndex={0}
              onClick={() => this.handleClick('go_to_dataset')}
            >
              Add to dashboard
            </a>
          </li>
          <li>
            <a
              role="button"
              tabIndex={0}
              onClick={() => this.handleClick('go_to_dataset')}
            >
              Go to dataset
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

WidgetActionsTooltip.propTypes = {
  toggleTooltip: PropTypes.func.isRequired,
  // Callbacks
  onGoToDataset: PropTypes.func.isRequired,
  onAddToDashboard: PropTypes.func.isRequired,
  onShareEmbed: PropTypes.func.isRequired
};

export default WidgetActionsTooltip;
