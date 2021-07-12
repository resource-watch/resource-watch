import {
  getSession,
  useSession,
} from 'next-auth/client';

import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

// hooks
import {
  useMe,
} from 'hooks/user';

// services
import {
  fetchUser,
} from 'services/user';

// lib
import wrapper from 'lib/store';

// actions
import { setUser } from 'redactions/user';

const queryClient = new QueryClient();

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

    // prefetch user data
    await queryClient.prefetchQuery('me', () => fetchUser(`Bearer ${session.accessToken}`));

    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(context, session);

      return {
        props: {
          session,
          dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
          ...SSPF.props,
        },
      };
    }

    return {
      props: {
        session,
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
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
            destination: !resolvedUrl.includes('/admin') ? resolvedUrl : '/myrw',
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

// hoc to attach the store to any getServerSideProps function.
// todo: this function should disappear when components stop fetching user data via store
export const withRedux = (getServerSidePropsFunc) => wrapper.getServerSideProps(
  (store) => async (context) => {
    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc({ ...context, store });

      return ({
        ...SSPF,
      });
    }

    return ({
      props: ({}),
    });
  },
);

// hoc to attach to user data to store as soon as possible.
// todo: this function should disappear when components stop fetching user data via store
export function withUserServerSide(getServerSidePropsFunc) {
  return async (contextWithStore) => {
    const session = await getSession(contextWithStore);

    if (!session) {
      if (getServerSidePropsFunc) {
        const SSPF = await getServerSidePropsFunc(contextWithStore);

        return ({
          ...SSPF,
        });
      }
    }

    const user = await fetchUser(`Bearer ${session.accessToken}`);

    if (contextWithStore.store) {
      contextWithStore.store.dispatch(setUser({
        ...user,
        token: session.accessToken,
      }));
    }

    if (getServerSidePropsFunc) {
      const SSPF = await getServerSidePropsFunc(contextWithStore, contextWithStore.store);

      const {
        props: SSPFProps,
        ...SSPFRest
      } = SSPF;

      return {
        props: {
          ...SSPFProps,
          session,
          user: {
            ...user,
            token: session.accessToken,
          },
          dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
        ...SSPFRest,
      };
    }

    return {
      props: {
        user: {
          ...user,
          token: session.accessToken,
        },
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  };
}

// todo: this function should disappear when components stop fetching user data via store
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
