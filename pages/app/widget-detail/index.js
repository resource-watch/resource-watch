import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import * as actions from 'layout/widget-detail/widget-detail-actions';


// components
import WidgetDetail from 'layout/widget-detail';
import Error from 'pages/_error';

class WidgetDetailPage extends PureComponent {
  static propTypes = {
    widgetDetail: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { id } } } = getState();


    // Fetch widget
    await dispatch(actions.fetchWidget({ id }));

    return {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes.query.id !== nextProps.routes.query.id) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { widgetDetail } = this.props;

    const { data: widget } = widgetDetail;
    if (widget && !widget.published) return <Error statusCode={404} />;

    return (<WidgetDetail />);
  }
}

export default connect(
  state => ({
    widgetDetail: state.widgetDetail,
    routes: state.routes
  }),
  actions
)(WidgetDetailPage);
