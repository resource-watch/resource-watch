// actions
import { getStaticPage } from 'modules/static-pages/actions';

// component
import LayoutHowTo from 'layout/app/how-to';

export default function HowToPage() {
  return (<LayoutHowTo />);
}

HowToPage.getInitialProps = async ({ store }) => {
  const { getState, dispatch } = store;
  const { staticPages } = getState();

  if (!Object.keys(staticPages['how-to']).length) await dispatch(getStaticPage('how-to'));

  return ({});
};
