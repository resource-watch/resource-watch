import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Field from 'components/form/Field';
import Code from 'components/form/Code';
import Spinner from 'components/ui/Spinner';

class TrySubscriptionModal extends PureComponent {
  componentDidMount() {
    const { query, getTrySubscriptionModal } = this.props;
    getTrySubscriptionModal({ query });
  }

  componentWillUnmount() {
    const { resetTrySubscriptionModal } = this.props;
    resetTrySubscriptionModal();
  }

  getValue() {
    const { data, error } = this.props;

    return (!!data.length && data) || error || [];
  }

  render() {
    const {
      data, loading, error, query,
    } = this.props;

    return (
      <div className="c-try-subscription-modal">
        {loading && <Spinner isLoading className="-light -tiny" />}

        <Field
          hint={`${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/query?sql=${encodeURIComponent(query)}`}
          properties={{
            name: 'query-result',
            label: 'Query result',
            value: (!!data.length && data) || error || [],
            disabled: true,
          }}
        >
          {Code}
        </Field>

      </div>
    );
  }
}

TrySubscriptionModal.defaultProps = {
  query: null,
  data: null,
  loading: null,
  error: null,
  getTrySubscriptionModal: null,
  resetTrySubscriptionModal: null,
};

TrySubscriptionModal.propTypes = {
  query: PropTypes.string,

  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  loading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.any,

  getTrySubscriptionModal: PropTypes.func,
  resetTrySubscriptionModal: PropTypes.func,
};

export default TrySubscriptionModal;
