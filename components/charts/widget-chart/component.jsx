import React from 'react';
import PropTypes from 'prop-types';
import Renderer from '@widget-editor/renderer';

// constants
import { WIDGET_EDITOR_MAPBOX_PROPS } from 'constants/widget-editor';

const WidgetChart = ({ thumbnail, widget, RWAdapter }) => (
  <div className="c-widget-chart">
    <Renderer
      adapter={RWAdapter}
      widgetConfig={widget.widgetConfig}
      thumbnail={thumbnail}
      map={WIDGET_EDITOR_MAPBOX_PROPS}
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
