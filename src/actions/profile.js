import { firestore } from '../firebase/firebase';
import {
  CREATE_PROFILE_REQUEST,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_ERROR,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
} from '../constants';

const createProfileRequest = () => ({
  type: CREATE_PROFILE_REQUEST,
});

const createProfileSuccess = profile => ({
  type: CREATE_PROFILE_SUCCESS,
  profile,
});

const createProfileError = error => ({
  type: CREATE_PROFILE_ERROR,
  error,
});

const updateProfileRequest = () => ({
  type: UPDATE_PROFILE_REQUEST,
});

const updateProfileSuccess = profile => ({
  type: UPDATE_PROFILE_SUCCESS,
  profile,
});

const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  error,
});

const getProfileRequest = () => ({
  type: GET_PROFILE_REQUEST,
});

const getProfileSuccess = profile => ({
  type: GET_PROFILE_SUCCESS,
  profile,
});

const getProfileError = error => ({
  type: GET_PROFILE_ERROR,
  error,
});

export const createProfile = data => dispatch => {
  dispatch(createProfileRequest());

  return firestore
    .collection('profiles')
    .add(data)
    .then(() => {
      dispatch(createProfileSuccess());
    })
    .catch(error => {
      dispatch(createProfileError(error));
    });
};

export const updateProfile = ({ id, ...profile }) => dispatch => {
  dispatch(updateProfileRequest());
  console.log('here', id);

  return firestore
    .collection('profiles')
    .doc(id)
    .set(profile)
    .then(() => {
      dispatch(updateProfileSuccess({ id, ...profile }));
    })
    .catch(error => {
      dispatch(updateProfileError(error));
    });
};

export const getProfile = () => (dispatch, getState) => {
  dispatch(getProfileRequest());

  const { uid } = getState().auth.user;

  firestore
    .collection('profiles')
    .where('uid', '==', uid)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.id) {
          dispatch(getProfileSuccess({ id: doc.id, ...doc.data() }));
        }
      });
    })
    .catch(error => {
      dispatch(getProfileError(error));
    });
};
