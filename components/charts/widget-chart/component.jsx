import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

const WidgetChart = ({ thumbnail, widget, RWAdapter }) => (
  <div className="c-widget-chart">
    <Renderer
      adapter={RWAdapter}
      widgetConfig={widget.widgetConfig}
      thumbnail={thumbnail}
    />
  </div>
);

WidgetChart.defaultProps = { thumbnail: false };

WidgetChart.propTypes = {
  widget: PropTypes.shape({
    widgetConfig: PropTypes.shape({}),
  }).isRequired,
  thumbnail: PropTypes.bool,
  RWAdapter: PropTypes.func.isRequired,
};

export default WidgetChart;
