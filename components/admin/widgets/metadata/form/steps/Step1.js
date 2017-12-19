import React from 'react';
import PropTypes from 'prop-types';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Checkbox from 'components/form/Checkbox';
import Title from 'components/ui/Title';

// constants
import { FORM_ELEMENTS } from 'components/admin/widgets/metadata/form/constants';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widgetLinksSelected: props.form.widgetLinks && props.form.widgetLinks.length > 0,
      form: props.form
    };

    // ------------------------- Bindings ----------------------------
    this.onWidgetLinkChange = this.onWidgetLinkChange.bind(this);
    this.onWidgetLinksCheckboxChange = this.onWidgetLinksCheckboxChange.bind(this);
    this.handleRemoveWidgetLink = this.handleRemoveWidgetLink.bind(this);
    this.handleAddWidgetLink = this.handleAddWidgetLink.bind(this);
    // ---------------------------------------------------------------
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  /**
    * UI EVENTS
    * - onWidgetLinkChange
    * - onWidgetLinksCheckboxChange
    * - handleRemoveWidgetLink
    * - handleAddWidgetLink
  */
  onWidgetLinkChange(obj) {
    const widgetLinks = this.props.form.widgetLinks.slice(0);
    const index = widgetLinks.findIndex(elem => elem.id === obj.id);
    widgetLinks[index] = {
      ...widgetLinks[index],
      ...obj
    };
    this.props.onChange({ widgetLinks });
  }
  onWidgetLinksCheckboxChange(checked) {
    this.setState({
      widgetLinksSelected: checked
    });
    if (checked) {
      this.props.onChange({ widgetLinks: [{ name: '', link: '', id: 0 }] });
    } else {
      this.props.onChange({ widgetLinks: [] });
    }
  }
  handleRemoveWidgetLink(id) {
    const widgetLinks = this.props.form.widgetLinks.slice(0);
    const index = widgetLinks.findIndex(s => s.id === id);
    widgetLinks.splice(index, 1);
    this.props.onChange({ widgetLinks });
  }

  handleAddWidgetLink() {
    const widgetLinks = this.props.form.widgetLinks.slice(0);
    widgetLinks.push({ name: '', link: '', id: Date.now() });
    this.props.onChange({ widgetLinks });
  }

  render() {
    const { widgetLinksSelected } = this.state;

    return (
      <div>
        <fieldset className="c-field-container">
          <Title className="-big -secondary">
            Edit metadata
          </Title>
          {/*
          *****************************************************
          ****************** WIDGET LINKS *********************
          *****************************************************
          */}
          <div className="widget-links-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.widget_links = c; }}
              onChange={value => this.onWidgetLinksCheckboxChange(value.checked)}
              properties={{
                name: 'widget_links',
                title: 'Widget links',
                checked: this.state.form.widgetLinks && this.state.form.widgetLinks.length > 0
              }}
            >
              {Checkbox}
            </Field>
            {widgetLinksSelected &&
              <div>
                {
                  this.state.form.widgetLinks.map(elem => (
                    <div
                      className="c-field-row"
                      key={elem.id}
                    >
                      <div className="l-row row">
                        <div className="column small-3">
                          <Field
                            ref={(c) => { if (c) FORM_ELEMENTS.elements.widgetLinkName = c; }}
                            onChange={value => this.onWidgetLinkChange({
                              name: value, id: elem.id })}
                            validations={['required']}
                            className="-fluid"
                            properties={{
                              name: 'widgetLinkName',
                              label: 'Name',
                              type: 'text',
                              default: elem.name,
                              required: true
                            }}
                          >
                            {Input}
                          </Field>
                        </div>
                        <div className="column small-6">
                          <Field
                            ref={(c) => { if (c) FORM_ELEMENTS.elements.widgetLinkLink = c; }}
                            onChange={value => this.onWidgetLinkChange({
                              link: value, id: elem.id })}
                            validations={['required', 'url']}
                            className="-fluid"
                            properties={{
                              name: 'widgetLinkLink',
                              label: 'Link',
                              type: 'text',
                              default: elem.link,
                              required: true
                            }}
                          >
                            {Input}
                          </Field>
                        </div>
                        <div className="column small-3 remove-widget-link-container">
                          <button
                            type="button"
                            className="c-button -secondary -fullwidth"
                            onClick={() => this.handleRemoveWidgetLink(elem.id)}
                            disabled={this.state.form.widgetLinks.length === 1}
                          >
                              Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className="c-field-row">
                  <div className="l-row row">
                    <div className="column small-12 add-widget-link-container">
                      <button
                        type="button"
                        className="c-button -secondary -fullwidth"
                        onClick={this.handleAddWidgetLink}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </fieldset>
      </div>
    );
  }
}

Step1.propTypes = {
  form: PropTypes.object,
  onChange: PropTypes.func
};

export default Step1;
