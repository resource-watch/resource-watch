import React from 'react';
import PropTypes from 'prop-types';

class WidgetActionsTooltip extends React.Component {
  constructor(props) {
    super(props);

    // ---------------------- Bindings --------------------------
    this.triggerMouseDown = this.triggerMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // ----------------------------------------------------------
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

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
      case 'download_pdf':
        this.props.onDownloadPDF();
    }
    this.props.toggleTooltip(false);
  }

  render() {
    const { widgetLinks } = this.props;
    return (
      <div className="c-widget-actions-tooltip">
        <ul>
          { this.props.isWidgetOwner &&
            <li>
              <button onClick={() => this.handleClick('edit_widget')}>
                Edit widget
              </button>
            </li>
          }
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
          {widgetLinks.length === 0 &&
            <li>
              <button onClick={() => this.handleClick('go_to_dataset')}>
                Go to dataset
              </button>
            </li>
          }
          {widgetLinks.map(link =>
            (<li>
              <a href={link.link} target="_blank">Go to {link.name}</a>
            </li>)
          )}
          <li>
            <button onClick={() => this.handleClick('download_pdf')}>
              Download as PDF
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

WidgetActionsTooltip.propTypes = {
  isWidgetOwner: PropTypes.bool,
  widgetLinks: PropTypes.array,
  toggleTooltip: PropTypes.func.isRequired,
  // Callbacks
  onGoToDataset: PropTypes.func.isRequired,
  onAddToDashboard: PropTypes.func.isRequired,
  onShareEmbed: PropTypes.func.isRequired,
  onEditWidget: PropTypes.func.isRequired,
  onDownloadPDF: PropTypes.func.isRequired
};

export default WidgetActionsTooltip;
