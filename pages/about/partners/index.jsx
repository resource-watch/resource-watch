// actions
import { getPartners } from 'redactions/admin/partners';

// components
import LayoutPartners from 'layout/app/partners';

export default function PartnersPage() {
  return (<LayoutPartners />);
}

PartnersPage.getInitialProps = async ({ store }) => {
  const { dispatch, getState } = store;
  const { partners: { published } } = getState();

  if (!published.list.length) await dispatch(getPartners());

  return ({});
};
