import React from 'react';
import { Link } from 'routes';

// Components
import Banner from 'components/app/common/Banner';
import BlogFeed from 'components/blog/feed';

function SuggestStoryPost() {
  return (
    <div>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <div className="buttons">
                <a
                  className="c-button -secondary"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeOiKYcmW6-SD2ScKHJ5gfq5X28sf3HtJkPDXJ90nWdpgPGuQ/viewform?usp=sf_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Suggest a story
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row">
            <div className="column small-12 medium-8">
              <h2>Latest stories</h2>
            </div>
          </div>
          <BlogFeed />
        </div>
      </aside>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center" bgImage="/static/images/backgrounds/partners-02@2x.jpg">
                <p className="-claim">
                  Questions, comments, or feedback? <br />
                  Help us improve Resource Watch.
                </p>
                <Link to="about_contact-us">
                  <a className="c-button -alt -primary">Contact us</a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SuggestStoryPost;
