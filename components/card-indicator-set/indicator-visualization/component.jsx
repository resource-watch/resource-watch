import {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  useSelector,
} from 'react-redux';
import { useQuery } from 'react-query';
import classnames from 'classnames';
// import { format } from 'd3-format';
import Renderer from '@widget-editor/renderer';
import { replace } from 'layer-manager';
import axios from 'axios';

// components
import Spinner from 'components/ui/Spinner';
import Title from 'components/ui/Title';
import WidgetHeader from 'components/widgets/header';
import WidgetInfo from 'components/widgets/info';

// hooks
import {
  useFetchWidget,
} from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// styles
import './styles.scss';

const WidgetShareModal = dynamic(() => import('../../widgets/share-modal'), { ssr: false });

export default function IndicatorVisualization({
  indicator: {
    widgets: _widgets,
    sections,
  },
  params,
  theme,
}) {
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  const userToken = useSelector((state) => state.user?.token);

  const [isInfoVisible, setInfoVisibility] = useState(false);
  const [isShareVisible, setShareWidgetVisibility] = useState(false);

  const serializedSections = useMemo(
    () => (sections || []).map((section, index) => ({
      ...section,
      id: index,
    })),
    [sections],
  );

  const defaultSection = useMemo(
    () => {
      if (!serializedSections.length) return null;

      return serializedSections.find(
        ({ default: isDefault }) => isDefault,
      ) || serializedSections?.[0];
    },
    [serializedSections],
  );

  const [currentSection, setSection] = useState(defaultSection);

  const widgets = useMemo(() => {
    if (sections && currentSection) return currentSection.widgets;

    return _widgets;
  }, [sections, currentSection, _widgets]);

  const mainWidgetAvailable = useMemo(
    () => {
      if (currentSection) return currentSection.widgets?.[0]?.id;

      return widgets?.[0]?.id;
    },
    [widgets, currentSection],
  );

  const widgetQuery = useMemo(
    () => {
      if (currentSection) return currentSection.widgets?.[1].query;

      return widgets?.[1]?.query;
    },
    [widgets, currentSection],
  );

  const {
    data: mainWidget,
    isFetching: isFetchingMainWidget,
    isError: isErrorMainWidget,
    refetch: refetchMainWidget,
  } = useFetchWidget(
    mainWidgetAvailable,
    {
      includes: 'metadata',
    },
    {
      enabled: !!(mainWidgetAvailable),
      refetchOnWindowFocus: false,
      placeholderData: {},
    },
  );

  const {
    isInACollection,
  } = useBelongsToCollection(mainWidget?.id, userToken);

  const handleShareToggle = useCallback(() => {
    setShareWidgetVisibility(mainWidget);
  }, [mainWidget]);

  const handleCloseShare = useCallback(() => {
    setShareWidgetVisibility(null);
  }, []);

  const handleSection = useCallback((_id) => {
    setSection(serializedSections.find(({ id }) => _id === id));
  }, [serializedSections]);

  const replacedQuery = useMemo(() => {
    if (!widgetQuery) return null;
    return replace(widgetQuery, params);
  }, [widgetQuery, params]);

  const {
    data: secondaryWidget,
    isFetching: isFetchingSecondaryWidget,
    isError: isErrorSecondaryWidget,
    refetch: refetchSecondaryWidget,
  } = useQuery(
    ['fetch-query', widgetQuery],
    () => axios.get(replacedQuery),
    {
      enabled: !!(replacedQuery),
      refetchOnWindowFocus: false,
      placeholderData: {},
      select: ({ data }) => data?.rows[0],
    },
  );

  const handleToggleInfo = useCallback(
    () => {
      setInfoVisibility(!isInfoVisible);
    }, [isInfoVisible],
  );

  useEffect(() => {
    setSection(defaultSection);
  }, [defaultSection]);

  return (
    <div className={`c-visualization-indicator -${theme}`}>
      {(serializedSections.length > 0) && (
        <div className="sections-container">
          {serializedSections.map(({ id, title }) => (
            <button
              key={id}
              type="button"
              onClick={() => { handleSection(id); }}
              className={classnames({
                'btn-section': true,
                '-active': currentSection?.id === id,
              })}
            >
              {title}
            </button>
          ))}
        </div>
      )}
      <div className="visualization-indicator-container">
        <div className="main-widget-container">
          {(!isFetchingMainWidget && isErrorMainWidget) && (
            <div className="error-container">
              <span className="error">
                There was an error loading the widget.
              </span>
              <button
                type="button"
                onClick={refetchMainWidget}
                className="c-btn -clean"
                style={{
                  marginTop: 10,
                }}
              >
                Try again
              </button>
            </div>
          )}
          {isFetchingMainWidget && (
            <Spinner
              isLoading
              className="-transparent"
            />
          )}
          {(!isFetchingMainWidget && !isErrorMainWidget) && (
            <>
              {mainWidget && (
                <WidgetHeader
                  widget={mainWidget}
                  onToggleInfo={handleToggleInfo}
                  isInfoVisible={isInfoVisible}
                  isInACollection={isInACollection}
                  onToggleShare={handleShareToggle}
                />
              )}
              <div
                className="widget-container"
                style={{
                  ...isInfoVisible && {
                    padding: 0,
                    height: 'calc(100% - 70px)',
                  },
                }}
              >
                {mainWidget?.widgetConfig && (
                  <Renderer
                    adapter={RWAdapter}
                    widgetConfig={mainWidget.widgetConfig}
                  />
                )}
                {(isInfoVisible && mainWidget) && (
                  <WidgetInfo widget={mainWidget} />
                )}
              </div>
            </>
          )}
        </div>
        <div className="secondary-widget-container">
          {(!isFetchingSecondaryWidget && isErrorSecondaryWidget) && (
            <>
              <span className="error">
                There was an error loading the widget.
              </span>
              <button
                type="button"
                onClick={refetchSecondaryWidget}
                className="c-btn -clean"
                style={{
                  marginTop: 10,
                }}
              >
                Try again
              </button>
            </>
          )}
          {isFetchingSecondaryWidget && (
            <Spinner
              isLoading
              className="-transparent"
            />
          )}
          {(!isFetchingSecondaryWidget && secondaryWidget) && (
            <>
              <span className="data">
                {/* todo: uncomment when data is ready */}
                {/* {widgets[1].format
                  ? format(widgets[1].format)(secondaryWidget.x) : secondaryWidget.x} */}
                86.7
                {secondaryWidget.unit && (
                  <span className="unit">
                    %
                    {/* todo: uncomment when data is ready */}
                    {/* {secondaryWidget.unit} */}
                  </span>
                )}
              </span>
              {widgets[1].text && (
                <Title className="-center">
                  <h4>
                    {widgets[1].text}
                  </h4>
                </Title>
              )}
            </>
          )}
        </div>
      </div>
      {(!!isShareVisible) && (
        <WidgetShareModal
          isVisible
          widget={isShareVisible}
          onClose={handleCloseShare}
        />
      )}
    </div>
  );
}

IndicatorVisualization.defaultProps = {
  theme: 'primary',
  params: {},
};

IndicatorVisualization.propTypes = {
  indicator: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        widgets: PropTypes.arrayOf(
          PropTypes.shape(),
        ).isRequired,
      }),
    ),
    widgets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        query: PropTypes.string,
        text: PropTypes.string,
        format: PropTypes.string,
      }).isRequired,
    ),
  }).isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  params: PropTypes.shape({}),
};
