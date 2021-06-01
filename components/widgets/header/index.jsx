import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
// components
import WidgetHeader from './component';

export default function WidgetHeaderContainer({
  widget,
  ...props
}) {
  const userToken = useSelector((state) => state.user?.token);
  const {
    isInACollection,
  } = useBelongsToCollection(widget?.id, userToken);

  return (
    <WidgetHeader
      widget={widget}
      isInACollection={isInACollection}
      {...props}
    />
  );
}

WidgetHeaderContainer.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
