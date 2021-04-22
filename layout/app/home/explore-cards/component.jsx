import Link from 'next/link';

// components
import CardStatic from 'components/app/common/CardStatic';
import LoginRequired from 'components/ui/login-required';

// constants
import { EXPLORE_CARDS } from './constants';

export default function ExploreCards() {
  return EXPLORE_CARDS.map((card) => (
    <div
      key={`explore-card-${card.title}-${card.tag}`}
      className="column small-12 medium-6"
    >
      <CardStatic
        className="-alt -clickable"
        background={card.background}
        clickable
        route={card.buttons[0].path}
        anchor={card.buttons[0].anchor}
      >
        <div>
          <h4 className="tag-name">{card.tag}</h4>
          <h3 className="title">{card.title}</h3>
          <p>{card.intro}</p>
        </div>
        <div className="buttons -align-center">
          {card.buttons.map((button) => {
            if (button.loginRequired) {
              return (
                <LoginRequired
                  key={button.path}
                  text={button.loginRequired}
                >
                  <a href={button.path} className={`c-btn -alt ${button.className}`}>
                    {button.text}
                  </a>
                </LoginRequired>
              );
            }
            if (button.anchor) {
              return (
                <a href={button.path} key={button.path} className={`c-btn -alt ${button.className}`}>
                  {button.text}
                </a>
              );
            }
            return (
              <Link
                href={button.path}
                key={button.path}
              >
                <a className={`c-btn -alt ${button.className}`}>{button.text}</a>
              </Link>
            );
          })}
        </div>
      </CardStatic>
    </div>
  ));
}
