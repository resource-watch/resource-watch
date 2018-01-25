import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleModal } from 'redactions/modal';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';

// Services
import WidgetService from 'services/WidgetService';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


class SaveWidgetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      loading: false,
      saved: false,
      error: false,
      description: null // Description of the widget
    };

    // Services
    this.widgetService = new WidgetService(null, {
      apiURL: process.env.WRI_API_URL
    });

    // ------------------- Bindings -----------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleGoToMyRW = this.handleGoToMyRW.bind(this);
    // ----------------------------------------------------
  }

  async onSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true
    });

    const { description, name } = this.state;
    const { dataset, getWidgetConfig, user } = this.props;

    getWidgetConfig()
      .then((widgetConfig) => {
        const widgetObj = Object.assign(
          {},
          {
            name,
            description
          },
          { widgetConfig }
        );

        this.widgetService.saveUserWidget(widgetObj, dataset, user.token)
          .then((response) => {
            if (response.errors) throw new Error(response.errors[0].detail);
          })
          .then(() => this.setState({ saved: true, error: false }))
          .catch((err) => {
            this.setState({
              saved: false,
              error: true,
              errorMessage: err.message
            });
            toastr.error('There was a problem saving the widget');
            console.err(err); // eslint-disable-line no-console
          })
          .then(() => this.setState({ loading: false }));
      })
      .catch((error) => {
        toastr.error('There was a problem saving the widget');
        console.err(error); // eslint-disable-line no-console
      });
  }

  /**
   * Event handler executed when the user clicks the
   * cancel button of the modal
   */
  handleCancel() {
    this.props.toggleModal(false);
  }

  /**
   * Event handler executed when the user clicks the
   * "Check my widgets" button
   */
  handleGoToMyRW() {
    this.props.toggleModal(false);
    Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
  }

  render() {
    const { submitting, loading, saved, error, errorMessage } = this.state;

    return (
      <div className="c-save-widget-modal">
        {!saved &&
        <h2>Save widget</h2>
        }
        {saved &&
        <h2>Widget saved!</h2>
        }
        <Spinner
          isLoading={loading}
          className="-light -relative"
        />
        {error &&
        <div className="error-container">
          <div>Error</div>
          {errorMessage}
        </div>
        }
        {!saved &&
          <form className="form-container" onSubmit={this.onSubmit}>
            <fieldset className="c-field-container">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                onChange={name => this.setState({ name })}
                validations={['required']}
                properties={{
                  title: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                  placeholder: 'Widget title'
                }}
              >
                {Input}
              </Field>
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
                onChange={description => this.setState({ description })}
                properties={{
                  title: 'description',
                  label: 'Description',
                  type: 'text',
                  placeholder: 'Widget description'
                }}
              >
                {Input}
              </Field>
            </fieldset>
            <div className="buttons-container">
              <Button
                properties={{
                  type: 'submit',
                  disabled: submitting,
                  className: '-secondary'
                }}
              >
                Save
              </Button>
              <Button
                properties={{
                  disabled: submitting,
                  className: '-primary'
                }}
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        }
        {saved &&
        <div>
          <div className="icon-container">
            <img alt="Widget saved" src="/static/images/components/modal/widget-saved.svg" />
          </div>
          <div className="buttons-widget-saved">
            <Button
              properties={{ className: '-primary' }}
              onClick={this.handleCancel}
            >
              OK
            </Button>
            <Button
              properties={{ className: '-secondary' }}
              onClick={this.handleGoToMyRW}
            >
              Check my widgets
            </Button>
          </div>
        </div>
        }
      </div>
    );
  }
}

SaveWidgetModal.propTypes = {
  dataset: PropTypes.string.isRequired,
  getWidgetConfig: PropTypes.func.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  toggleModal
};


export default connect(mapStateToProps, mapDispatchToProps)(SaveWidgetModal);
