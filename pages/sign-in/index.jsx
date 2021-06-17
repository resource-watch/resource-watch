import {
  getSession,
} from 'next-auth/client';

// components
import SignIn from 'layout/sign-in';

export default function SignInPage() {
  return (<SignIn />);
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const {
    query: {
      callbackUrl,
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

  return {
    props: ({}),
  };
}
