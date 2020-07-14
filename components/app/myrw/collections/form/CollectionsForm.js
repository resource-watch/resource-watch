import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

import { createCollection, updateCollection } from 'services/collections';

// Redux
import { connect } from 'react-redux';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Navigation from 'components/form/Navigation';

// Utils
import { logEvent } from 'utils/analytics';

export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

class CollectionsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.collection === 'new',
      name: ''
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const { user, collection } = this.props;
    const { name, isNew } = this.state;

    this.setState({ submitting: true });

    if (isNew) {
      createCollection(user.token,
        {
          name,
          env: process.env.API_ENV,
          application: process.env.APPLICATIONS,
          resources: []
        }).then(
        () => {
          logEvent('Myrw Collections', 'Create collection', name);
          toastr.success('Success', 'Collection successully Created');
          Router.pushRoute('myrw', { tab: 'collections' });
          this.setState({ submitting: false });
        },
        () => toastr.error('Error', `Could not create Collection ${name}`)
      );
    } else {
      updateCollection(user.token, collection.id, { name }).then(
        () => {
          logEvent('Myrw Collections', 'Edit collection', collection.id);
          toastr.success('Success', 'Collection successully updated');
          Router.pushRoute('myrw', { tab: 'collections' });
          this.setState({ submitting: false });
        },
        () => toastr.error('Error', `Could not edit Collection ${collection.id}`)
      );
    }
  }

  onChange(name) {
    this.setState({ ...name });
  }

  render() {
    const { collection } = this.props;
    const { submitting } = this.state;

    return (
      <form className="c-form c-collections-form" onSubmit={e => this.onSubmit(e)} noValidate>
        <Field
          ref={(c) => {
            if (c) FORM_ELEMENTS.elements.name = c;
          }}
          onChange={value => this.onChange({ name: value })}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            default: collection === 'new' ? null : collection.name
          }}
        >
          {Input}
        </Field>

        <Navigation step={1} stepLength={1} submitting={submitting} />
      </form>
    );
  }
}

CollectionsForm.propTypes = {
  // Store
  collection: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ user: state.user });

export default connect(
  mapStateToProps,
  null
)(CollectionsForm);
