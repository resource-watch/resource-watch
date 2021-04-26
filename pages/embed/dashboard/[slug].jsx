// actions
import { getDashboard } from 'modules/dashboards/actions';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedDashboard from 'layout/embed/dashboard';

export default function EmbedDashboardPage() {
  return (<LayoutEmbedDashboard />);
}

EmbedDashboardPage.getInitialProps = async ({ store, query }) => {
  const {
    dispatch,
  } = store;
  const {
    slug,
    webshot,
  } = query;

  await dispatch(getDashboard(slug));

  dispatch(setEmbed(true));
  if (webshot) dispatch(setWebshotMode(true));

  return ({});
};
