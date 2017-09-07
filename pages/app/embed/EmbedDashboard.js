import React from 'react';
import renderHTML from 'react-render-html';

// Router
import { Router } from 'routes';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getPublicDashboards } from 'redactions/dashboards';
import { getDashboard } from 'redactions/dashboardDetail';
import { getFavourites } from 'redactions/user';

// Components
import Icons from 'components/app/layout/icons';
import Head from 'components/app/layout/head';
import Page from 'components/app/layout/Page';
import DashboardCard from 'components/app/dashboards/DashboardCard';
import Spinner from 'components/ui/Spinner';

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

  /**
  * COMPONENT LIFECYCLE
  * - componentDidMount
  * - componentWillReceiveProps
  */
  async componentDidMount() {
    await this.props.getFavourites();
    this.props.getDashboard(this.props.url.query.slug);
  }

  componentDidUpdate(prevProps) {
    if (this.props.url.query.slug !== prevProps.url.query.slug) {
      this.props.getDashboard(this.props.url.query.slug);
    }
  }

  /**
   * Checks whether the widget is one the user favourites
   * @param {string} widgetId Widget's ID
   * @returns {boolean}
   */
  isFavourite(widgetId) {
    if (this.props.user && this.props.user.favourites) {
      const { favourites } = this.props.user;
      const isFavourite = favourites
        && favourites.find(val => val.attributes.resourceId === widgetId);
      return !!(isFavourite);
    }
    return false;
  }

  /**
   * Event handler executed when a different dashboard is selected
   * @param {string} slug Slug of the selected dashboard
   */
  static onChangeDashboard(slug) {
    // The countries dashboard is still ran by the old
    // application, so the URL is different
    if (slug === 'countries') {
      window.location = '/countries';
      return;
    }

    // We update the URL anyway (only on the client)
    Router.replaceRoute('dashboards_detail', { slug });
  }

  render() {
    const { url, user, dashboards, dashboardDetail, title, description } = this.props;
    const selectedDashboard = dashboardDetail.data;
    const dashboardName = selectedDashboard ? `${selectedDashboard.name} dashboard` : 'Dashboard';

    return (
      <div className="l-page page-dashboards c-page-dashboards">
        <Head
          title={title}
          description={description}
        />

        <Icons />

        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              { dashboards.error && (
                <p className="error">{dashboards.error}</p>
              ) }
              { selectedDashboard && (
                <div>
                  <h2>{selectedDashboard.name}</h2>
                  <p>{selectedDashboard.summary}</p>
                </div>
              ) }
            </div>
          </div>

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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dashboards: state.clientDashboards,
  dashboardDetail: state.dashboardDetail
});

const mapDispatchToProps = dispatch => ({
  getPublicDashboards: bindActionCreators(getPublicDashboards, dispatch),
  getDashboard: bindActionCreators(getDashboard, dispatch),
  getFavourites: bindActionCreators(getFavourites, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);
