import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Title from 'components/ui/Title';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';
import EmbedMyWidgetModal from 'components/modal/EmbedMyWidgetModal';
import WidgetActionsTooltip from 'components/widgets/WidgetActionsTooltip';
import Icon from 'components/ui/Icon';

// Services
import WidgetService from 'services/WidgetService';
import UserService from 'services/UserService';

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

  constructor(props) {
    super(props);

    // Services
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
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
    const tagName = event.target.tagName;
    if (tagName !== 'A' && tagName !== 'use') {
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
  handleAddToDashboard() {
    // TO-DO implement this
  }
  @Autobind
  handleGoToDataset() {
    Router.pushRoute('explore_detail', { id: this.props.widget.attributes.dataset });
  }
  @Autobind
  handleWidgetActionsClick(event) {
    const position = WidgetCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: WidgetActionsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onShareEmbed: this.handleEmbed,
        onAddToDashboard: this.handleAddToDashboard,
        onGoToDataset: this.handleGoToDataset
      }
    });
  }
  @Autobind
  handleStarClick(event) {
    event.preventDefault();
    const { widget, user } = this.props;
    if (confirm(`Are you sure you want to unfavourite the widget ${widget.attributes.name}`)) { // eslint-disable-line no-alert
      this.userService.deleteFavourite(widget.favouriteId, user.token)
        .then(() => {
          this.props.onWidgetUnfavourited();
        });
    }
  }

  render() {
    const { widget, showRemove, showActions, showEmbed, showStar, mode } = this.props;

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
            mode={mode}
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
          {(showActions || showRemove || showEmbed) &&
            <div className="actions">
              {showActions &&
                <a
                  className="c-button widget-actions"
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
              {showEmbed &&
                <a
                  className="c-button"
                  onClick={this.handleEmbed}
                  role="button"
                  tabIndex="0"
                >
                Embed
                </a>
              }
            </div>
          }
        </div>
        {showStar &&
          <a
            className="star-icon"
            role="button"
            tabIndex={0}
            onClick={this.handleStarClick}
          >
            <Icon name="icon-star-full" className="c-icon -small" />
          </a>
        }
      </div>
    );
  }
}

WidgetCard.defaultProps = {
  showActions: false,
  showRemove: false
};

WidgetCard.propTypes = {
  widget: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  showEmbed: PropTypes.bool,
  showStar: PropTypes.bool,
  mode: PropTypes.oneOf(['thumbnail', 'full']), // How to show the graph
  // Callbacks
  onWidgetRemove: PropTypes.func,
  onWidgetUnfavourited: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(WidgetCard);
