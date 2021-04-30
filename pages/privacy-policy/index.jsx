// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutPolicy from 'layout/app/policy';

export default function PrivacyPolicyPage() {
  return (<LayoutPolicy />);
}

PrivacyPolicyPage.getInitialProps = async ({ store }) => {
  await store.dispatch(getStaticPage('privacy-policy'));
  return ({});
};
