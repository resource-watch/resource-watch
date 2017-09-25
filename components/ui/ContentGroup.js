import React from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

export default class ContentGroup extends React.Component {
  renderComponent(index, values = {}) {
    const { componentProps } = this.props;
    const newComponentProps = { ...componentProps, index, values };
    return (<this.props.component key={index} {...newComponentProps} />);
  }

  render() {
    const { content } = this.props;
    const nextIndex = (content || []).length ? (content || []).length + 1 : 0;

    return (
      <div className="content-group">
        <div className="row l-row">
          <div className="column small-offset-9 small-3">
            <div className="c-button-container -j-end">
              <button
                type="button"
                className="c-button -secondary -fullwidth"
                onClick={() => this.props.onAddComponent(nextIndex)}
              >
                Add Source
              </button>
            </div>
          </div>
        </div>
        {content.map((item, index) =>
          this.renderComponent(index, item)
        )}
      </div>
    );
  }
}

ContentGroup.propTypes = {
  component: PropTypes.any.isRequired,
  componentProps: PropTypes.object,
  content: PropTypes.array,
  onSubmit: PropTypes.func,
  onAddComponent: PropTypes.func.isRequired
};

ContentGroup.defaultProps = {
  content: []
};
