import React from 'react';
import PropTypes from 'prop-types';
import { Serializer } from 'jsonapi-serializer';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Navigation from 'components/form/Navigation';

// Utils
import { logEvent } from 'utils/analytics';

class CollectionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('submitted');
    return 1;
  }

  render() {
    return (
      <form className="c-form c-collections-form" onSubmit={this.onSubmit} noValidate>

        <Field
          // ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
          // onChange={value => this.onChange({ name: value })}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            // default: user.name
          }}
        >
          {Input}
        </Field>

        <Navigation
          step={1}
          stepLength={1}
          submitting={this.state.submitting}
        />

      </form>
    );
  }
}

CollectionsForm.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(CollectionsForm);
