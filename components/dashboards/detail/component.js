import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

// components
import Wysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition';

class DashboardDetail extends PureComponent {
  static propTypes = { dashboard: PropTypes.object.isRequired }

  state = { isUpdate: false }

  componentDidUpdate(prevProps) {
    const { dashboard: { content: prevContent } } = prevProps;
    const { dashboard: { content } } = this.props;
    const { isUpdate } = this.state;
    if (content !== prevContent && !isUpdate) {
      this.changeUpdateStatus(true);
    } else if (content === prevContent && isUpdate) {
      this.changeUpdateStatus(false);
    }
  }

  changeUpdateStatus = (status) => {
    this.setState({ isUpdate: status });
  }

  render() {
    const { dashboard: { content } } = this.props;
    const { isUpdate } = this.state;
    let items = [];

    // TO-DO: review this error handling
    try {
      items = JSON.parse(content);
    } catch (e) { console.error(e); }

    return (
      <Fragment>
        {!isUpdate && (
          <Wysiwyg
            readOnly
            items={items}
            blocks={{
              widget: {
                Component: WidgetBlock,
                EditionComponent: WidgetBlockEdition,
                icon: 'icon-widget',
                label: 'Visualization',
                renderer: 'modal'
              }
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default DashboardDetail;
