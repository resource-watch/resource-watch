import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Redux
import { connect } from 'react-redux';

// Components
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

class AlertWidget extends React.Component {
  render() {
    const { dataset } = this.props;
    const widget = dataset.widget.find(w => w.attributes.default);
    const layer = dataset.layer.find(l => l.attributes.default);

    const isWidgetMap = widget && widget.attributes.widgetConfig.type === 'map';

    if (widget && !isWidgetMap) {
      return (
        <div>
          <WidgetChart widget={widget.attributes} mode="fullwidth" />
          <h3>{widget.attributes.name}</h3>
        </div>);
    } else if (layer || isWidgetMap) {
      return (
        <div>
          <LayerChart layer={layer.attributes} />
          <h3>{layer.attributes.name}</h3>
        </div>);
    }

    return (
      <Link route="explore_detail" params={{ id: dataset.id }}>
        <a>
          <PlaceholderChart />
        </a>
      </Link>
    );
  }
}

AlertWidget.propTypes = {
  dataset: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(AlertWidget);
