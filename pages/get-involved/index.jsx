// actions
import { fetchStaticData } from 'layout/get-involved/get-involved-actions';

// components
import GetInvolved from 'layout/get-involved';

export default function GetInvolvedPage() {
  return (<GetInvolved />);
}

GetInvolvedPage.getInitialProps = async ({ store }) => {
  const { dispatch } = store;

  await dispatch(fetchStaticData('get-involved'));

  return ({});
};
