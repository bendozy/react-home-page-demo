import toastr from 'toastr';
import { auth } from '../firebase/firebase';
import { createProfile } from './profile';
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
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
} from '../constants';

const getUser = ({ uid, email }) => ({ uid, email });

const loginUserRequest = () => ({
  type: LOGIN_USER_REQUEST,
});

const loginUserSuccess = user => ({
  type: LOGIN_USER_SUCCESS,
  user,
});

const loginUserError = error => ({
  type: LOGIN_USER_ERROR,
  error,
});

const logoutUserRequest = () => ({
  type: LOGOUT_USER_REQUEST,
});

const logoutUserSuccess = () => ({
  type: LOGOUT_USER_SUCCESS,
});

const logoutUserError = error => ({
  type: LOGOUT_USER_ERROR,
  error,
});

const getCurrentUserRequest = () => ({
  type: GET_USER_REQUEST,
});

const getCurrentUserSuccess = user => ({
  type: GET_USER_SUCCESS,
  user,
});

const getCurrentUserError = error => ({
  type: GET_USER_ERROR,
  error,
});

const createUserRequest = () => ({
  type: CREATE_USER_REQUEST,
});

const createUserSuccess = user => ({
  type: CREATE_USER_SUCCESS,
  user,
});

const createUserError = error => ({
  type: CREATE_USER_ERROR,
  error,
});

const resetPasswordRequest = () => ({
  type: RESET_PASSWORD_REQUEST,
});

const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS,
});

const resetPasswordError = error => ({
  type: RESET_PASSWORD_ERROR,
  error,
});

export const loginUser = ({ email, password, history }) => dispatch => {
  dispatch(loginUserRequest());

  const req = auth.signInWithEmailAndPassword(email, password);

  return req
    .then(user => {
      dispatch(loginUserSuccess(getUser(user)));
      toastr.success('Login Success');
      history.push('/');
    })
    .catch(error => {
      dispatch(loginUserError(error));
      toastr.error(error.message);
    });
};

export const logoutUser = () => dispatch => {
  dispatch(logoutUserRequest());

  return auth
    .signOut()
    .then(() => {
      dispatch(logoutUserSuccess());
    })
    .catch(error => {
      dispatch(logoutUserError(error));
    });
};

export const getCurrentUser = () => (dispatch, getState) => {
  if (!getState().auth.user) {
    dispatch(getCurrentUserRequest());

    auth.onAuthStateChanged(user => {
      if (user !== null) {
        dispatch(getCurrentUserSuccess(getUser(user)));
      } else {
        dispatch(getCurrentUserError());
      }
    });
  }
};

export const createUser = ({ email, password, ...profile }) => dispatch => {
  dispatch(createUserRequest());

  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(({ user: { uid } }) => {
      dispatch(createUserSuccess(getUser({ uid, email })));
      dispatch(createProfile({ uid, ...profile }));
    })
    .catch(error => {
      dispatch(createUserError(error));
    });
};

export const resetPassword = email => dispatch => {
  dispatch(resetPasswordRequest());

  let resetEmail = email;

  if (!email) {
    resetEmail = auth.currentUser.email;
  }

  const successMessage = email
    ? 'Password Reset link sent to your mail. You will get an email if you are registered on the platform'
    : 'Password Reset link sent to your mail';

  return auth
    .sendPasswordResetEmail(resetEmail)
    .then(() => {
      toastr.success(successMessage);
      dispatch(resetPasswordSuccess());
    })
    .catch(error => {
      if (email) {
        toastr.success(successMessage);
      } else {
        toastr.error(error.message);
      }

      dispatch(resetPasswordError(error));
    });
};
