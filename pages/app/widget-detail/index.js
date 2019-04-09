import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import WidgetDetail from 'layout/app/widget-detail';
import Error from 'pages/_error';

// services
import { fetchWidget } from 'services/widget';

class WidgetDetailPage extends PureComponent {
  static propTypes = { widget: PropTypes.object };

  static defaultProps = { widget: {} }

  static async getInitialProps({ store }) {
    const { getState } = store;
    const { routes: { query: { id } } } = getState();

    // fetchs widget
    const widget = await fetchWidget(id);

    return { widget };
  }

  render() {
    const { widget } = this.props;

    if (!widget || !widget.id) return (<Error statusCode={404} />);

    return (<WidgetDetail {...this.props} />);
  }
}

export default WidgetDetailPage;
