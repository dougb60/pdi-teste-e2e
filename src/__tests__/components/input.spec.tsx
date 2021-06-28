import React from 'react';
import { render } from 'react-native-testing-library';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholder } = render(
      <Input name="email" placeholder="E-mail" icon="link" />,
    );

    expect(getByPlaceholder('E-mail')).toBeTruthy();
  });
});
