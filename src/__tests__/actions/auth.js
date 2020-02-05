import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import toastr from 'toastr';
import * as firebase from '../../firebase/firebase';
import {
  resetPassword,
  createUser,
  logoutUser,
  loginUser,
} from '../../actions/auth';

import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_ERROR,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CREATE_PROFILE_REQUEST,
} from '../../constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Auth action creators tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches reset email action for logged out users', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    firebase.auth = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(),
    };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    store.dispatch(resetPassword('test@gmail.com')).then(() => {
      expect(successSpy).toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(
        'Password Reset link sent to your mail. You will get an email if you are registered on the platform',
      );
      expect(errorSpy).not.toHaveBeenCalled();
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_SUCCESS,
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('dispatches reset email action for logged in user', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    firebase.auth = {
      currentUser: {
        email: 'sds@as',
      },
      sendPasswordResetEmail: jest.fn().mockResolvedValue(),
    };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    store.dispatch(resetPassword()).then(() => {
      expect(successSpy).toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(
        'Password Reset link sent to your mail',
      );
      expect(errorSpy).not.toHaveBeenCalled();
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_SUCCESS,
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('shows no error when there is an issue sending a logged out user the reset link', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    firebase.auth = {
      sendPasswordResetEmail: jest.fn().mockRejectedValue('error'),
    };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    store
      .dispatch(resetPassword('test@gmail.com'))
      .then(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
        expect(store.getActions()).toContainEqual({
          type: RESET_PASSWORD_REQUEST,
        });
        expect(store.getActions()).toContainEqual({
          type: RESET_PASSWORD_ERROR,
        });
        expect(store.getActions()).toMatchSnapshot();
      })
      .catch(() => {});
  });

  it('shows an error message when there is an error sending the reset link to the logged in user', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    firebase.auth = {
      sendPasswordResetEmail: jest.fn().mockRejectedValue('error'),
      currentUser: {
        email: 'sds@as',
      },
    };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    store.dispatch(resetPassword()).catch(() => {
      expect(errorSpy).toHaveBeenCalled();
      expect(successSpy).not.toHaveBeenCalled();
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: RESET_PASSWORD_ERROR,
      });

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('dispatches an error if there is an issue with user creation', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    const profile = {
      email: 'test@gmail.com',
      password: 'password',
      address: 'address',
      dob: '2020',
    };

    firebase.auth = {
      createUserWithEmailAndPassword: jest.fn().mockRejectedValue('error'),
    };

    store.dispatch(createUser(profile)).then(() => {
      expect(store.getActions()).toContainEqual({
        type: CREATE_USER_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: CREATE_USER_ERROR,
        error: 'error',
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('successfully creates a user', () => {
    const store = mockStore({
      auth: {
        user: null,
      },
    });

    const profile = {
      email: 'test@gmail.com',
      password: 'password',
      address: 'address',
      dob: '2020',
    };

    firebase.auth = {
      createUserWithEmailAndPassword: jest
        .fn()
        .mockResolvedValue({ user: { uid: '1' } }),
    };

    store.dispatch(createUser(profile)).then(() => {
      expect(store.getActions()).toContainEqual({
        type: CREATE_USER_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: CREATE_PROFILE_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: CREATE_USER_SUCCESS,
        user: { uid: '1', email: 'test@gmail.com' },
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('successfully logs out a user', () => {
    const store = mockStore({
      auth: {
        user: {
          email: 'test@gmail.com',
          uid: '2020',
        },
      },
    });

    firebase.auth = {
      signOut: jest.fn().mockResolvedValue(),
    };

    store.dispatch(logoutUser()).then(() => {
      expect(store.getActions()).toContainEqual({
        type: LOGOUT_USER_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: LOGOUT_USER_SUCCESS,
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('dispatches user logout error', () => {
    const store = mockStore({
      auth: {
        user: {
          email: 'test@gmail.com',
          uid: '2020',
        },
      },
    });

    firebase.auth = {
      signOut: jest.fn().mockRejectedValue('error'),
    };

    store.dispatch(logoutUser()).then(() => {
      expect(store.getActions()).toContainEqual({
        type: LOGOUT_USER_REQUEST,
      });
      expect(store.getActions()).toContainEqual({
        type: LOGOUT_USER_ERROR,
        error: 'error',
      });
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('successfully logs in out a user', () => {
    const store = mockStore({
      auth: null,
    });

    const userData = {
      email: 'test@gmail.com',
      password: 'password',
      history: { push: jest.fn() },
    };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    firebase.auth = {
      signInWithEmailAndPassword: jest.fn().mockResolvedValue({ uid: 232 }),
    };

    store.dispatch(loginUser(userData)).then(() => {
      expect(store.getActions({})).toContainEqual({
        type: LOGIN_USER_REQUEST,
      });
      expect(userData.history.push).toHaveBeenCalled();
      expect(store.getActions()).toContainEqual({
        type: LOGIN_USER_SUCCESS,
        user: { uid: 232 },
      });
      expect(successSpy).toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith('Login Success');
      expect(errorSpy).not.toHaveBeenCalled();
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  it('encounters a log in error', () => {
    const store = mockStore({
      auth: null,
    });

    const userData = {
      email: 'test@gmail.com',
      password: 'password',
      history: { push: jest.fn() },
    };

    const error = { message: 'error' };

    const successSpy = jest
      .spyOn(toastr, 'success')
      .mockImplementation(value => value);
    const errorSpy = jest
      .spyOn(toastr, 'error')
      .mockImplementation(value => value);

    firebase.auth = {
      signInWithEmailAndPassword: jest.fn().mockRejectedValue(error),
    };

    store.dispatch(loginUser(userData)).then(() => {
      expect(store.getActions({})).toContainEqual({
        type: LOGIN_USER_REQUEST,
      });
      expect(userData.history.push).not.toHaveBeenCalled();
      expect(store.getActions()).toContainEqual({
        type: LOGIN_USER_ERROR,
        error,
      });
      expect(successSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(error.message);
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
