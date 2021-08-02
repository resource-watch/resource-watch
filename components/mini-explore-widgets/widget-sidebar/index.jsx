import PropTypes from 'prop-types';

// components
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
      <h3
        style={{
          fontSize: 21,
          fontWeight: 'bold',
        }}
      >
        Select an area first
      </h3>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis minima ut repellat,
        illo consequatur hic quod esse aspernatur ipsam necessitatibus asperiores eveniet, sit,
        ipsa alias maiores facilis libero.
      </p>
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
