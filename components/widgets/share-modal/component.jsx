import {
  useCallback, useState,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { saveAs } from 'file-saver';
import dateFnsFormat from 'date-fns/format';

// components
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import Spinner from 'components/ui/Spinner';

// hooks
import {
  useMe,
} from 'hooks/user';

// services
import {
  takeWidgetWebshot,
} from 'services/webshot';

// utils
import { logEvent } from 'utils/analytics';
import { logger } from 'utils/logs';

export default function WidgetShareModal({
  isVisible,
  onClose,
  widget,
}) {
  const {
    data: user,
  } = useMe();
  const [isWebshotLoading, setWebshotLoading] = useState(false);

  const handleWidgetWebshot = useCallback(async () => {
    try {
      setWebshotLoading(true);
      const { widgetThumbnail } = await takeWidgetWebshot(widget.id, user?.token);

      if (widgetThumbnail) {
        saveAs(widgetThumbnail, `${widget.slug}-${dateFnsFormat(Date.now(), 'yyyy-MM-dd\'T\'HH:mm:ss')}.png`);
        setWebshotLoading(false);
      }
    } catch (e) {
      logger.error(`widget webshot: ${e.message}`);
      setWebshotLoading(false);
    }
  }, [widget, user]);

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

      <div style={{
        display: 'flex',
        margin: '80px 0 0',
      }}
      >
        <button
          type="button"
          className="c-btn -primary"
          onClick={onClose}
        >
          Close
        </button>
        {user && (
          <button
            type="button"
            className={classnames('c-btn -secondary', { '-disabled': isWebshotLoading })}
            onClick={handleWidgetWebshot}
            style={{
              margin: '0 0 0 10px',
              minWidth: 180,
            }}
          >
            {isWebshotLoading
              ? (
                <Spinner
                  isLoading
                  className="-transparent -small"
                />
              ) : 'Download image'}
          </button>
        )}
      </div>
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
    slug: PropTypes.string,
    name: PropTypes.string,
    widgetConfig: PropTypes.shape({
      type: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
