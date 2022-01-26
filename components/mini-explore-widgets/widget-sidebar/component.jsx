import PropTypes from 'prop-types';

// components
import WidgetItem from './widget-item';

export default function WidgetSidebar({ widgetIds, params, adapter }) {
  return (
    <div className="widgets-sidebar">
      {widgetIds.map((widgetId) => (
        <WidgetItem key={widgetId} adapter={adapter} widgetId={widgetId} params={params} />
      ))}
    </div>
  );
}

WidgetSidebar.defaultProps = {
  params: {},
};

WidgetSidebar.propTypes = {
  widgetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  params: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
