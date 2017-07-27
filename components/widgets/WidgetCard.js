import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Title from 'components/ui/Title';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import EmbedMyWidgetModal from 'components/modal/EmbedMyWidgetModal';
import WidgetActionsTooltip from 'components/widgets/WidgetActionsTooltip';

// Services
import WidgetService from 'services/WidgetService';


class WidgetCard extends React.Component {

  /**
   * Return the position of the click within the page taking
   * into account the scroll (relative to the page, not the
   * viewport )
   * @static
   * @param {MouseEvent} e Event
   * @returns {{ x: number, y: number }}
   */
  static getClickPosition(e) {
    return {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    };
  }

  /**
   * HELPERS
   * - getDescription
  */
  static getDescription(_text) {
    let text = _text;
    if (typeof text === 'string' && text.length > 70) {
      text = text.replace(/^(.{70}[^\s]*).*/, '$1');
      return `${text}...`;
    }
    return text;
  }

  componentWillMount() {
    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });
  }


  /*
  * UI EVENTS
  *
  * - handleRemoveWidget
  * - handleClick
  */
  @Autobind
  handleRemoveWidget() {
    const widgetId = this.props.widget.id;
    const widgetName = this.props.widget.attributes.name;
    // eslint-disable-next-line no-alert
    if (confirm(`Are you sure you want to remove the widget: ${widgetName}?`)) {
      this.widgetService.removeUserWidget(widgetId, this.props.user.token)
        .then(() => this.props.onWidgetRemove())
        .catch(err => console.log(err)); // eslint-disable-line no-console
    }
  }
  @Autobind
  handleClick(event) {
    const { widget } = this.props;
    if (event.target.tagName !== 'A') {
      Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my-widgets', element: widget.id });
    }
  }
  @Autobind
  handleEmbed() {
    const options = {
      children: EmbedMyWidgetModal,
      childrenProps: {
        widgetId: this.props.widget.id
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }
  @Autobind
  handleWidgetActionsClick(event) {
    const position = WidgetCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: WidgetActionsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip
      }
    });
  }

  render() {
    const { widget, showRemove, showActions } = this.props;

    return (
      <div
        role="button"
        tabIndex={0}
        className={'c-widget-card'}
        onClick={this.handleClick}
      >
        {widget &&
          <DatasetWidgetChart
            widget={widget.attributes}
            mode="full"
          />
        }

        <div className="info">
          <div className="detail">
            {/* Title */}
            <Title className="-default -primary">
              {widget.attributes.name}
            </Title>
            <p>{WidgetCard.getDescription(widget.attributes.description)}</p>
          </div>
          <div className="actions">
            {showActions &&
              <a
                className="c-button"
                onClick={this.handleWidgetActionsClick}
                role="button"
                tabIndex="0"
              >
              Widget actions
              </a>
            }
            {showRemove &&
              <a
                className="c-button"
                onClick={this.handleRemoveWidget}
                role="button"
                tabIndex="0"
              >
              Delete
              </a>
            }
          </div>
        </div>
      </div>
    );
  }
}

WidgetCard.defaultProps = {
  showActions: true,
  showRemove: true
};

WidgetCard.propTypes = {
  widget: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  // Callbacks
  onWidgetRemove: PropTypes.func.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(WidgetCard);
