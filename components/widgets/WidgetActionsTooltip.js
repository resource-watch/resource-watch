import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

class WidgetActionsTooltip extends React.Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  @Autobind
  handleClick(link) {
    switch (link) { // eslint-disable-line default-case
      case 'edit_widget':
        this.props.onEditWidget();
        break;
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
            <button onClick={() => this.handleClick('edit_widget')}>
              Edit widget
            </button>
          </li>
          <li>
            <button onClick={() => this.handleClick('share_embed')}>
              Share/Embed
            </button>
          </li>
          <li>
            <button onClick={() => this.handleClick('add_to_dashboard')}>
              Add to dashboard
            </button>
          </li>
          <li>
            <button onClick={() => this.handleClick('go_to_dataset')}>
              Go to dataset
            </button>
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
  onShareEmbed: PropTypes.func.isRequired,
  onEditWidget: PropTypes.func.isRequired
};

export default WidgetActionsTooltip;
