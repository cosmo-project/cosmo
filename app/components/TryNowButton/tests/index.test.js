import TryNowButton from '../index';

import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

describe('<TryNowButton />', () => {
  it('should render the button', () => {
    const renderedComponent = shallow(
      <div>
        <TryNowButton />
      </div>
    );
    expect(renderedComponent.contains(<TryNowButton />)).toEqual(true);
  });
});
