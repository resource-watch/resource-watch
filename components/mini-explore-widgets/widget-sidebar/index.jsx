import PropTypes from 'prop-types';

// components
import WidgetSidebar from './component';

export default function WidgetSidebarContainer({
  widgetIds,
  params,
  adapter,
}) {
  return (
    <WidgetSidebar
      adapter={adapter}
      widgetIds={widgetIds}
      params={params}
    />
  );
}

WidgetSidebarContainer.defaultProps = {
  params: {},
};

WidgetSidebarContainer.propTypes = {
  widgetIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  params: PropTypes.shape({}),
  adapter: PropTypes.func.isRequired,
};
