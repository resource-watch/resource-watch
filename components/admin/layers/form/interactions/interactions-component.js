import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

import { getInteractions, modifyInteractions } from 'components/admin/layers/form/interactions/interactions-actions';

import { FORMAT } from 'components/admin/layers/form/constants';

class InteractionsComponent extends PureComponent {
  componentWillMount() {
    this.props.dispatch(getInteractions({ ...this.props }));
  }

  modifyInteractions(options) {
    const { interactions } = this.props;
    // Remove layer if its not in options
    if (interactions.added) {
      interactions.added = interactions.added
        .filter(item => options.includes(item.column));
    }

    if (options.length > interactions.added.length) {
      const selected = options[options.length - 1];
      interactions.added.push({
        column: selected,
        format: null,
        prefix: '',
        property: '',
        suffix: '',
        type: 'string'
      });
    }

    this.props.dispatch(modifyInteractions(interactions.added));
  }

  render() {
    const { interactions } = this.props;

    return (
      <div>Interactions component

        <div className="c-field preview-container">
          {interactions.available &&
          <Field
            validations={['required']}
            options={interactions.available}
            onChange={value => this.modifyInteractions(value)}
            properties={{
              name: 'selected_columns',
              label: 'Add interactions',
              type: 'text',
              removeSelected: true,
              multi: true,
              value: interactions.added ? FORMAT.options(interactions.added) : [],
              default: interactions.added ? FORMAT.options(interactions.added) : []
            }}
          >
            {Select}
          </Field>}
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  interactions: state.interactions
});

InteractionsComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  interactions: PropTypes.object.isRequired
};

InteractionsComponent.defaultProps = {

};

export default connect(mapStateToProps, null)(InteractionsComponent);