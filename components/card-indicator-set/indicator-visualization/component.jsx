import {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
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

// hooks
import {
  useFetchWidget,
} from 'hooks/widget';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

// styles
import './styles.scss';

export default function IndicatorVisualization({
  indicator: {
    widgets: _widgets,
    sections,
  },
  params,
  theme,
}) {
  const RWAdapter = useSelector((state) => getRWAdapter(state));
  const [isInfoVisible, setInfoVisibility] = useState(false);
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

  const handleSection = useCallback((_id) => {
    setSection(serializedSections.find(({ id }) => _id === id));
  }, [serializedSections]);

  const replacedQuery = useMemo(() => {
    if (!widgetQuery || !params) return null;
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

  const widgetLinks = useMemo(
    () => mainWidget?.metadata?.[0]?.info?.widgetLinks || [],
    [mainWidget],
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
                />
              )}
              {isInfoVisible && (
                <div className="widget-info-container">
                  <div className="widget-modal">
                    {!mainWidget?.description
                      && <p>No additional information is available</p>}

                    {mainWidget?.description && (
                      <>
                        <h4>Description</h4>
                        <p>{mainWidget.description}</p>
                      </>
                    )}

                    {(widgetLinks.length > 0) && (
                      <div className="widget-links-container">
                        <h4>Links</h4>
                        <ul>
                          {widgetLinks.map(({ link, name }) => (
                            <li key={link}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div
                className="widget-container"
                style={{
                  ...isInfoVisible && { visibility: 'hidden' },
                }}
              >
                {mainWidget?.widgetConfig && (
                  <Renderer
                    adapter={RWAdapter}
                    widgetConfig={mainWidget.widgetConfig}
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
    </div>
  );
}

IndicatorVisualization.defaultProps = {
  theme: 'primary',
  params: null,
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
