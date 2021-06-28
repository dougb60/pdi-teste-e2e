import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from 'react-native-testing-library';

import SignIn from '../../pages/SignIn';

const mockNavigationPush = jest.fn();
const mockSetData = jest.fn();

jest.spyOn(Alert, 'alert');

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: mockNavigationPush }),
  };
});

jest.mock('../../hooks/auth', () => {
  return { useAuth: () => ({ signIn: mockSetData }) };
});

describe('SignIn page', () => {
  beforeEach(() => {
    mockSetData.mockClear();
  });

  it('should contains email/password inputs', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Senha')).toBeTruthy();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailField = getByPlaceholder('E-mail');
    const passwordField = getByPlaceholder('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.changeText(emailField, 'fulano@example.com');
    fireEvent.changeText(passwordField, '123456');

    fireEvent.press(buttonElement);

    await waitFor(() => {
      expect(mockSetData).toHaveBeenCalledWith({
        email: 'fulano@example.com',
        password: '123456',
      });
    });
  });

  it('should not to be able to sign in with invalid credentials', async () => {
    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailField = getByPlaceholder('E-mail');
    const passwordField = getByPlaceholder('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.changeText(emailField, 'not-valid-email');
    fireEvent.changeText(passwordField, '123456');

    fireEvent.press(buttonElement);

    await waitFor(() => {
      expect(mockSetData).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockSetData.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailField = getByPlaceholder('E-mail');
    const passwordField = getByPlaceholder('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.changeText(emailField, 'fulano@example.com');
    fireEvent.changeText(passwordField, '123456');

    fireEvent.press(buttonElement);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
