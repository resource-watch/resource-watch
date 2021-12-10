import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import findIndex from 'lodash/findIndex';
import { arrayMove } from 'react-sortable-hoc';

// constants
import { FORM_ELEMENTS, FORMAT } from 'components/admin/data/layers/form/constants';

// components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import InteractionsItems from './interactions-items';

class InteractionManager extends PureComponent {
  componentDidMount() {
    const {
      layer,
      getAvailableLayerInteractions,
    } = this.props;

    // fetches all fields available in the dataset
    getAvailableLayerInteractions(layer)
      .catch((e) => toastr.error('Error fetching fields', e.message));
  }

  componentWillUnmount() {
    const { resetInteractions } = this.props;
    resetInteractions();
  }

  onSortInteractions = ({ oldIndex, newIndex }) => {
    const { interactions, setCurrentInteractions } = this.props;

    interactions.added = arrayMove(interactions.added, oldIndex, newIndex);
    setCurrentInteractions(interactions.added);
  }

  addInteractions(options = []) {
    const { interactions, setCurrentInteractions } = this.props;

    // Check if we are removing interactions, then remove the reference(es) to it
    if (options.length < interactions.added.length) {
      let interactionsRemoved = interactions.added;
      options.forEach((item) => {
        interactionsRemoved = interactionsRemoved.filter((t) => t.column !== item);
      });
      interactionsRemoved.forEach((interaction) => FORM_ELEMENTS.removeInteraction(interaction));
    }

    // Remove layer if its not in options
    if (interactions.added) {
      interactions.added = interactions.added
        .filter((item) => options.includes(item.column));
    }

    if (!interactions.added || options.length > interactions.added.length) {
      const optionSelected = options[options.length - 1];
      const selected = interactions.available.find(({ label }) => label === optionSelected);

      interactions.added.push({
        column: selected.label,
        format: null,
        prefix: '',
        property: selected.label,
        suffix: '',
        type: selected.type,
      });
    }

    setCurrentInteractions(interactions.added);
  }

  editInteraction(data) {
    let dataToModify = data;
    const { interactions, setCurrentInteractions } = this.props;

    if (data.key.toLowerCase() === 'label') {
      dataToModify = {
        ...dataToModify,
        field: {
          ...dataToModify.field,
          property: dataToModify.value,
        },
      };
    } else {
      dataToModify = {
        ...dataToModify,
        field: {
          ...dataToModify.field,
          [data.key.toLowerCase()]: data.value,
        },
      };
    }
    interactions.added[findIndex(interactions.added, data.field)] = {
      ...dataToModify.field,
    };
    setCurrentInteractions(interactions.added);
  }

  removeInteraction(interaction) {
    const { interactions, setCurrentInteractions } = this.props;
    interactions.added = interactions.added.filter((item) => item.column !== interaction.column);

    // Remove interaction references from validation
    FORM_ELEMENTS.removeInteraction(interaction);

    setCurrentInteractions(interactions.added);
  }

  render() {
    const { interactions } = this.props;

    return (
      <div className="c-interactions">
        {interactions.available && (
          <Field
            options={interactions.available}
            onChange={(value) => this.addInteractions(value)}
            properties={{
              className: 'Select--large',
              name: 'selected_columns',
              label: 'Add interactions',
              placeholder: 'Select a column or type one...',
              type: 'text',
              creatable: true,
              removeSelected: true,
              multi: true,
              value: interactions.added ? FORMAT.options(interactions.added) : [],
              default: interactions.added ? FORMAT.options(interactions.added) : [],
            }}
          >
            {Select}
          </Field>
        )}

        <InteractionsItems
          interactions={interactions}
          editInteraction={(data) => this.editInteraction(data)}
          removeInteraction={(data) => this.removeInteraction(data)}
          axis="y"
          lockAxis="y"
          useDragHandle
          onSortEnd={this.onSortInteractions}
        />

      </div>
    );
  }
}

InteractionManager.propTypes = {
  layer: PropTypes.shape({}).isRequired,
  interactions: PropTypes.shape({
    added: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ).isRequired,
    available: PropTypes.arrayOf(
      PropTypes.shape({}).isRequired,
    ).isRequired,
  }).isRequired,
  setCurrentInteractions: PropTypes.func.isRequired,
  getAvailableLayerInteractions: PropTypes.func.isRequired,
  resetInteractions: PropTypes.func.isRequired,
};

export default InteractionManager;
