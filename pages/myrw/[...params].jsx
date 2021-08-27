import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// hoc
import {
  withRedux,
  withUserServerSide,
  withAuthentication,
} from 'hoc/auth';

// actions
import { getUserAreas } from 'redactions/user';

// components
import LayoutMyRW from 'layout/myrw';

const MyRWPage = ({
  getUserAreas: getUserAreasAction,
}) => {
  useEffect(() => { getUserAreasAction(); }, [getUserAreasAction]);

  return (<LayoutMyRW />);
};

MyRWPage.propTypes = {
  getUserAreas: PropTypes.func.isRequired,
};

export const getServerSideProps = withRedux(withUserServerSide(withAuthentication()));

export default connect(
  null,
  { getUserAreas },
)(MyRWPage);
