import React from 'react';

function Browser() {
  return (
    <div className="c-browser">
      <h3>Browser not supported</h3>
      <p>The browser you are using is out-of-date and not supported by our site.</p>

      <h4>For the most secure and best experience, we recommend these browsers.</h4>

      <ul>
        <li><a href="https://www.google.com/chrome/" rel="noreferrer" target="__BLANK">Latest chrome</a></li>
        <li><a href="https://www.mozilla.org/en-US/firefox/new/" rel="noreferrer" target="__BLANK">Latest firefox</a></li>
      </ul>

    </div>
  );
}

export default Browser;
