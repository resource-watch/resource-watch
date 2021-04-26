import PropTypes from 'prop-types';

// components
import ResetPassword from 'layout/reset-password';

export default function ResetPasswordPage({
  tokenEmail,
}) {
  return (<ResetPassword tokenEmail={tokenEmail} />);
}

ResetPasswordPage.propTypes = {
  tokenEmail: PropTypes.string.isRequired,
};

ResetPasswordPage.getInitialProps = async ({ query }) => {
  const {
    tokenEmail,
  } = query;

  return ({
    tokenEmail,
  });
};
