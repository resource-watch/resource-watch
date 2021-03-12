import React from 'react';
import HeadNext from 'next/head';

export default function HeadError() {
  return (
    <HeadNext>
      <title>Something went wrong | Resource Watch</title>
      <meta name="description" content="Ops, something went wrong" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </HeadNext>
  );
}
