import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Link, Router } from 'routes';

// Components
import Title from 'components/ui/Title';
import Button from 'components/ui/Button';
import DatasetWidgetChart from 'components/app/explore/DatasetWidgetChart';


export default class WidgetCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  /**
   * HELPERS
   * - getDescription
  */
  getDescription(_text) {
    let text = _text;
    if (typeof text === 'string' && text.length > 70) {
      text = text.replace(/^(.{70}[^\s]*).*/, '$1');
      return `${text}...`;
    }
    return text;
  }

  render() {
    const { widget, mode } = this.props;

    return (
      <div
        className={`c-widget-card -${mode}`}
        onClick={this.handleClick}
      >
        {widget &&
          <DatasetWidgetChart
            widget={widget.attributes}
          />
        }

        <div className="info">
          <div className="detail">
            {/* Title */}
            <Title className="-default -primary">
              {widget.attributes.name}
            </Title>
          </div>
          <div className="actions">
          </div>

        </div>
      </div>
    );
  }
}

WidgetCard.propTypes = {
  // STATE
  widget: PropTypes.object,
  mode: PropTypes.string
};
