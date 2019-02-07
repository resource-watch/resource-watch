import React, { PureComponent } from 'react';
import { Link } from 'routes';

// components
import CardStatic from 'components/app/common/CardStatic';
import LoginRequired from 'components/ui/login-required';

// constants
import { EXPLORE_CARDS } from './constants';

class ExploreCards extends PureComponent {
  render() {
    return EXPLORE_CARDS.map(c => (
      <div
        key={`explore-card-${c.title}-${c.tag}`}
        className="column small-12 medium-6"
      >
        <CardStatic
          className="-alt -clickable"
          background={c.background}
          clickable
          route={c.buttons[0].path}
          anchor={c.buttons[0].anchor}
        >
          <div>
            <h4 className="tag-name">{c.tag}</h4>
            <h3 className="title">{c.title}</h3>
            <p>{c.intro}</p>
          </div>
          <div className="buttons -align-center">
            {c.buttons.map((b) => {
              if (b.loginRequired) {
                return (
                  <LoginRequired
                    key={b.path}
                    text={b.loginRequired}
                  >
                    <a href={b.path} className={`c-btn -alt ${b.className}`}>
                      {b.text}
                    </a>
                  </LoginRequired>
                );
              }
              if (b.anchor) {
                return (
                  <a href={b.path} key={b.path} className={`c-btn -alt ${b.className}`}>
                    {b.text}
                  </a>
                );
              }
              return (
                <Link route={b.path} key={b.path}>
                  <a className={`c-btn -alt ${b.className}`}>{b.text}</a>
                </Link>
              );
            })}
          </div>
        </CardStatic>
      </div>
    ));
  }
}

export default ExploreCards;
