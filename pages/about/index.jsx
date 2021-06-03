// actions
import { getStaticPage } from 'modules/static-pages/actions';

// components
import AboutLayout from 'layout/app/about';

export default function AboutPage() {
  return (<AboutLayout />);
}

AboutPage.getInitialProps = async ({ store }) => {
  await store.dispatch(getStaticPage('about'));

  return ({});
};
