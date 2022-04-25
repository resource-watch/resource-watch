import { useState } from 'react';

import Modal from 'components/modal/modal-component';
import Checkbox from 'components/form/Checkbox';

import {
  LOCAL_STORAGE_RW_SURVEY_DO_NOT_ASK_AGAIN,
  SESSION_STORAGE_RW_SURVEY_FIRST_TIME,
} from './constants';
import { useCallback } from 'react';

const SurveyPrompt = () => {
  const [showModal, toggleShowModal] = useState(true);
  const handleToggleAskAgain = useCallback(({ checked }) => {
    localStorage.setItem(LOCAL_STORAGE_RW_SURVEY_DO_NOT_ASK_AGAIN, checked.toString());
  }, []);

  const handleCloseModal = useCallback(() => {
    sessionStorage.setItem(SESSION_STORAGE_RW_SURVEY_FIRST_TIME, 'false');
    toggleShowModal(false);
  }, [toggleShowModal]);

  if (
    localStorage.getItem(LOCAL_STORAGE_RW_SURVEY_DO_NOT_ASK_AGAIN) === 'true' ||
    sessionStorage.getItem(SESSION_STORAGE_RW_SURVEY_FIRST_TIME) === 'false' ||
    process.env.NEXT_PUBLIC_RW_ENV === 'test'
  )
    return null;

  return (
    <Modal isOpen={showModal} onRequestClose={handleCloseModal}>
      <h3>Help us take Resource Watch to the next level!</h3>
      <p>
        Share with us your main goals, challenges, and what you like about interacting with the
        platform.
      </p>
      <p>
        <a
          href="http://s.alchemer.com/s3/Resource-Watch-User-Survey-March-2022"
          target="_blank"
          rel="noopener noreferrer"
          title="Resource Watch survey"
        >
          Take survey
        </a>
        <div className="flex items-center justify-between mt-5">
          <Checkbox
            properties={{
              name: 'ask-again',
              title: 'Do not ask again',
            }}
            onChange={handleToggleAskAgain}
          />

          <button type="button" onClick={handleCloseModal} className="c-button -primary">
            Close
          </button>
        </div>
      </p>
    </Modal>
  );
};

export default SurveyPrompt;
