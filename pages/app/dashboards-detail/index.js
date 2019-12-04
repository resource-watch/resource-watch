import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// actions
import { getTopic, setSelected } from 'modules/topics/actions';

// components
import DashboardDetailLayout from 'layout/app/topics-detail';
import Error from 'pages/_error';

class DashboardDetailPage extends PureComponent {
  static propTypes = {
    topicsDetail: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    setSelected: PropTypes.func.isRequired
  };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { id } } } = getState();

    // fetches topic
    if (id) await dispatch(getTopic(id));

    // sets current topic in thumbnail list
    dispatch(setSelected(id));

    return {};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.routes.query.id !== nextProps.routes.query.id) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.setSelected(null);
  }

  render() {
    const { topicsDetail } = this.props;

    if (isEmpty(topicsDetail)) return <Error statusCode={404} />;

    return (<DashboardDetailLayout />);
  }
}

export default connect(
  state => ({
    topicsDetail: state.topics.detail.data,
    routes: state.routes
  }),
  { setSelected }
)(DashboardDetailPage);
