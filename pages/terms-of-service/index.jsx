// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutTermsOfService from 'layout/app/terms-of-service';

export default function TermsOfServicePage() {
  return (<LayoutTermsOfService />);
}

TermsOfServicePage.getInitialProps = async ({ store }) => {
  const { getState, dispatch } = store;
  const { staticPages } = getState();

  if (!Object.keys(staticPages['terms-of-service']).length) await dispatch(getStaticPage('terms-of-service'));

  return ({});
};
