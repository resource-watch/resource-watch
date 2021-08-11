import { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';

// components
import IndicatorsNavigation from './indicators-navigation/component';
import StoryStep from './story-step/component';

export default function OceanWatchStoryTelling({
  indicators,
  steps,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

  // This callback fires when a Step hits the offset threshold. It receives the
  // data prop of the step, which in this demo stores the index of the step.
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* I'm sticky. The current triggered step index is: {currentStepIndex} */}
        <div
          className="l-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            padding: '0 20px',
          }}
        >
          <nav style={{
            // background: 'pink',
            margin: '25px 0',
          }}
          >
            <IndicatorsNavigation
              indicators={indicators}
            />
          </nav>
          <div
            style={{
              background: 'green',
              display: 'block',
              width: '100%',
              flexGrow: 1,
            }}
          >
            image here
          </div>
        </div>
      </div>
      <Scrollama onStepEnter={onStepEnter}>
        {[1, 2, 3, 4].map((_, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>
            <div
              className="l-container"
              style={{
                padding: '0 20px',
              }}
            >
              <StoryStep />
            </div>
          </Step>
        ))}
      </Scrollama>
    </>
  );
}
