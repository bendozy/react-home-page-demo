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
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
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

const logoutUserSuccess = user => ({
  type: LOGOUT_USER_SUCCESS,
  user,
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

const changePasswordRequest = () => ({
  type: CHANGE_PASSWORD_REQUEST,
});

const changePasswordSuccess = user => ({
  type: CHANGE_PASSWORD_SUCCESS,
  user,
});

const changePasswordError = error => ({
  type: CHANGE_PASSWORD_ERROR,
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

export const loginUser = (email, password) => dispatch => {
  dispatch(loginUserRequest());

  return auth
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(loginUserSuccess(getUser(user)));
    })
    .catch(error => {
      dispatch(loginUserError(error));
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

export const changePassword = ({
  currentPassword,
  newPassword,
}) => dispatch => {
  dispatch(changePasswordRequest());

  return auth
    .signInWithEmailAndPassword(currentPassword, newPassword)
    .then(() => {
      return auth.currentUser
        .updatePassword(newPassword)
        .then(() => {
          dispatch(changePasswordSuccess());
        })
        .catch(error => {
          dispatch(changePasswordError(error));
        });
    })
    .catch(error => {
      dispatch(changePasswordError(error));
    });
};

export const createUser = ({ email, password, ...profile }) => dispatch => {
  dispatch(createUserRequest());

  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(({ user: { uid } }) => {
      dispatch(createUserSuccess(getUser({ uid, email })));
      return dispatch(createProfile({ uid, ...profile }));
    })
    .catch(error => {
      dispatch(createUserError(error));
    });
};
