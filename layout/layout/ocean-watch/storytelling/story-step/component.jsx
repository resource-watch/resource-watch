import {
  useCallback,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import {
  useSelector,
} from 'react-redux';
import { format } from 'd3-format';
import {
  replace,
} from '@vizzuality/layer-manager-utils';

// hooks
import {
  useSQLQuery,
} from 'hooks/sql';

// components
import ChartWidget from 'components/widgets/types/chart';
import MapWidget from 'components/widgets/types/map';
import SwipeMapWidget from 'components/widgets/types/map-swipe';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

// styles
import './styles.scss';

const WidgetShareModal = dynamic(() => import('../../../../../components/widgets/share-modal'), { ssr: false });

function renderWidget({
  id: widgetId,
  type: widgetType,
  adapter,
  handleShareWidget,
  params,
}) {
  return (
    <>
      {(widgetId && widgetType === 'chart') && (
        <ChartWidget
          adapter={adapter}
          widgetId={widgetId}
          onToggleShare={handleShareWidget}
          params={params}
          style={{
            height: 450,
            borderRadius: 4,
            color: '#393f44',
          }}
        />
      )}

      {(widgetId && widgetType === 'map') && (
        <MapWidget
          widgetId={widgetId}
          onToggleShare={handleShareWidget}
          params={params}
          style={{
            height: 450,
            borderRadius: 4,
          }}
        />
      )}

      {(widgetId && widgetType === 'map-swipe') && (
        <SwipeMapWidget
          widgetId={widgetId}
          onToggleShare={handleShareWidget}
          params={params}
          style={{
            borderRadius: 4,
          }}
        />
      )}
    </>
  );
}

export default function StoryStep({
  data,
  geostore,
  params,
}) {
  const {
    content,
  } = data;

  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const [widgetToShare, setWidgetToShare] = useState(null);

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  const serializedSections = useMemo(
    () => (content?.sections || []).map((section, index) => ({
      ...section,
      id: index,
    })),
    [content],
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

  const querySection = useMemo(() => {
    if (currentSection === null) return null;
    const hasQuery = currentSection.widget.find(({ query }) => query);

    if (hasQuery) return replace(hasQuery.query, params);

    return null;
  }, [currentSection, params]);

  const widgetSection = useMemo(() => {
    if (currentSection === null) return null;

    return currentSection.widget.find(({ id }) => id);
  }, [currentSection]);

  const handleSection = useCallback((_id) => {
    setSection(serializedSections.find(({ id }) => _id === id));
  }, [serializedSections]);

  const {
    data: queryValueSection,
  } = useSQLQuery(
    querySection,
    {},
    {
      enabled: Boolean(querySection),
      placeholderData: null,
      select: (_data) => {
        const {
          format: valueFormat,
        } = currentSection.widget.find(({ format: _format }) => _format) || {};

        return valueFormat ? format(valueFormat)(_data?.rows?.[0]?.value) : _data?.rows?.[0]?.value;
      },
    },
  );

  const widgetParams = useMemo(() => ({
    geostore_env: 'geostore_prod',
    ...geostore && { geostore_id: geostore },
  }), [geostore]);

  return (
    <>
      <div
        className={classnames('c-storytelling-step', {
          '-is-placeholder': data.isPlaceholder,
        })}
        id={data.id}
      >
        <div
          className="content"
        >
          {!data.isPlaceholder && (
            <>
              <div
                className="row"
                style={{
                  width: '100%',
                }}
              >
                <div className="column small-12">
                  {content.title && (
                    <h3 className="story-title">
                      {content.title}
                    </h3>
                  )}
                  {content.subtitle && (
                    <h4 className="story-subtitle -text-center">
                      {content.subtitle}
                    </h4>
                  )}
                  {content.intro && (
                    <div className="story-intro">
                      <p className="-text-center">
                        {content.intro}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {content.widget && (
                <div
                  className="row"
                  style={{
                    width: '100%',
                  }}
                >
                  {content.widget.map((_widgetBlock) => (
                    <div
                      className={classnames({
                        column: true,
                        'small-12': content.widget.length === 1,
                        'medium-6': content.widget.length === 2,
                      })}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        {_widgetBlock.description && (
                        <p className="-text-center">
                          {_widgetBlock.description}
                        </p>
                        )}
                        {_widgetBlock.value && (
                          <span className="widget-value">
                            {_widgetBlock.format
                              ? format(_widgetBlock.format)(_widgetBlock.value)
                              : _widgetBlock.value}
                            {_widgetBlock.unit && _widgetBlock.unit}
                          </span>
                        )}

                        {renderWidget({
                          id: _widgetBlock.id,
                          type: _widgetBlock.type,
                          adapter: RWAdapter,
                          handleShareWidget,
                          params: widgetParams,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(serializedSections.length > 0) && (
                <div
                  style={{
                    margin: '25px 0 0',
                    width: '100%',
                  }}
                >
                  <div className="row">
                    <div className="column small-6">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        {(!content.sectionPosition || content.sectionPosition === 'left') && (
                          <>
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
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                height: '100%',
                              }}
                            >
                              {currentSection.widget.find(({ description }) => description) && (
                              <p className="-text-center">
                                {currentSection.widget.find(
                                  ({ description }) => description,
                                ).description}
                              </p>
                              )}
                              {queryValueSection && (
                                <span className="widget-value">
                                  {queryValueSection}
                                  {currentSection.widget.find(({ unit }) => unit)?.unit}
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {(widgetSection && content.sectionPosition === 'right') && (
                          <>
                            {renderWidget({
                              id: widgetSection.id,
                              type: widgetSection.type,
                              adapter: RWAdapter,
                              handleShareWidget,
                              params: widgetParams,
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="column small-6">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        {content.sectionPosition === 'right' && (
                          <>
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
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                              }}
                            >
                              {currentSection.widget.find(({ description }) => description) && (
                              <p className="-text-center">
                                {currentSection.widget.find(
                                  ({ description }) => description,
                                ).description}
                              </p>
                              )}
                              {queryValueSection && (
                                <span className="widget-value">
                                  {queryValueSection}
                                  {currentSection.widget.find(({ unit }) => unit)?.unit}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                        {(widgetSection && content.sectionPosition !== 'right') && (
                          <>
                            {renderWidget({
                              id: widgetSection.id,
                              type: widgetSection.type,
                              adapter: RWAdapter,
                              handleShareWidget,
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {(!!widgetToShare) && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
        />
      )}
    </>
  );
}

StoryStep.defaultProps = {
  geostore: null,
  params: {},
};

StoryStep.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isPlaceholder: PropTypes.bool,
    content: PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      intro: PropTypes.string,
      widget: PropTypes.arrayOf(
        PropTypes.shape({}),
      ),
      sectionPosition: PropTypes.oneOf([
        'left',
        'right',
      ]),
      sections: PropTypes.arrayOf(
        PropTypes.shape({}),
      ),
    }),
  }).isRequired,
  params: PropTypes.shape({}),
  geostore: PropTypes.string,
};
