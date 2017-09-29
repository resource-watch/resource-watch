import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './Button';

storiesOf('Buttons', module)
  .add('Primary', () => (
    <Button properties={{
      type: 'button',
      className: '-primary'
    }}>Submit</Button>
  ));
