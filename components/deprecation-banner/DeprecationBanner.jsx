import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const DeprecationBanner = ({ children }) => (
  <div role="alert" className={styles.banner}>
    {children}
  </div>
);

DeprecationBanner.propTypes = {
  children: PropTypes.node,
};

DeprecationBanner.defaultProps = {
  children:
    'This site is deprecated and will no longer be maintained or updated.',
};

export default DeprecationBanner;
