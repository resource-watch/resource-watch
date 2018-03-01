import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Field from 'components/form/Field';
import Code from 'components/form/Code';
import Spinner from 'components/ui/Spinner';

class TrySubscriptionModal extends PureComponent {
  static propTypes = {
    query: PropTypes.string,

    data: PropTypes.any,
    loading: PropTypes.bool,
    error: PropTypes.any,

    getTrySubscriptionModal: PropTypes.func,
    resetTrySubscriptionModal: PropTypes.func
  };

  componentDidMount() {
    const { query } = this.props;
    this.props.getTrySubscriptionModal({ query });
  }

  componentWillUnmount() {
    this.props.resetTrySubscriptionModal();
  }

  getValue() {
    const { data, error } = this.props;

    return (!!data.length && data) || error || [];
  }

  render() {
    const {
      data, loading, error, query
    } = this.props;

    return (
      <div className="c-try-subscription-modal">
        {loading && <Spinner isLoading className="-light -tiny" />}

        <Field
          hint={`${process.env.WRI_API_URL}/query?sql=${encodeURIComponent(query)}`}
          properties={{
            name: 'query-result',
            label: 'Query result',
            value: (!!data.length && data) || error || [],
            disabled: true
          }}
        >
          {Code}
        </Field>

      </div>
    );
  }
}

export default TrySubscriptionModal;
