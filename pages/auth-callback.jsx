import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  signIn,
  getSession,
} from 'next-auth/client';

// components
import Layout from 'layout/layout/layout-app';
import Spinner from 'components/ui/Spinner';

export default function AuthCallback({
  token,
  callbackUrl,
}) {
  useEffect(() => {
    if (!token) return null;
    return signIn('third-party', {
      token,
      callbackUrl,
    });
  }, [token, callbackUrl]);

  return (
    <Layout
      title="Monitoring the Planet’s Pulse — Resource Watch"
      description="Trusted and timely data for a sustainable future."
      className="l-home"
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 500,
        position: 'relative',
      }}
      >
        <Spinner
          className="-transparent"
          isLoading
        />
        <span
          style={{
            display: 'inline-block',
            marginTop: 150,
            color: '#c32d7b',
            fontSize: 26,
            fontWeight: 300,
          }}
        >
          Signin in. You will be redirected automatically.
        </span>
      </div>
    </Layout>
  );
}

AuthCallback.defaultProps = {
  token: null,
  callbackUrl: null,
};

AuthCallback.propTypes = {
  token: PropTypes.string,
  callbackUrl: PropTypes.string,
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const {
    query: {
      callbackUrl,
      token,
    },
  } = context;

  // if the user has session, it will be redirected
  if (session) {
    return {
      redirect: {
        destination: callbackUrl || '/myrw',
        permanent: false,
      },
    };
  }

  // redirects to 404 if token is not found
  if (!token) {
    return {
      notFound: true,
    };
  }

  return {
    props: ({
      token,
      callbackUrl: callbackUrl || '/myrw',
    }),
  };
}
