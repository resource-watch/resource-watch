import PropTypes from 'prop-types';

// components
import WidgetDetail from 'layout/app/widget-detail';
import Error from 'pages/_error';

// services
import { fetchWidget } from 'services/widget';

export default function WidgetDetailPage({
  widget,
}) {
  if (!widget || !widget.id) return (<Error statusCode={404} />);

  return (<WidgetDetail widget={widget} />);
}

WidgetDetailPage.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

WidgetDetailPage.getInitialProps = async ({ query }) => {
  const {
    id,
  } = query;

  const widget = await fetchWidget(id);

  return ({
    widget,
  });
};
