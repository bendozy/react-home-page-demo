import {
  GET_USER_REQUEST,
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

export const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
    case CREATE_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case CREATE_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: action.profile,
        error: null,
      };

    case CREATE_PROFILE_ERROR:
    case UPDATE_PROFILE_ERROR:
    case GET_PROFILE_ERROR:
      return {
        ...state,
        isLoading: false,
        profile: null,
        error: null,
      };

    default:
      return state;
  }
};
