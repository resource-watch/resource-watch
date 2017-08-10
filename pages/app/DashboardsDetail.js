import React from 'react';
import classnames from 'classnames';

// Router
import { Router } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardCard from 'components/app/dashboards/DashboardCard';
import Spinner from 'components/ui/Spinner';

// Services
import UserService from 'services/UserService';

// Utils
import DASHBOARDS from 'utils/dashboards/config';

class DashboardsDetail extends Page {

  /**
   * Fetch the list of dashboards
   * @static
   * @returns {Promise<{ name: string, slug: string, photo: string }[]>}
   */
  static async fetchDashboards() {
    return fetch(`${process.env.API_URL}/dashboards?fields[dashboards]=name,slug,photo`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Unable to fetch the dashboards');
      })
      .then(({ data }) => data.map(d => d.attributes));
  }

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

  constructor(props) {
    super(props);
    this.state = {
      // Whether we're loading the dashboards
      loading: false,
      // Error message
      error: null,
      // List of dashboards
      dashboards: [],
      // Pointer to the selected dashboard
      selectedDashboard: null,
      // Whether to show all the dashboards or just a few
      showMore: false,
      // User favourites
      favourites: []
    };

    // Services
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.getDashboards();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id && !this.props.user.id) {
      this.loadFavourites();
    }
  }

  componentDidMount() {
    // Load favorites
    if (this.props.user.id) {
      this.loadFavourites();
    }
  }

  /**
  * Loads all favourite resources from the user that is logged in
  */
  loadFavourites() {
    this.userService.getFavourites(`Bearer ${this.props.user.token}`)
      .then((response) => {
        this.setState({
          favourites: response
        });
      });
  }

  /**
   * Checks whether the widget is one the user favourites
   * @param {string} widgetId Widget's ID
   * @returns {boolean}
   */
  isFavourite(widgetId) {
    const { favourites } = this.state;
    const isFavourite = favourites
      && favourites.find(val => val.attributes.resourceId === widgetId);
    return !!isFavourite;
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

    const dashboards = dash || this.state.dashboards;

    // If we can't find the dashboard with the specified slug, we just
    // set the first dashboard as the active one
    const selectedDashboard = dashboards.find(dashboard => dashboard.slug === slug)
      || dashboards[0];

    this.setState({ selectedDashboard });

    // We update the URL anyway (only on the client)
    if (typeof window !== 'undefined') {
      Router.replaceRoute('dashboards_detail', { slug: selectedDashboard.slug });
    }
  }

  /**
   * Fetch the dashboards, save them in the state, set a default
   * selected dashboard and update the URL
   */
  async getDashboards() {
    this.setState({ loading: true, error: null });

    try {
      const staticDashboards = DASHBOARDS;
      const dynamicDashboards = await DashboardsDetail.fetchDashboards();
      const dashboards = [...staticDashboards, ...dynamicDashboards];
      this.setState({ dashboards });

      // We set the dashboard associated with the slug
      this.onChangeDashboard(this.props.url.query.slug, dashboards);
    } catch (err) {
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { url, user } = this.props;
    const { selectedDashboard, showMore, dashboards } = this.state;
    const dashboardName = this.state.selectedDashboard ? `${selectedDashboard.name} dashboard` : '–';
    return (
      <Layout
        title={dashboardName}
        description={selectedDashboard ? selectedDashboard.summary : 'Resource Watch Dashboards'}
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
                { this.state.loading && <Spinner isLoading className="-light" /> }

              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                <ul className="dashboards-list">
                  {
                    this.state.dashboards
                      .map(dashboard => (
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
                      .slice(0, showMore ? dashboards.length : 5)
                  }
                  { dashboards.length > 5 && (
                    <li className="-toggle">
                      <button
                        type="button"
                        className="content"
                        onClick={() => this.setState({ showMore: !showMore })}
                      >
                        <span>{ this.state.showMore ? 'Close' : 'More' }</span>
                      </button>
                    </li>
                  ) }
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="column small-12">
                { this.state.error && (
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
              <div
                className="user-content column small-12 large-8 large-offset-2"
                dangerouslySetInnerHTML={{ __html: selectedDashboard.content }} // eslint-disable-line react/no-danger, max-len
              />
            ) }
          </div>

        </div>
      </Layout>
    );
  }

}

export default withRedux(initStore, null, null)(DashboardsDetail);
