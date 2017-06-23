import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next components
import { Link } from 'routes';

// Components
import Icon from 'components/ui/Icon';

function Breadcrumbs(props) {
  return (
    <aside className="c-aside" style={props.style}>
      <nav>
        <ul>
          {props.items.map((s) => {
            const active = s.params.subtab === props.selected;
            const activeClass = classnames({ '-active': active });

            return (
              <li key={s.value}>
                <Link route={s.route} params={s.params}>
                  <a className={activeClass}>
                    {active && <Icon className="c-icon -tiny" name="icon-arrow-right" />}
                    {s.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

Breadcrumbs.propTypes = {
  items: PropTypes.array,
  style: PropTypes.object,
  selected: PropTypes.string
};

Breadcrumbs.defaultProps = {
  items: [],
  style: {},
  selected: null
};

export default Breadcrumbs;
