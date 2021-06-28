import React from 'react';
import { Alert } from 'react-native';
import { render } from 'react-native-testing-library';

import SignUp from '../../pages/SignUp';

jest.useFakeTimers();
const mockNavigationPush = jest.fn();
const mockSetData = jest.fn();

jest.spyOn(Alert, 'alert');

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: mockNavigationPush }),
  };
});

jest.mock('../../services/api', () => {
  return { post: () => mockSetData };
});

describe('SignUp page', () => {
  beforeEach(() => {
    mockSetData.mockClear();
  });

  it('should contains name/email/password inputs', () => {
    const { getByPlaceholder } = render(<SignUp />);

    expect(getByPlaceholder('Nome')).toBeTruthy();
    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Senha')).toBeTruthy();
  });
});
