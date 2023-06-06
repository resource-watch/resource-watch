import { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Scrollama, Step } from 'react-scrollama';
import classnames from 'classnames';
import { Tooltip } from 'vizzuality-components';

// hooks
import { useGeostore } from 'hooks/geostore';

// lib
import { Media } from 'lib/media';

// components
import Icon from 'components/ui/icon';
import IndicatorsNavigation from './indicators-navigation/component';
import StoryStep from './story-step';
import StepBackground from './background';

export default function OceanWatchStoryTelling({ indicators, steps, geostore }) {
  const [selectedStep, setSelectedStep] = useState({
    id: 'opening',
    indicator: 'land-sea-interface',
  });
  const [showSkip, setShowSkip] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMobileIndicatorSelector, setMobileIndicatorSelector] = useState(true);

  const { data: geostoreProperties } = useGeostore(
    geostore,
    {},
    {
      enabled: Boolean(geostore),
      select: (geostore) => {
        if (!geostore) return {};
        return geostore.geojson.features[0].properties || {};
      },
      placeholderData: null,
    },
  );

  const params = useMemo(
    () => ({
      geostore_env: 'geostore_prod',
      geostore_id: geostore,
      ...geostoreProperties,
    }),
    [geostore, geostoreProperties],
  );

  const onStepEnter = ({ data, direction }) => {
    setShowBackToTop(true);
    // displays button at the beginning of the first step
    if (direction === 'down' && data.id === 'opening') setShowSkip(true);
    // hides button at the end of the last step
    if (data.id === steps[steps.length - 1].id && direction === 'down') {
      setShowSkip(false);
      setMobileIndicatorSelector(false);
    }
    if (direction === 'up') {
      setShowSkip(true);
      setMobileIndicatorSelector(true);
    }
    if (direction === 'up' && data.id === 'opening') setShowSkip(false);

    setSelectedStep({
      id: data.id,
      indicator: data.indicator,
    });
  };

  const onStepExit = ({ data, direction }) => {
    if (data.id === steps[steps.length - 1].id && direction === 'up') {
      setMobileIndicatorSelector(true);
    }

    if (data.id === steps[steps.length - 1].id && direction === 'down') {
      setMobileIndicatorSelector(false);
    }
  };

  const handleClickIndicator = (id) => {
    const element = document.getElementById(`${id}-1`);

    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  const handleSelectIndicator = (evt) => {
    const id = evt.currentTarget.value;
    const element = document.getElementById(`${id}-1`);

    if (element) {
      element.scrollIntoView(true);
    }
  };

  const handleSkip = useCallback(() => {
    const element = document.getElementById('countries-selection');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });

      setShowSkip(false);
    }
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    setShowBackToTop(false);
    setShowSkip(false);
  }, []);

  const placeholderSteps = useMemo(
    () => steps.filter(({ isPlaceholder }) => isPlaceholder),
    [steps],
  );

  useEffect(() => {
    const onScroll = () => {
      const floatingBarLimit =
        document.getElementById('intro-content').getBoundingClientRect().height -
        document.getElementById('countries-selection').getBoundingClientRect().height;
      window.requestAnimationFrame(() => {
        if (window.scrollY > floatingBarLimit) setShowSkip(false);
      });
    };

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="l-container">
      <div className="row">
        <div className="column small-12">
          <h3 className="text-lg font-light text-white md:text-xl">
            Select a topic to explore its data
          </h3>
        </div>
      </div>

      <Media lessThan="lg">
        <div className="column small-12">
          <nav
            style={{
              position: 'relative',
              margin: '25px 0',
              background: '#0F4573',
              zIndex: 2,
            }}
          >
            <IndicatorsNavigation
              indicators={indicators}
              selectedIndicator={selectedStep.indicator}
              onClickIndicator={handleClickIndicator}
            />
          </nav>
        </div>
      </Media>

      <div
        className={classnames('top-0 z-20 sticky py-4 lg:py-0 transition-opacity', {
          'opacity-0': !showMobileIndicatorSelector,
          'opacity-1': showMobileIndicatorSelector,
        })}
        style={{
          background: '#0F4573',
        }}
      >
        <div className="column small-12">
          <Media lessThan="lg">
            <select
              style={{
                background: '#0F4573',
                height: 45,
              }}
              className="z-50 w-full p-2 text-center text-white border rounded appearance-none border-gray-light"
              onChange={handleSelectIndicator}
              value={selectedStep.indicator}
            >
              {indicators.map(({ id, title }) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </Media>
        </div>
      </div>

      <div className="sticky top-0 flex flex-col h-screen">
        <div className="flex items-center md:inline-block column small-12">
          <Media greaterThanOrEqual="lg">
            <nav
              style={{
                position: 'relative',
                margin: '25px 0',
                background: '#0F4573',
                zIndex: 2,
              }}
            >
              <IndicatorsNavigation
                indicators={indicators}
                selectedIndicator={selectedStep.indicator}
                onClickIndicator={handleClickIndicator}
              />
            </nav>
          </Media>
          <div
            style={
              {
                // position: 'relative',
                // width: '100%',
                // 210px: height of the navigation bar
                // height: 'calc(100% - 210px)',
              }
            }
            className="relative w-full placeholder-step-container"
          >
            {placeholderSteps.map((step) => (
              <div key={step.id}>
                <StepBackground
                  src={step.background.src}
                  style={{
                    opacity: selectedStep.indicator === step.indicator ? 1 : 0,
                  }}
                />
                {(step.info || []).map(({ content, position }, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`point-${index}`}
                    className={classnames('info-point absolute pointer-events-none', {
                      'opacity-0': selectedStep.id !== step.id,
                      'opacity-1': selectedStep.id === step.id,
                    })}
                    style={{
                      left: `${position[0]}%`,
                      top: `${position[1]}%`,
                      zIndex: 0,
                      ...(selectedStep.id === step.id && {
                        pointerEvents: 'auto',
                        zIndex: 1,
                      }),
                    }}
                  >
                    <Tooltip
                      overlay={
                        <div
                          style={{
                            maxWidth: 350,
                            padding: 15,
                            borderRadius: 4,
                            fontSize: 16,
                            color: '#0f4573',
                            background: '#fff',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0, .09)',
                          }}
                        >
                          {content}
                        </div>
                      }
                      overlayClassName="c-rc-tooltip"
                      placement="top"
                      trigger="hover"
                      overlayStyle={{
                        position: 'fixed',
                      }}
                    >
                      <button
                        type="button"
                        className="cursor-pointer"
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <Icon
                          name="icon-info-2"
                          style={{
                            width: 35,
                            height: 35,
                          }}
                        />
                      </button>
                    </Tooltip>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Scrollama onStepEnter={onStepEnter} onStepExit={onStepExit}>
        {steps.map((step) => (
          <Step key={step.id} data={step}>
            <div>
              <StoryStep data={step} geostore={geostore} params={params} />
            </div>
          </Step>
        ))}
      </Scrollama>
      <div
        className="storytelling-floating-bar"
        style={{
          ...(!showSkip && {
            transform: 'translate(0, 120%)',
          }),
        }}
      >
        <div className="relative flex flex-row-reverse justify-center w-full md:w-auto md:flex-row bg-buttons">
          <div className="hidden md:inline-block">
            <button
              type="button"
              onClick={handleBackToTop}
              className="c-button -secondary -alt"
              style={{
                position: 'absolute',
                left: 0,
                transform: 'translate(-50%, 0)',
                pointerEvents: 'all',
                transition: 'opacity 0.24s cubic-bezier(0.445, 0.05, 0.55, 0.95)',
                opacity: showBackToTop ? 1 : 0,
              }}
            >
              Back to top
            </button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={handleBackToTop}
              className="absolute z-20 w-8 h-8 p-1 -translate-y-1/2 border border-white rounded-full right-5 top-1/2"
            >
              <Icon name="icon-arrow-up" className="w-full h-full fill-white" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="c-button -primary -alt"
            style={{
              pointerEvents: 'all',
            }}
          >
            Skip to coastlines
          </button>
        </div>
      </div>
    </div>
  );
}

OceanWatchStoryTelling.defaultProps = {
  steps: [],
  geostore: null,
};

OceanWatchStoryTelling.propTypes = {
  indicators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ),
  geostore: PropTypes.string,
};
