import React from 'react';
import classnames from 'classnames';
import renderHTML from 'react-render-html';

// Router
import { Router } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getPublicDashboards } from 'redactions/dashboards';
import { getDashboard } from 'redactions/dashboardDetail';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardCard from 'components/app/dashboards/DashboardCard';
import Spinner from 'components/ui/Spinner';

// Services
import UserService from 'services/UserService';

// Utils
import DASHBOARDS from 'utils/dashboards/config';

class DashboardsDetail extends Page {
  /**
   * Return the URL of the dashboard image
   * NOTE: return null if no image
   * @static
   * @param {string|object} image
   */
  static getDashboardImageUrl(image) {
    if (!image) return null;

    if (typeof image === 'object') {
      // If no image has been uploaded, we just don't display anything
      if (/missing\.png$/.test(image.original)) return null;
      return `${process.env.STATIC_SERVER_URL}${image.original}`;
    } else if (typeof image === 'string') {
      return `/${image}`;
    }

    return null;
  }

  // constructor(props) {
  //   super(props);
    // this.state = {
    //   // Pointer to the selected dashboard
    //   selectedDashboard: null,
    //   // Whether to show all the dashboards or just a few
    //   showMore: false,
    //   // User favourites
    //   favourites: []
    // };

    // Services
    // this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  // }

  /**
  * COMPONENT LIFECYCLE
  * - componentDidMount
  * - componentWillReceiveProps
  */
  componentDidMount() {
    this.props.getPublicDashboards();
    this.props.getDashboard(this.props.url.query.slug);
    // Load favorites
    // if (this.props.user.id) {
    //   this.loadFavourites();
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.url.query.slug !== prevProps.url.query.slug)
      this.props.getDashboard(this.props.url.query.slug);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (nextProps.url.query.slug !== this.props.url.query.url);
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.user.id && !this.props.user.id) {
  //     this.loadFavourites();
  //   }
  // }

  /**
  * Loads all favourite resources from the user that is logged in
  */
  // loadFavourites() {
  //   this.userService.getFavourites(`Bearer ${this.props.user.token}`)
  //     .then((response) => {
  //       this.setState({
  //         favourites: response
  //       });
  //     });
  // }

  /**
   * Checks whether the widget is one the user favourites
   * @param {string} widgetId Widget's ID
   * @returns {boolean}
   */
  isFavourite(widgetId) {
    return false;
    // const { favourites } = this.state;
    // const isFavourite = favourites
    //   && favourites.find(val => val.attributes.resourceId === widgetId);
    // return !!isFavourite;
  }

  /**
   * Event handler executed when a different dashboard is selected
   * @param {string} slug Slug of the selected dashboard
   */
  onChangeDashboard(slug, dash) {
    // The countries dashboard is still ran by the old
    // application, so the URL is different
    if (slug === 'countries') {
      window.location = '/countries';
      return;
    }

    // const dashboards = dash || this.state.dashboards;
    // If we can't find the dashboard with the specified slug, we just
    // set the first dashboard as the active one
    // const selectedDashboard = dashboards.find(dashboard => dashboard.slug === slug)
    //   || dashboards[0];

    // this.setState({ selectedDashboard });

    // We update the URL anyway (only on the client)
    Router.replaceRoute('dashboards_detail', { slug });
  }

  /**
   * Fetch the dashboards, save them in the state, set a default
   * selected dashboard and update the URL
   */
  // async getDashboards() {
  //   this.setState({ loading: true, error: null });

  //   try {
  //     const staticDashboards = DASHBOARDS;
  //     const dynamicDashboards = await DashboardsDetail.fetchDashboards();
  //     const dashboards = [...staticDashboards, ...dynamicDashboards];
  //     this.setState({ dashboards });

  //     // We set the dashboard associated with the slug
  //     this.onChangeDashboard(this.props.url.query.slug, dashboards);
  //   } catch (err) {
  //     this.setState({ error: err.message });
  //   } finally {
  //     this.setState({ loading: false });
  //   }
  // }

  render() {
    const { url, user, dashboards, dashboardDetail } = this.props;
    const selectedDashboard = dashboardDetail.data;
    const dashboardName = selectedDashboard ? `${selectedDashboard.name} dashboard` : 'Dashboard';

    return (
      <Layout
        title={dashboardName}
        description={selectedDashboard && selectedDashboard.summary ? selectedDashboard.summary : 'Resource Watch Dashboards'}
        url={url}
        user={user}
        pageHeader
        className="page-dashboards c-page-dashboards"
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />
                  <h1>Dashboards</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="l-section -secondary">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                { dashboards.loading && <Spinner isLoading className="-light" /> }
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    dashboards.list.map(dashboard => (
                      <li
                        className={classnames({
                          '-active': selectedDashboard === dashboard
                        })}
                        key={dashboard.slug}
                        style={{
                          backgroundImage: dashboard.photo
                            && DashboardsDetail.getDashboardImageUrl(dashboard.photo)
                            && `url(${DashboardsDetail.getDashboardImageUrl(dashboard.photo)})`
                        }}
                      >
                        <input
                          type="radio"
                          name="dashboard"
                          id={`dashboard-${dashboard.slug}`}
                          value={dashboard.slug}
                          checked={selectedDashboard === dashboard}
                          onChange={e => this.onChangeDashboard(e.target.value)}
                        />
                        <label className="content" htmlFor={`dashboard-${dashboard.slug}`}>
                          {dashboard.name}
                        </label>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                { dashboards.error && (
                  <p className="error">{this.state.error}</p>
                ) }
                { selectedDashboard && (
                  <div>
                    <h2>{selectedDashboard.name}</h2>
                    <p>{selectedDashboard.summary}</p>
                  </div>
                ) }
              </div>
            </div>
          </div>
        </section>

        <div className="l-container">
          <div className="row">
            { selectedDashboard && selectedDashboard.widgets && (
              <div className="column small-12 widgets-list">
                {
                  selectedDashboard.widgets.map(widget => (
                    <DashboardCard
                      key={widget.name || widget.widgetId}
                      widgetId={widget.widgetId}
                      categories={widget.categories}
                      isFavourite={this.isFavourite(widget.widgetId)}
                      name={widget.name}
                      data={widget.data}
                    />
                  ))
                }
              </div>
            ) }
            { selectedDashboard && !selectedDashboard.widgets && (
              <div className="user-content column small-12 large-8 large-offset-2">
                {renderHTML(selectedDashboard.content || '')}
              </div>
            ) }
          </div>

        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  dashboards: state.clientDashboards,
  dashboardDetail: state.dashboardDetail
});

const mapDispatchToProps = dispatch => ({
  getPublicDashboards: bindActionCreators(getPublicDashboards, dispatch),
  getDashboard: bindActionCreators(getDashboard, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);
