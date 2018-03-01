import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import findIndex from 'lodash/findIndex';

import { arrayMove } from 'react-sortable-hoc';

// Redux
import { connect } from 'react-redux';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

import { getInteractions, modifyInteractions } from 'components/admin/layers/form/interactions/interactions-actions';

import { FORM_ELEMENTS, FORMAT } from 'components/admin/layers/form/constants';

import InteractionsItems from './interactions-items';

class InteractionsComponent extends PureComponent {
  componentWillMount() {
    this.props.dispatch(getInteractions({ ...this.props }));
  }

  onSortInteractions = ({ oldIndex, newIndex }) => {
    const { interactions } = this.props;
    interactions.added = arrayMove(interactions.added, oldIndex, newIndex);
    this.props.dispatch(modifyInteractions({ ...this.props }, interactions.added));
  }

  addInteractions(options) {
    const { interactions } = this.props;

    // Check if we are removing interactions, then remove the reference(es) to it
    if (options.length < interactions.added.length) {
      let interactionsRemoved = interactions.added;
      options.map((item) => {
        interactionsRemoved = interactionsRemoved.filter(t => t.column !== item);
      });
      interactionsRemoved.forEach(interaction => FORM_ELEMENTS.removeInteraction(interaction));
    }

    // Remove layer if its not in options
    if (interactions.added) {
      interactions.added = interactions.added
        .filter(item => options.includes(item.column));
    }

    if (!interactions.added || options.length > interactions.added.length) {
      const optionSelected = options[options.length - 1];
      const selected = interactions.available.find(item => item.label === optionSelected);

      interactions.added.push({
        column: selected.label,
        format: null,
        prefix: '',
        property: '',
        suffix: '',
        type: selected.type
      });
    }

    this.props.dispatch(modifyInteractions({ ...this.props }, interactions.added));
  }

  editInteraction(data) {
    const { interactions } = this.props;

    if (data.key.toLowerCase() === 'label') {
      data.field.property = data.value;
    } else {
      data.field[data.key.toLowerCase()] = data.value;
    }
    interactions.added[findIndex(interactions.added, data.field)] =
      Object.assign({}, data.field);
    this.props.dispatch(modifyInteractions({ ...this.props }, interactions.added));
  }

  removeInteraction(interaction) {
    const { interactions } = this.props;
    interactions.added = interactions.added.filter(item => item.column !== interaction.column);

    // Remove interaction references from validation
    FORM_ELEMENTS.removeInteraction(interaction);

    this.props.dispatch(modifyInteractions({ ...this.props }, interactions.added));
  }

  render() {
    const { interactions } = this.props;

    return (
      <div>
        {interactions.available &&
          <Field
            options={interactions.available}
            onChange={value => this.addInteractions(value)}
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

        <InteractionsItems
          interactions={interactions}
          editInteraction={data => this.editInteraction(data)}
          removeInteraction={data => this.removeInteraction(data)}
          axis="y"
          lockAxis="y"
          useDragHandle
          onSortEnd={this.onSortInteractions}
        />

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
