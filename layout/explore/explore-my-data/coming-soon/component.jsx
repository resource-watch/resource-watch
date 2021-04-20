import {
  useCallback,
} from 'react';
// import PropTypes from 'prop-types';

// components
import CardPlaceholder from 'components/card-placeholder';

// hooks
// import {
//   useMe,
// } from 'hooks/user';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

export default function MyDataComingSoon() {
  // const {
  //   data,
  // } = useMe(userToken);

  const trackLink = useCallback((evt) => {
    evt.preventDefault();
    logEvent('Explore Menu', 'My Data', 'clicks on "Get in touch" button');
    window.open('https://resourcewatch.org/data/explore', 'Resource Watch – Get in touch Form', 'noopener, noreferrer');
  }, []);

  return (
    <div className="c-explore-my-data-coming-soon">
      <CardPlaceholder />
      <div className="card-coming-soon">
        <h4>
          Would you like to see your data on
          <br />
          Resource Watch?
        </h4>
        <p>
          We are exploring ways to let you bring your data to the platform.
          Would you use this feature? Let us know.
        </p>
        <a
          // use the next format to populate the form via URL params: https://docs.google.com/forms/d/e/1FAIpQLScOVg5YvrAIMdVyFprYsMF4g__yAcnRXnOXCaXqXFmfN-vm_g/viewform?entry.XXXXX=test
          href="https://resourcewatch.org/data/explore"
          onClick={trackLink}
          className="c-button -primary -compressed"
        >
          I’m interested
        </a>
      </div>
      <CardPlaceholder />
      <CardPlaceholder />
    </div>
  );
}

// MyDataComingSoon.defaultProps = {
//   userToken: null,
// };

// MyDataComingSoon.propTypes = {
//   userToken: PropTypes.string,
// };
