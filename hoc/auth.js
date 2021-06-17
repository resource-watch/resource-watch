import {
  getSession,
  useSession,
} from 'next-auth/client';

// hooks
import {
  useMe,
} from 'hooks/user';

// services
import {
  fetchUser,
} from 'services/user';

export function withAuthentication(getServerSidePropsFunc) {
  return async (context) => {
    const session = await getSession(context);
    const { resolvedUrl } = context;

    if (!session) {
      return {
        redirect: {
          destination: `/sign-in?callbackUrl=${resolvedUrl}`,
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(context, session);

      return {
        props: {
          session,
          ...SSPF.props,
        },
      };
    }

    return {
      props: {
        session,
      },
    };
  };
}

export function withAdminRole(getServerSidePropsFunc) {
  return async (context) => {
    const session = await getSession(context);
    const { resolvedUrl } = context;

    if (!session) {
      return {
        redirect: {
          destination: `/sign-in?callbackUrl=${resolvedUrl}`,
          permanent: false,
        },
      };
    }

    if (session) {
      const { role } = await fetchUser(`Bearer ${session.accessToken}`);

      // if the user has no admin role, it will be redirected
      if (role !== 'ADMIN') {
        return {
          redirect: {
            destination: resolvedUrl !== '/admin' ? resolvedUrl : '/myrw',
            permanent: false,
          },
        };
      }
    }

    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(context, session);

      return {
        props: {
          session,
          ...SSPF.props,
        },
      };
    }

    return {
      props: {
        session,
      },
    };
  };
}

export const withUser = (Component) => (props) => {
  const {
    data: user,
  } = useMe();
  const [session, loading] = useSession();

  if (loading) return null;

  if (Component.prototype.render) {
    return (
      <Component
        session={session}
        loading={loading}
        user={user}
        token={session?.accessToken}
        {...props}
      />
    );
  }

  // if the passed component is a function component, there is no need for this wrapper
  throw new Error([
    'You passed a function component, `withSession` is not needed.',
    'You can `useSession` directly in your component.',
  ].join('\n'));
};

export default withAuthentication;
