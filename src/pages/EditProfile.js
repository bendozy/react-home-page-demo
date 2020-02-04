import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { getProfile, updateProfile } from '../actions/profile';
import ProfileForm from '../components/ProfileForm';

import '../styles/EditProfile.css';

const EditProfile = ({
  user,
  profile,
  isLoading,
  dispatch,
  history: { push },
}) => {
  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
    dispatch(getProfile());
  }, [profile, dispatch]);

  const handleSubmit = ({
    email,
    password,
    dob,
    address,
    securityQuestionsAnswers,
  }) => {
    const data = {
      id: profile.id,
      email,
      password,
      dob: moment(dob).format(),
      address,
      uid: user.uid,
      securityQuestionsAnswers: profile.securityQuestionsAnswers.map(
        (question, index) => ({
          ...question,
          answer: securityQuestionsAnswers[index],
        }),
      ),
    };

    dispatch(updateProfile(data)).then(() => {
      toastr.success('Profile Updated');
      push('/profile');
    });
  };

  if (isLoading && !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="EditProfile">
      <h2 className="EditProfile-title">Update Profile</h2>
      <ProfileForm
        profile={{ ...user, ...profile }}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const mapStateToProps = ({
  auth: { user },
  profile: { profile, isLoading },
}) => ({
  profile,
  isLoading,
  user,
});

EditProfile.defaultProps = {
  profile: {},
};

EditProfile.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    securityQuestionsAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
    address: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(EditProfile);
