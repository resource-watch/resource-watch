import React from 'react';
import PropTypes from 'prop-types';

import ToolbarWidgetBtn from 'components/dashboards/wysiwyg/ToolbarWidgetBtn';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div id="toolbar">
        <div className="ql-formats">
          <select className="ql-header">
            <option value="1" />
            <option value="2" />
            <option selected />
          </select>
        </div>

        <div className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </div>

        <div className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </div>

        <div className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
        </div>

        <div className="ql-formats">
          <ToolbarWidgetBtn
            quill={this.props.quill}
          />
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  quill: PropTypes.any // ???
};

export default Toolbar;
