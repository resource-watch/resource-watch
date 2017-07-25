import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setFilters, setColor, setCategory, setValue, setSize, setOrderBy,
  setAggregateFunction, setLimit, setChartType } from 'redactions/widgetEditor';

// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/WidgetEditor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';

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

class MyRWWidgetsEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      submitting: false,
      widget: null
    };

    // Services
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(this.props.widgetId,
      { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentWillMount() {
    this.widgetService.fetchData().then((data) => {
      this.setState({
        widget: data,
        loading: false
      }, () => {
        this.loadWidgetIntoRedux();
      });
    });
  }

  loadWidgetIntoRedux() {
    const { paramsConfig } = this.state.widget.attributes.widgetConfig;
    const {
        value,
        category,
        color,
        size,
        aggregateFunction,
        orderBy,
        filters,
        limit,
        chartType
      } = paramsConfig;

    if (aggregateFunction) {
      this.props.setAggregateFunction(aggregateFunction);
    }
    if (value) {
      this.props.setValue(value);
    }
    if (size) {
      this.props.setSize(size);
    }
    if (color) {
      this.props.setColor(color);
    }
    if (orderBy) {
      this.props.setOrderBy(orderBy);
    }
    if (category) {
      this.props.setCategory(category);
    }
    if (filters) {
      this.props.setFilters(filters);
    }
    if (limit) {
      this.props.setLimit(limit);
    }
    if (chartType) {
      this.props.setChartType(chartType);
    }
  }


  render() {
    const { loading, widget, submitting } = this.state;

    return (
      <div className="c-myrw-widgets-edit">
        <h1 className="c-text -header-normal -thin title">Edit Widget</h1>
        <Spinner
          className="-relative -light"
          isLoading={loading}
        />
        {widget &&
        <div>
          <WidgetEditor
            widget={widget}
            dataset={widget.attributes.dataset}
            availableVisualizations={['chart', 'table']}
            mode="widget"
            showSaveButton
          />
          <div className="form-container">
            <form className="form-container" onSubmit={this.onSubmit}>
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                  onChange={value => this.handleChange({ name: value })}
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
                  onChange={value => this.handleChange({ description: value })}
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
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    );
  }
}

MyRWWidgetsEdit.propTypes = {
  widgetId: PropTypes.string.isRequired,
  // Store
  user: PropTypes.object.isRequired,
  // ACTIONS
  setFilters: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setAggregateFunction: PropTypes.func.isRequired,
  setLimit: PropTypes.func.isRequired,
  setChartType: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  setFilters: (filter) => {
    dispatch(setFilters(filter));
  },
  setColor: (color) => {
    dispatch(setColor(color));
  },
  setSize: (size) => {
    dispatch(setSize(size));
  },
  setCategory: (category) => {
    dispatch(setCategory(category));
  },
  setValue: (value) => {
    dispatch(setValue(value));
  },
  setOrderBy: (value) => {
    dispatch(setOrderBy(value));
  },
  setAggregateFunction: (value) => {
    dispatch(setAggregateFunction(value));
  },
  setLimit: (value) => {
    dispatch(setLimit(value));
  },
  setChartType: (value) => {
    dispatch(setChartType(value));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(MyRWWidgetsEdit);
