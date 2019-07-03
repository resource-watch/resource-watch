import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class WidgetActionsTooltip extends PureComponent {
  static propTypes = {
    isWidgetOwner: PropTypes.bool,
    widgetLinks: PropTypes.array,
    toggleTooltip: PropTypes.func.isRequired,
    // Callbacks
    onGoToDataset: PropTypes.func.isRequired,
    onAddToDashboard: PropTypes.func.isRequired,
    onShareEmbed: PropTypes.func.isRequired,
    onEditWidget: PropTypes.func.isRequired,
    onDownloadPDF: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  triggerMouseDown = (e) => {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  };

  handleClick = (link) => {
    switch (
      link // eslint-disable-line default-case
    ) {
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
      case 'download_pdf':
        this.props.onDownloadPDF();
        break;
      case 'delete':
        this.props.onRemove();
    }
    this.props.toggleTooltip(false);
  };

  render() {
    const { widgetLinks, isWidgetOwner } = this.props;
    return (
      <div className="c-widget-actions-tooltip">
        <ul>
          {isWidgetOwner && (
            <li>
              <button className="-desktopOnly" onClick={() => this.handleClick('edit_widget')}>
                Edit visualization
              </button>
            </li>
          )}
          <li>
            <button onClick={() => this.handleClick('share_embed')}>Share/Embed</button>
          </li>
          <li>
            <button onClick={() => this.handleClick('add_to_dashboard')}>Add to dashboard</button>
          </li>
          {widgetLinks.length === 0 && (
            <li>
              <button onClick={() => this.handleClick('go_to_dataset')}>Go to dataset</button>
            </li>
          )}
          {widgetLinks.map(link => (
            <li>
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                Go to {link.name}
              </a>
            </li>
          ))}
          <li>
            <button onClick={() => this.handleClick('download_pdf')}>Download as PDF</button>
          </li>
          {isWidgetOwner && (
            <li>
              <button onClick={() => this.handleClick('delete')}>Delete visualization</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default WidgetActionsTooltip;
