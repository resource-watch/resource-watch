import {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import dynamic from 'next/dynamic';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Icon from 'components/ui/icon';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// hooks
import {
  useMe,
} from 'hooks/user';
import useIsFavorite from 'hooks/favorite/is-favorite';
import {
  useSaveFavorite,
  useDeleteFavorite,
} from 'hooks/favorite';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';
import { logEvent } from 'utils/analytics';
import { isLoadedExternally } from 'utils/embed';

const Renderer = dynamic(() => import('@widget-editor/renderer'), { ssr: false });

const isExternal = isLoadedExternally();

export default function LayoutEmbedWidget({
  widget,
  error,
  bandDescription,
  bandStats,
  webshot,
}) {
  const saveFavoriteMutation = useSaveFavorite();
  const deleteFavoriteMutation = useDeleteFavorite();
  const {
    data: user,
  } = useMe();
  const {
    data: dataFavorite,
    isFavorite,
  } = useIsFavorite(widget.id, user?.token);
  const [widgetShare, setWidgetShare] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const {
    id: favoriteId,
  } = dataFavorite || {};
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const handleToggleFavorite = useCallback(async () => {
    const {
      id: widgetId,
    } = widget;

    if (isFavorite) {
      deleteFavoriteMutation.mutate(favoriteId);
    } else {
      saveFavoriteMutation.mutate({
        resourceType: 'widget',
        resourceId: widgetId,
      });
    }
  }, [isFavorite, widget, favoriteId, saveFavoriteMutation, deleteFavoriteMutation]);

  const toggleModal = useCallback(() => {
    setModalOpened((prevModalOpened) => !prevModalOpened);
  }, []);

  const handleToggleShareModal = useCallback(
    (_shareWidget) => { setWidgetShare(_shareWidget); }, [],
  );

  const widgetLinks = useMemo(() => widget?.metadata?.[0]?.info?.widgetLinks || [], [widget]);

  const renderModal = useCallback(() => {
    const noAdditionalInfo = !widget.description && !bandDescription
      && isEmpty(bandStats) && widgetLinks.length === 0;
    return (
      <div className="widget-modal">
        {noAdditionalInfo
          && <p>No additional information is available</p>}
        {widgetLinks.length > 0
          && (
          <div className="widget-links-container">
            <h4>Links</h4>
            <ul>
              {widgetLinks.map((link) => (
                <li
                  key={link}
                >
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          )}
        {widget.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.description}</p>
          </div>
        )}

        {bandDescription && (
          <div>
            <h4>Band description</h4>
            <p>{bandDescription}</p>
          </div>
        )}

        {!isEmpty(bandStats) && (
          <div>
            <h4>Statistical information</h4>
            <div className="c-table">
              <table>
                <thead>
                  <tr>
                    {Object.keys(bandStats).map((name) => <th key={name}>{name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.keys(bandStats).map((name) => {
                      const number = format('.4s')(bandStats[name]);
                      return (<td key={name}>{number}</td>);
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }, [widget, bandDescription, bandStats, widgetLinks]);

  useEffect(() => {
    // see https://resource-watch.github.io/doc-api/reference.html#webshot
    window.WEBSHOT_READY = true;
  }, []);

  const favouriteIcon = useMemo(() => (isFavorite ? 'star-full' : 'star-empty'), [isFavorite]);

  if (error) {
    return (
      <LayoutEmbed
        title="Resource Watch"
        description=""
      >
        <div className="c-embed-widget">
          <div className="widget-title">
            <h4>–</h4>
          </div>

          <div className="widget-content">
            <p>{'Sorry, the widget couldn\'t be loaded'}</p>
          </div>

          {isExternal && (
            <div className="widget-footer">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          )}
        </div>
      </LayoutEmbed>
    );
  }

  return (
    <LayoutEmbed
      title={widget.name}
      description={`${widget.description || ''}`}
      {...widget.thumbnailUrl && { thumbnailUrl: widget.thumbnailUrl }}
    >
      <div className="c-embed-widget">
        {!webshot && (
        <div className="widget-title">
          {widgetLinks.length === 0
            && (
            <a
              href={`/data/explore/${widget.dataset}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4>{widget.name}</h4>
            </a>
            )}
          {widgetLinks.length > 0
            && <h4>{widget.name}</h4>}
          <div className="buttons">
            <ul>
              <li>
                <button
                  className="c-btn -tertiary -clean"
                  onClick={() => handleToggleShareModal(widget)}
                >
                  <Icon
                    name="icon-share"
                    className="-small"
                  />
                </button>

                <Modal
                  isOpen={widgetShare === widget}
                  className="-medium"
                  onRequestClose={() => handleToggleShareModal(null)}
                >
                  <ShareModal
                    links={{
                      link: typeof window !== 'undefined' && `${window.location.origin}/embed/widget/${widget.id}`,
                      embed: typeof window !== 'undefined' && `${window.location.origin}/embed/widget/${widget.id}`,
                    }}
                    analytics={{
                      facebook: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Facebook'),
                      twitter: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Twitter'),
                      email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                      copy: (type) => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`),
                    }}
                  />
                </Modal>
              </li>
              {user && (
                <li>
                  <button
                    onClick={handleToggleFavorite}
                  >
                    <Icon name={`icon-${favouriteIcon}`} className="c-icon -small" />
                  </button>
                </li>
              )}
              <li>
                <button
                  aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                  onClick={toggleModal}
                >
                  <Icon
                    name={`icon-${modalOpened ? 'cross' : 'info'}`}
                    className="c-icon -small"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
        )}
        <div className="widget-content">
          <Renderer
            adapter={RWAdapter}
            widgetConfig={widget.widgetConfig}
          />
          {modalOpened && renderModal()}
        </div>
        {(isExternal && !webshot) && (
          <div className="widget-footer">
            Powered by
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="embed-logo"
                src="/static/images/logo-embed.png"
                alt="Resource Watch"
              />
            </a>
          </div>
        )}
      </div>
    </LayoutEmbed>
  );
}

LayoutEmbedWidget.defaultProps = {
  bandDescription: null,
  error: null,
  webshot: false,
};

LayoutEmbedWidget.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    dataset: PropTypes.string,
    widgetConfig: PropTypes.shape({}),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          widgetLinks: PropTypes.arrayOf(
            PropTypes.shape({
              link: PropTypes.string,
            }),
          ),
        }),
      }),
    ),
  }).isRequired,
  bandDescription: PropTypes.string,
  bandStats: PropTypes.shape({}).isRequired,
  error: PropTypes.string,
  webshot: PropTypes.bool,
};
