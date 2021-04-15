// components
import CardPlaceholder from 'components/card-placeholder';
import LoginRequired from 'components/ui/login-required';

// styles
import './styles.scss';

const ExploreLogin = () => (
  <div className="c-explore-login">
    <CardPlaceholder />
    <LoginRequired redirect={false}>
      <div className="card-login">
        <h4>Log in or create a free account to access advanced features</h4>
        <p>
          Save your favorite data, create customized collections, and more.
        </p>
        <button
          type="button"
          className="c-button -primary -compressed"
        >
          Log in
        </button>
      </div>
    </LoginRequired>
    <CardPlaceholder />
    <CardPlaceholder />
  </div>
);
export default ExploreLogin;
