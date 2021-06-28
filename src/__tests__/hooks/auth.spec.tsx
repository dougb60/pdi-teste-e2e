import AsyncStorage from '@react-native-community/async-storage';
import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'fulano123',
        name: 'Fulano da silva',
        email: 'fulano@example.com.br',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(AsyncStorage, 'multiSet');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'fulano@example.com.br',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith([
      ['@GoBarber:token', apiResponse.token],
      ['@GoBarber:user', JSON.stringify(apiResponse.user)],
    ]);
    expect(result.current.user.email).toEqual('fulano@example.com.br');
  });

  it('should restore from storage', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return Promise.resolve('token-123');
        case '@GoBarber:user':
          return Promise.resolve(
            JSON.stringify({
              id: 'fulano123',
              name: 'Fulano da silva',
              email: 'fulano@example.com.br',
            }),
          );

        default:
          return Promise.resolve('');
      }
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();
    expect(result.current.user.email).toEqual('fulano@example.com.br');
  });

  it('should be able to signOut', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return Promise.resolve('token-123');
        case '@GoBarber:user':
          return Promise.resolve(
            JSON.stringify({
              id: 'fulano123',
              name: 'Fulano da silva',
              email: 'fulano@example.com.br',
            }),
          );

        default:
          return Promise.resolve('');
      }
    });

    const removeItemSpy = jest.spyOn(AsyncStorage, 'multiRemove');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signOut();
    await waitForNextUpdate();

    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeUndefined();
  });
});
