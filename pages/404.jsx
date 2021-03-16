import React from 'react';

// components
import HeadError from 'layout/head/error';
import LayoutError from 'layout/error';

export default function Custom404() {
  return (
    <>
      <HeadError title="Page Not Found" />
      <LayoutError
        statusCode={404}
        description="The page could not be found"
      />
    </>
  );
}
