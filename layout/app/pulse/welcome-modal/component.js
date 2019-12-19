import React, { useEffect, useState } from 'react';
import { Link } from 'routes';
import Modal from 'components/modal/modal-component';
import Checkbox from 'components/form/Checkbox';

const DONT_SHOW_AGAIN_KEY = 'rw_hide_pulse_welcome';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hideChecked, hideCheckedChange] = useState(false);

  const getDontShowAgain = () => localStorage.getItem(DONT_SHOW_AGAIN_KEY) === 'true';
  const dontShowAgain = () => localStorage.setItem(DONT_SHOW_AGAIN_KEY, 'true');

  const closePopup = () => {
    setIsOpen(false);
    if (hideChecked) {
      dontShowAgain();
    }
  };

  useEffect(() => {
    if (getDontShowAgain()) {
      setIsOpen(false);
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onRequestClose={closePopup}>
      <div className="c-layer-info-modal">
        <div className="layer-info-content">
          <h2>Near Real-Time Data</h2>
          <p>
            Track natural disasters, monitor the changing environment, and observe human events with this selection of Resource Watch's most timely data. All data visualized on the globe are frequently updated by the data provider, from twice daily to monthly.
            <br />Subscribe to alerts to get updates on world events as they unfold.
          </p>
          <p>
            See these and more near real-time data on&nbsp;
            <Link route="explore">
              <a>Explore</a>
            </Link>
          </p>
          <div className="buttons" style={{ alignItems: 'center' }}>
            <Checkbox
              properties={{
                name: 'hideCheck',
                value: 'hideCheck',
                title: 'Don\'t show me again',
                checked: hideChecked
              }}
              onChange={({ checked }) => hideCheckedChange(checked)}
            />
            <button className="c-btn -primary" onClick={closePopup}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
