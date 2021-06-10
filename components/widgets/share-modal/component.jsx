import PropTypes from 'prop-types';

// components
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';

export default function WidgetShareModal({
  isVisible,
  onClose,
  widget,
}) {
  return (
    <Modal
      isOpen={isVisible}
      className="-medium"
      onRequestClose={onClose}
    >
      <ShareModal
        links={{
          link: `${window.location.origin}/embed/${(widget?.widgetConfig?.type || 'widget')}/${widget.id}`,
          embed: `${window.location.origin}/embed/${(widget?.widgetConfig?.type || 'widget')}/${widget.id}`,
        }}
        analytics={{
          facebook: () => logEvent('Share (embed)', `Share widget: ${widget?.name}`, 'Facebook'),
          twitter: () => logEvent('Share (embed)', `Share widget: ${widget?.name}`, 'Twitter'),
          email: () => logEvent('Share', `Share widget: ${widget?.name}`, 'Email'),
          copy: (type) => logEvent('Share (embed)', `Share widget: ${widget?.name}`, `Copy ${type}`),
        }}
      />
    </Modal>
  );
}

WidgetShareModal.defaultProps = {
  isVisible: false,
};

WidgetShareModal.propTypes = {
  isVisible: PropTypes.bool,
  widget: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
