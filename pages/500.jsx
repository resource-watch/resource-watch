import React from 'react';

// components
import HeadError from 'layout/head/error';
import LayoutError from 'layout/error';

export default function Custom500() {
  return (
    <>
      <HeadError />
      <LayoutError statusCode={500} />
    </>
  );
}
