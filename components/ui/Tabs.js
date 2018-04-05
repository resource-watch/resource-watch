import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next components
import { Link } from 'routes';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.defaultSelected
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selected } = nextProps;
    this.setState({
      selected
    });
  }

  /**
   * UI EVENTS
   * - onChangeTab
  */
  onChangeTab(selected) {
    this.setState({ selected }, () => {
      if (this.props.onChange) this.props.onChange(selected);
    });
  }

  render() {
    const { selected } = this.state;
    const { options, className } = this.props;

    return (
      <header
        className={classnames({
          'c-tabs': true,
          [className]: !!className
        })}
      >
        <div className="row l-row">
          {options.map((option) => {
            const btnClasses = classnames({
              '-active': option.value === selected
            });

            return (
              <div
                key={option.value}
                className="column shrink"
              >
                {option.route &&
                  <Link route={option.route} params={option.params} >
                    <a className={`tabs-btn ${btnClasses}`}>
                      <span className="title">{option.label}</span>
                      {!!option.number && <span className="number">{option.number}</span>}
                    </a>
                  </Link>
                }

                {!option.route &&
                  <button className={`tabs-btn ${btnClasses}`} onClick={() => this.onChangeTab(option.value)}>
                    <span className="title">{option.label}</span>
                    {!!option.number && <span className="number">{option.number}</span>}
                  </button>
                }
              </div>
            );
          })}
        </div>
      </header>
    );
  }
}

Tabs.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  defaultSelected: PropTypes.string,
  onChange: PropTypes.func
};
