import {
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Scrollama, Step } from 'react-scrollama';
import classnames from 'classnames';
import { Tooltip } from 'vizzuality-components';

// components
import Icon from 'components/ui/icon';
import IndicatorsNavigation from './indicators-navigation/component';
import StoryStep from './story-step';
import StepBackground from './background';

export default function OceanWatchStoryTelling({
  indicators,
  steps,
  geostore,
}) {
  const [tooltipVisibility, setTooltipVisibility] = useState({});
  const [selectedIndicator, setSelectedIndicator] = useState('opening');
  const [showSkip, setShowSkip] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const onStepEnter = ({ data, direction }) => {
    setShowBackToTop(true);
    // displays button at the beginning of the first step
    if (direction === 'down' && data.id === 'opening') setShowSkip(true);
    // hides button at the end of the last step
    if (data.id === steps[steps.length - 1].id && direction === 'down') setShowSkip(false);
    if (direction === 'up') setShowSkip(true);
    if (direction === 'up' && data.id === 'opening') setShowSkip(false);

    setSelectedIndicator(data.indicator);
    setTooltipVisibility({});
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

  const handleClickTooltip = useCallback((id) => {
    setTooltipVisibility({
      [id]: !tooltipVisibility[id],
    });
  }, [tooltipVisibility]);

  const placeholderSteps = useMemo(() => steps.filter(
    ({ isPlaceholder }) => isPlaceholder,
  ), [steps]);

  useEffect(() => {
    const onScroll = () => {
      window.requestAnimationFrame(() => {
        const floatingBarLimit = document.getElementById('intro-content').getBoundingClientRect().height - document.getElementById('countries-selection').getBoundingClientRect().height;
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
          <h3
            style={{
              fontSize: 42,
              fontWeight: '300',
              color: '#fff',
            }}
          >
            Select a topic to explore its data
          </h3>
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="column small-12">
          <nav style={{
            position: 'relative',
            padding: '25px 0',
            background: '#0F4573',
            zIndex: 2,
          }}
          >
            <IndicatorsNavigation
              indicators={indicators}
              selectedIndicator={selectedIndicator}
              onClickIndicator={handleClickIndicator}
            />
          </nav>
          <div
            style={{
              position: 'relative',
              width: '100%',
              // 210px: height of the navigation bar
              height: 'calc(100% - 210px)',
            }}
          >
            {placeholderSteps.map((step, index) => (
              <div>
                <StepBackground
                  key={step.id}
                  src={step.background.src}
                  style={{
                    opacity: selectedIndicator === step.indicator ? 1 : 0,
                  }}
                />
                {(step.info || []).map(({
                  content,
                  position,
                }) => (
                  <div
                    className={classnames('info-point absolute opacity-0', {
                      'opacity-100': selectedIndicator === step.indicator,
                    })}
                    style={{
                      position: 'absolute',
                      left: `${position[0]}%`,
                      top: `${position[1]}%`,
                      pointerEvents: 'none',
                      opacity: 0,
                      ...selectedIndicator === step.indicator && {
                        opacity: 1,
                        pointerEvents: 'all',
                        zIndex: 1,
                      },
                    }}
                  >
                    <Tooltip
                      overlay={(
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
                    )}
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
                        onClick={() => { handleClickTooltip(`${step.indicator}-${index}`); }}
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
      <Scrollama
        onStepEnter={onStepEnter}
      >
        {steps.map((step) => (
          <Step
            key={step.id}
            data={step}
          >
            <div>
              <StoryStep
                key={step.id}
                data={step}
                geostore={geostore}
                params={{
                  geostore_env: 'geostore_prod',
                  geostore_id: geostore,
                }}
              />
            </div>
          </Step>
        ))}
      </Scrollama>
      <div
        className="storytelling-floating-bar"
        style={{
          ...!showSkip && {
            transform: 'translate(0, 120%)',
          },
        }}
      >
        <div
          className="bg-buttons"
        >
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

          <button
            type="button"
            onClick={handleSkip}
            className="c-button -primary -alt"
            style={{
              pointerEvents: 'all',
            }}
          >
            Skip to countries
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
