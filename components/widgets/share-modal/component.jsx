import { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { saveAs } from 'file-saver';
import dateFnsFormat from 'date-fns/format';

// components
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import Spinner from 'components/ui/Spinner';

// services
import { takeWidgetWebshot } from 'services/webshot';

// utils
import { getLinksByWidgetType } from 'utils/embed';
import { getWidgetType } from 'utils/widget';
import { logger } from 'utils/logs';

export default function WidgetShareModal({ isVisible, onClose, widget, params }) {
  const [isWebshotLoading, setWebshotLoading] = useState(false);

  const handleWidgetWebshot = useCallback(async () => {
    try {
      const widgetType = getWidgetType(widget);

      setWebshotLoading(true);

      const { widgetThumbnail } = await takeWidgetWebshot(widget.id, {
        type: widgetType,
        ...params,
        height: 400,
      });

      if (widgetThumbnail) {
        saveAs(
          widgetThumbnail,
          `${widget.slug}-${dateFnsFormat(Date.now(), "yyyy-MM-dd'T'HH:mm:ss")}.png`,
        );
        setWebshotLoading(false);
      }
    } catch (e) {
      logger.error(`widget webshot: ${e.message}`);
      setWebshotLoading(false);
    }
  }, [widget, params]);

  const shareLinks = useMemo(() => getLinksByWidgetType(widget, params), [widget, params]);

  return (
    <Modal isOpen={isVisible} className="-medium" onRequestClose={onClose}>
      <ShareModal links={shareLinks} />

      <div
        style={{
          display: 'flex',
          margin: '80px 0 0',
        }}
      >
        <button type="button" className="c-btn -primary" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className={classnames('c-btn -secondary', { '-disabled': isWebshotLoading })}
          onClick={handleWidgetWebshot}
          style={{
            margin: '0 0 0 10px',
            minWidth: 180,
          }}
        >
          {isWebshotLoading ? (
            <Spinner isLoading className="-transparent -small" />
          ) : (
            'Download image'
          )}
        </button>
      </div>
    </Modal>
  );
}

WidgetShareModal.defaultProps = {
  isVisible: false,
  params: {},
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
  params: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
};
