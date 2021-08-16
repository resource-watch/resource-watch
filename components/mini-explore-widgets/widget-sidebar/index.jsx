import PropTypes from 'prop-types';

// components
import CardPlaceholder from 'components/card-placeholder';
import WidgetSidebar from './component';

export default function WidgetSidebarContainer({
  widgetIds,
  params,
  adapter,
}) {
  if (params.geostore_id) {
    return (
      <WidgetSidebar
        adapter={adapter}
        widgetIds={widgetIds}
        params={params}
      />
    );
  }

  return (
    <div className="widgets-sidebar">
      <CardPlaceholder />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 25,
          textAlign: 'center',
        }}
      >
        <h4
          style={{
            fontWeight: 'bold',
          }}
        >
          Start by selecting an area
        </h4>
        <p>
          Get to know the details for the different zones selecting an area on the map
        </p>
      </div>
      <CardPlaceholder />
      <CardPlaceholder />
    </div>
  );
}

WidgetSidebarContainer.defaultProps = {
  params: {},
};

WidgetSidebarContainer.propTypes = {
  widgetIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  params: PropTypes.shape({
    geostore_id: PropTypes.string,
  }),
  adapter: PropTypes.func.isRequired,
};
