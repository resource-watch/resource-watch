import { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Wysiwyg from '@vizzuality/wysiwyg';
import InView from 'components/in-view';
import WidgetBlock from 'components/wysiwyg/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition';
import MiniExploreBlock from 'components/wysiwyg/mini-explore';

const WidgetBlockInView = (props) => (
  <InView triggerOnce threshold={0.25}>
    {({ ref, inView }) => (
      <div
        ref={ref}
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        {inView && <WidgetBlock {...props} />}
      </div>
    )}
  </InView>
);

class DashboardDetail extends PureComponent {
  static propTypes = { dashboard: PropTypes.object.isRequired };

  state = { isUpdate: false };

  componentDidUpdate(prevProps) {
    const {
      dashboard: { content: prevContent },
    } = prevProps;
    const {
      dashboard: { content },
    } = this.props;
    const { isUpdate } = this.state;
    if (content !== prevContent && !isUpdate) {
      this.changeUpdateStatus(true);
    } else if (content === prevContent && isUpdate) {
      this.changeUpdateStatus(false);
    }
  }

  changeUpdateStatus = (status) => {
    this.setState({ isUpdate: status });
  };

  render() {
    const {
      dashboard: { content },
    } = this.props;
    const { isUpdate } = this.state;
    let items = [];

    // TO-DO: review this error handling
    try {
      items = JSON.parse(content);
    } catch (e) {
      console.error(e);
    }

    if (typeof window === 'undefined' || isUpdate) return null;

    return (
      <Wysiwyg
        readOnly
        items={items}
        blocks={{
          widget: {
            Component: WidgetBlockInView,
            EditionComponent: WidgetBlockEdition,
            icon: 'icon-widget',
            label: 'Visualization',
            renderer: 'modal',
          },
          'mini-explore': {
            Component: MiniExploreBlock,
          },
          embed: {
            Component: WidgetBlockInView,
          },
        }}
      />
    );
  }
}

export default DashboardDetail;
