import { useState, useCallback, MouseEvent } from 'react';

// components
import Modal from 'components/modal/modal-component';
import LoginModal from 'components/modal/login-modal';

// hooks
import { useMe } from 'hooks/user';

export interface LoginRequiredProps {
  clickCallback?: () => void;
  children: JSX.Element;
}

const LoginRequired = ({ clickCallback = null, children }: LoginRequiredProps): JSX.Element => {
  const [isVisible, setVisibility] = useState(false);
  const { data: user } = useMe();

  const promptLogin = useCallback(
    (evt: MouseEvent<HTMLElement>) => {
      evt.stopPropagation();
      evt.preventDefault();
      setVisibility(true);
      if (clickCallback) clickCallback();
    },
    [clickCallback],
  );

  const closePrompt = useCallback(() => {
    setVisibility(false);
  }, []);

  return user ? (
    children
  ) : (
    <>
      <div className="c-login-required" onClickCapture={promptLogin}>
        {children}
      </div>
      <Modal isOpen={isVisible} onRequestClose={closePrompt}>
        <LoginModal />
      </Modal>
    </>
  );
};

export default LoginRequired;
