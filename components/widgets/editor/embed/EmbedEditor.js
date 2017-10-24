import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { setEmbed } from 'components/widgets/editor/redux/widgetEditor';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Field from 'components/widgets/editor/form/Field';
import Input from 'components/widgets/editor/form/Input';
import SaveWidgetModal from 'components/widgets/editor/modal/SaveWidgetModal';

const FORM_ELEMENTS = {
  elements: {}
};

class EmbedEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: null
    };
  }

  /**
   * Event handler executed when the user clicks the
   * Save button
   */
  @Autobind
  onClickSaveWidget() {
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset: this.props.dataset,
        datasetType: this.props.datasetType
      }
    };

    this.props.toggleModal(true, options);
  }

  /**
   * Event handler executed when the user clicks the
   * Save button while editing an existing widget
   */
  @Autobind
  onClickUpdateWidget() {
    this.props.onUpdateWidget();
  }

  @Autobind
  handleEmbedChange(obj) {
    this.props.setEmbed(obj);
  }

  render() {
    const { widgetEditor, mode, showSaveButton, showNotLoggedInText } = this.props;
    const { embed } = widgetEditor;

    return (
      <div className="c-map-editor">
        <div className="selector-container">
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.src = c; }}
            onChange={url => this.setState({ url })}
            onValid={valid => this.handleEmbedChange({ src: valid ? this.state.url : null })}
            validations={['url']}
            className="-fluid"
            properties={{
              name: 'name',
              label: 'Url',
              type: 'text',
              required: true,
              default: embed.src
            }}
          >
            {Input}
          </Field>
        </div>
        <div className="actions-container">
          {showSaveButton && mode === 'save' &&
            <button
              className="c-button -primary"
              onClick={this.onClickSaveWidget}
            >
              Save widget
            </button>
          }
          {showSaveButton && mode === 'update' &&
            <button
              className="c-button -primary"
              onClick={this.onClickUpdateWidget}
            >
              Save widget
            </button>
          }
          {!showSaveButton && showNotLoggedInText &&
            <span className="not-logged-in-text">
              Please log in to save changes
            </span>
          }
        </div>
      </div>
    );
  }
}

EmbedEditor.propTypes = {
  dataset: PropTypes.string.isRequired,
  datasetType: PropTypes.string,
  mode: PropTypes.oneOf(['save', 'update']),
  showSaveButton: PropTypes.bool,
  showNotLoggedInText: PropTypes.bool,
  onUpdateWidget: PropTypes.func,

  // Store
  setEmbed: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  setEmbed: embed => dispatch(setEmbed(embed)),
  toggleModal: (...args) => { dispatch(toggleModal(...args)); },
  setModalOptions: (...args) => { dispatch(setModalOptions(...args)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(EmbedEditor);
