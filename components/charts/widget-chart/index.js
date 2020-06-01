import React from 'react';
import PropTypes from 'prop-types';

// Widget editor
import Renderer from '@widget-editor/renderer';

// Components
import ErrorBoundary from 'components/ui/error-boundary';


function WidgetChart(props) {

  const { thumbnail, widget } = props;

  return (
    <div className="c-widget-chart">
      <ErrorBoundary message="There was an error loading the visualization">
        <Renderer
          widgetConfig={widget.widgetConfig}
          thumbnail={thumbnail}
        />
      </ErrorBoundary>
    </div>
  );
}

WidgetChart.propTypes = {
  widget: PropTypes.object.isRequired,
  thumbnail: PropTypes.bool
};

WidgetChart.defaultProps = { thumbnail: false };

export default WidgetChart;
