import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HeaderDashboards from './import-dashboard-selector';

// constants
import { TEMPLATES } from './constants';

class TemplateSelector extends PureComponent {
  static propTypes = { onChange: PropTypes.func.isRequired }

  onChangeTemplate = (template) => {
    const { onChange } = this.props;
    const newTemplate = TEMPLATES.find(_template => _template.value === template);
    onChange(newTemplate);
  }

  render() {
    return (
      <div className="c-dashboard-template-selector">
        <div className="row">
          <div className="column small-12 medium-6">
            <h2 className="c-title -primary -huge">Content</h2>
            <p>
              Use a template, clone a topic page into a
              new dashboard or start a new one from scratch.
            </p>
          </div>
          <div className="column small-12">
            <ul className="template-list">
              {TEMPLATES.map(_template => (
                <li
                  key={_template.value}
                  className="template-list-item"
                  onClick={() => this.onChangeTemplate(_template.value)}
                >
                  <h4 className="template-name">{_template.label}</h4>
                  <span className="template-description">{_template.description}</span>
                </li>

              ))}
              <HeaderDashboards />
            </ul>
          </div>
        </div>
      </div >
    );
  }
}

export default TemplateSelector;
