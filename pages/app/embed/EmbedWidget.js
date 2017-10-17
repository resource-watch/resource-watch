import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import d3 from 'd3';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget } from 'redactions/widget';
import { setUser } from 'redactions/user';
import { setRouter, Router } from 'redactions/routes';

// Components
import Page from 'components/app/layout/Page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import VegaChart from 'components/widgets/charts/VegaChart';
import Spinner from 'components/ui/Spinner';
import ChartTheme from 'utils/widgets/theme';
import Icon from 'components/widgets/editor/ui/Icon';

// Services
import UserService from 'services/UserService';

class EmbedWidget extends Page {
  static getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    const referer = isServer ? req.headers.referer : location.href;
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    return { user, isServer, url, referer, isLoading: true };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: props.isLoading,
      modalOpened: false,
      favorite: null,
      userIsLoggedIn: false
    };

    // Services
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    const { url } = this.props;
    this.props.getWidget(url.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.widget !== this.props.widget) {
      const { user } = this.props;
      if (user.id) {
        this.setState({ isLoading: true });
        this.userService.getFavouriteWidgets(user.token)
          .then((response) => {
            const found = response.find(elem => elem.attributes.resourceId === nextProps.widget.id);
            this.setState({
              userIsLoggedIn: true,
              favorite: found,
              isLoading: false
            });
          });
      }
    }
  }

  getModal() {
    const { widget, bandDescription, bandStats } = this.props;
    return (
      <div className="widget-modal">
        { !widget.attributes.description && !bandDescription && isEmpty(bandStats) &&
          <p>No additional information is available</p>
        }

        { widget.attributes.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.attributes.description}</p>
          </div>
        ) }

        { bandDescription && (
          <div>
            <h4>Band description</h4>
            <p>{bandDescription}</p>
          </div>
        ) }

        { !isEmpty(bandStats) && (
          <div>
            <h4>Statistical information</h4>
            <div className="c-table">
              <table>
                <thead>
                  <tr>
                    { Object.keys(bandStats).map(name => <th key={name}>{name}</th>) }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    { Object.keys(bandStats).map((name) => {
                      const number = d3.format('.4s')(bandStats[name]);
                      return (
                        <td key={name}>{number}</td>
                      );
                    }) }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) }
      </div>
    );
  }

  @Autobind
  handleFavouriteClick() {
    const { favorite } = this.state;
    const { widget, user } = this.props;

    if (user.id) {
      this.setState({ isLoading: true });

      if (favorite) {
        this.userService.deleteFavourite(favorite.id, user.token)
          .then(() => {
            this.setState({
              favorite: null,
              isLoading: false
            });
          })
          .catch(err => toastr.error('Error unfavoriting the widget', err));
      } else {
        this.userService.createFavouriteWidget(widget.id, user.token)
          .then((res) => {
            this.setState({
              favorite: res.data,
              isLoading: false
            });
          })
          .catch(err => toastr.error('Error setting the widget as favorite', err));
      }
    } else {
      toastr.confirm('You need to be logged in in order to favorite a widget. Click OK to sign up to RW!', {
        onOk: () => {
          // TODO We need to redirect to the sign up page instead of to the home page
          Router.pushRouter('/');
        }
      });
    }
  }

  render() {
    const { widget, loading, error } = this.props;
    const { isLoading, modalOpened, favorite } = this.state;

    const favoriteIcon = favorite ? 'star-full' : 'star-empty';

    if (loading) {
      return (
        <EmbedLayout
          title={'Loading widget...'}
          description={''}
        >
          <div className="c-embed-widget">
            <Spinner isLoading className="-light" />
          </div>
        </EmbedLayout>
      );
    }

    if (error) {
      return (
        <EmbedLayout
          title={'Resource Watch'}
          description={''}
        >
          <div className="c-embed-widget">
            <div className="widget-title">
              <h4>–</h4>
            </div>

            <div className="widget-content">
              <p>{'Sorry, the widget couldn\'t be loaded'}</p>
            </div>

            { this.isLoadedExternally() && (
              <div className="widget-footer">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src={'/static/images/logo-embed.png'}
                    alt="Resource Watch"
                  />
                </a>
              </div>
            ) }
          </div>
        </EmbedLayout>
      );
    }

    return (
      <EmbedLayout
        title={`${widget.attributes.name}`}
        description={`${widget.attributes.description || ''}`}
      >
        <div className="c-embed-widget">
          <Spinner isLoading={isLoading} className="-light" />
          <div className="widget-title">
            <a href={`/data/explore/${widget.attributes.dataset}`} target="_blank" rel="noopener noreferrer">
              <h4>{widget.attributes.name}</h4>
            </a>
            <div className="buttons">
              <button
                onClick={this.handleFavouriteClick}
              >
                <Icon name={`icon-${favoriteIcon}`} className="c-icon -small" />
              </button>
              <button
                aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                onClick={() => this.setState({ modalOpened: !modalOpened })}
              >
                <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
              </button>
            </div>
          </div>
          <div className="widget-content">
            <VegaChart
              data={widget.attributes.widgetConfig}
              theme={ChartTheme()}
              toggleLoading={l => this.setState({ isLoading: l })}
              reloadOnResize
            />
            { modalOpened && this.getModal() }
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src={'/static/images/logo-embed.png'}
                  alt="Resource Watch"
                />
              </a>
            </div>
          ) }
        </div>
      </EmbedLayout>
    );
  }
}

EmbedWidget.propTypes = {
  widget: PropTypes.object,
  getWidget: PropTypes.func,
  bandDescription: PropTypes.string,
  bandStats: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string
};

EmbedWidget.defaultProps = {
  widget: {}
};

const mapStateToProps = state => ({
  widget: state.widget.data,
  loading: state.widget.loading,
  error: state.widget.error,
  bandDescription: state.widget.bandDescription,
  bandStats: state.widget.bandStats,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedWidget);
