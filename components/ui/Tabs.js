import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'next/link';

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selected: props.defaultSelected };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selected } = nextProps;
    this.setState({ selected });
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
        className={classnames('md:mt-8 overflow-x-auto', {
          'c-tabs': true,
          [className]: !!className,
        })}
      >
        <ul className="flex space-x-5">
          {options.map((option) => {
            const btnClasses = classnames({
              '-active': option.value === selected,
              '-desktopOnly': option.desktopOnly,
            });

            return (
              <li key={option.value}>
                {option.route && (
                  <Link href={option.route}>
                    <a className={`tabs-btn ${btnClasses}`}>
                      <span className="title">{option.label}</span>
                      {!!option.number && <span className="number">{option.number}</span>}
                    </a>
                  </Link>
                )}

                {!option.route && (
                  <button
                    className={`tabs-btn ${btnClasses}`}
                    onClick={() => this.onChangeTab(option.value)}
                  >
                    <span className="title">{option.label}</span>
                    {!!option.number && <span className="number">{option.number}</span>}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </header>
    );
  }
}

Tabs.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  defaultSelected: PropTypes.string,
  onChange: PropTypes.func,
};
