import {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import classnames from 'classnames';
import { format } from 'd3-format';
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

// utils
import {
  getParametrizedWidget,
} from 'utils/widget';

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
  isInACollection,
  RWAdapter,
}) {
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
      select: (_widget) => getParametrizedWidget(_widget, params),
    },
  );

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
                <div
                  style={{
                    padding: 15,
                  }}
                >
                  <WidgetHeader
                    widget={mainWidget}
                    onToggleInfo={handleToggleInfo}
                    isInfoVisible={isInfoVisible}
                    isInACollection={isInACollection}
                    onToggleShare={handleShareToggle}
                  />
                </div>
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
                  <WidgetInfo
                    widget={mainWidget}
                    style={{
                      padding: 15,
                    }}
                  />
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
                {widgets[1].format
                  ? format(widgets[1].format)(secondaryWidget.x) : secondaryWidget.x}
                {widgets[1].unit && (
                  <span className="unit">
                    {widgets[1].unit}
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
          params={params}
        />
      )}
    </div>
  );
}

IndicatorVisualization.defaultProps = {
  theme: 'primary',
  params: {},
  isInACollection: false,
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
        unit: PropTypes.string,
      }).isRequired,
    ),
  }).isRequired,
  theme: PropTypes.oneOf(['primary', 'secondary']),
  params: PropTypes.shape({}),
  isInACollection: PropTypes.bool,
  RWAdapter: PropTypes.func.isRequired,
};
