import React from 'react';
import Proptypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// redux
import { connect } from 'react-redux';

// redactions
import { setTmpSources } from 'redactions/admin/sources';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';

// constants
import { SOURCE_ELEMENTS } from 'components/datasets/metadata/form/constants';

class Source extends React.Component {
  static propTypes = {
    index: Proptypes.number,
    values: Proptypes.object,
    setTmpSources: Proptypes.func,
    tmpSources: Proptypes.array
  };

  static defaultProps = {
    values: {},
    tmpSources: []
  };

  constructor(props) {
    super(props);

    this.state = { values: props.values };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.values, nextProps.values)) {
      this.setState({ values: nextProps.values });
    }
  }

  onChange = (name, value) => {
    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      }
    }, () => {
      this.onAddSource(this.state.values, this.props.index);
    });
  }

  onAddSource = (value, index) => {
    const sources = [...this.props.tmpSources];
    const existentSource = sources[index];

    if (existentSource) {
      sources.splice(index, 1, { ...value, id: index });
    } else {
      sources.push({ ...value, id: index });
    }

    this.props.setTmpSources(sources);
  }

  onRemoveSource(index) {
    const sources = [...this.props.tmpSources];
    sources.splice(index, 1);
    if (!sources.length) sources.push({ id: -1 });
    this.props.setTmpSources(sources);

    delete SOURCE_ELEMENTS.elements[`source-name-${index + 1}`];
    delete SOURCE_ELEMENTS.elements[`source-description-${index + 1}`];
  }

  render() {
    const { index } = this.props;
    const { values } = this.state;

    return (
      <div className="c-source-item">
        <div className="l-row row">
          <div className="column small-4">
            <Field
              ref={(c) => { if (c) SOURCE_ELEMENTS.elements[`source-name-${index + 1}`] = c; }}
              onChange={value => this.onChange('source-name', value)}
              validations={['url']}
              properties={{
                name: 'source-name',
                label: 'Source',
                type: 'text',
                default: values['source-name'] || '',
                value: values['source-name'] || ''
              }}
            >
              {Input}
            </Field>
          </div>

          <div className="column small-5">
            <Field
              ref={(c) => { if (c) SOURCE_ELEMENTS.elements[`source-description-${index + 1}`] = c; }}
              onChange={value => this.onChange('source-description', value)}
              validations={[]}
              properties={{
                name: 'source-description',
                label: 'Description',
                type: 'text',
                default: values['source-description'] || '',
                value: values['source-description'] || ''
              }}
            >
              {Input}
            </Field>
          </div>

          <div className="column small-3">
            <button
              type="button"
              className="c-button -secondary -fullwidth btn-remove"
              onClick={() => this.onRemoveSource(index)}
            >
              Remove Source
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ sources }) => ({ tmpSources: sources.tmpSources });

const mapDispatchToProps = { setTmpSources };

export default connect(mapStateToProps, mapDispatchToProps)(Source);
