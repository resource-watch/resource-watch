// actions
import { getFaqs } from 'redactions/admin/faqs';

// components
import LayoutFaqs from 'layout/app/faqs';

export default function FaqsPage() {
  return (<LayoutFaqs />);
}

FaqsPage.getInitialProps = async ({ store }) => {
  const { getState, dispatch } = store;
  const { faqs: { list } } = getState();

  if (!list.length) await dispatch(getFaqs());

  return {};
};
