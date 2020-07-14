import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class WidgetActionsTooltip extends PureComponent {
  static propTypes = {
    isWidgetOwner: PropTypes.bool.isRequired,
    widgetLinks: PropTypes.array,
    toggleTooltip: PropTypes.func.isRequired,
    onGoToDataset: PropTypes.func.isRequired,
    onShareEmbed: PropTypes.func.isRequired,
    onEditWidget: PropTypes.func.isRequired,
    onDownloadPDF: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  static defaultProps = { widgetLinks: [] }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  triggerMouseDown = (e) => {
    const el = document.querySelector('.c-rc-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) this.props.toggleTooltip(false);
  };

  handleClick = (action) => {
    const {
      onEditWidget,
      onGoToDataset,
      onShareEmbed,
      onDownloadPDF,
      onRemove,
      toggleTooltip
    } = this.props;

    switch (action) {
      case 'edit_widget':
        onEditWidget();
        break;
      case 'go_to_dataset':
        onGoToDataset();
        break;
      case 'share_embed':
        onShareEmbed();
        break;
      case 'download_pdf':
        onDownloadPDF();
        break;
      case 'delete':
        onRemove();
        break;
      default:
        console.error('action not supported');
    }

    toggleTooltip(false);
  };

  render() {
    const { widgetLinks, isWidgetOwner } = this.props;

    return (
      <div className="c-widget-actions-tooltip">
        <ul>
          {isWidgetOwner && (
            <li>
              <button
                type="button"
                className="-desktopOnly"
                onClick={() => this.handleClick('edit_widget')}
              >
                Edit visualization
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => this.handleClick('share_embed')}
            >
              Share/Embed
            </button>
          </li>
          {widgetLinks.length === 0 && (
            <li>
              <button
                type="button"
                onClick={() => this.handleClick('go_to_dataset')}
              >
                Go to dataset
              </button>
            </li>
          )}
          {widgetLinks.map(link => (
            <li>
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to {link.name}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => this.handleClick('download_pdf')}
            >
              Download as PDF
            </button>
          </li>
          {isWidgetOwner && (
            <li>
              <button
                type="button"
                onClick={() => this.handleClick('delete')}
              >
                Delete visualization
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default WidgetActionsTooltip;
