import { connect } from 'react-redux';
import { useRouter } from 'next/router';

// component
import WidgetForm from './component';

const WidgetFormContainer = (props) => {
  const {
    query: {
      dataset,
    },
  } = useRouter();

  return (<WidgetForm {...props} dataset={dataset} />);
};

export default connect(
  (state) => ({
    locale: state.common.locale,
  }),
  null,
)(WidgetFormContainer);
