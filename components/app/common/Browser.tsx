import React from 'react';

const Browser = (): JSX.Element => (
  <>
    <h3>Browser not supported</h3>
    <p>The browser you are using is out-of-date and not supported on Resource Watch.</p>

    <h4>For the most secure and best experience, we recommend these browsers.</h4>

    <ul className="my-5">
      <li className="inline-block">
        <a
          href="https://www.google.com/chrome/"
          rel="noreferrer noopener"
          target="_blank"
          className="inline-block underline text-pink"
        >
          Latest Chrome
        </a>
      </li>
      <li className="inline-block ml-12">
        <a
          href="https://www.mozilla.org/en-US/firefox/new/"
          rel="noreferrer noopener"
          target="_blank"
          className="inline-block underline text-pink"
        >
          Latest Firefox
        </a>
      </li>
    </ul>
  </>
);

export default Browser;
