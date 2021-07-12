// actions
import { getStaticPage } from 'modules/static-pages/actions';

import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutPolicy from 'layout/app/policy';

export default function PrivacyPolicyPage() {
  return (<LayoutPolicy />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store }) => {
  await store.dispatch(getStaticPage('privacy-policy'));

  return ({
    props: ({}),
  });
}));
