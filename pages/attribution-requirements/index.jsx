// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import LayoutAttributionRequirements from 'layout/app/attribution-requirements';

export default function AttributionRequirementsPage() {
  return (<LayoutAttributionRequirements />);
}

AttributionRequirementsPage.getInitialProps = async ({ store }) => {
  await store.dispatch(getStaticPage('api-attribution-requirements'));

  return ({});
};
