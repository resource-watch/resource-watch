import { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Wysiwyg from '@vizzuality/wysiwyg';
import InView from 'components/in-view';
import WidgetBlock from 'components/wysiwyg/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition';
import MiniExploreBlock from 'components/wysiwyg/mini-explore';

const WidgetBlockInView = (props) => (
  <InView
    triggerOnce
    threshold={0.25}
  >
    {({ ref, inView }) => (
      <div
        ref={ref}
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        {inView && (
          <WidgetBlock {...props} />
        )}
      </div>
    )}
  </InView>
);

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
      // todo: remove the following lines once
      // todo: the MiniExplore is implemented in the dashboard via API.
      // items.unshift({
      //   id: Math.floor(Math.random() * 999999999999),
      //   type: 'mini-explore',
      //   content: JSON.stringify({
      //     title: 'Lorem ipsum',
      //     areaOfInterest: '972c24e1da2c2baacc7572ee9501abdc',
      //     datasetGroups: [
      //       {
      //         title: 'Power Infrastructure',
      //         datasets: [
      //           'a86d906d-9862-4783-9e30-cdb68cd808b8',
      //           'b75d8398-34f2-447d-832d-ea570451995a',
      //           '4919be3a-c543-4964-a224-83ef801370de',
      //         ],
      //         default: [
      //           'a86d906d-9862-4783-9e30-cdb68cd808b8',
      //         ],
      //       },
      //       {
      //         title: 'Natural hazards',
      //         datasets: [
      //           '484f10d3-a30b-4466-8052-c48d47cfb4a1',
      //           'c5a62289-bdc8-4821-83f0-6f05e3d36bdc',
      //         ],
      //         default: [
      //           '484f10d3-a30b-4466-8052-c48d47cfb4a1',
      //         ],
      //       },
      //     ],
      //   }),
      // });
    } catch (e) { console.error(e); }

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
        }}
      />
    );
  }
}

export default DashboardDetail;
