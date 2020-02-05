import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getProfile, updateProfile } from '../actions/profile';
import ProfileForm from '../components/ProfileForm';
import { storage } from '../firebase/firebase';

import '../styles/EditProfile.css';

const EditProfile = ({ user, profile, isLoading, dispatch, history }) => {
  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [dispatch, profile]);

  const handleSubmit = (
    { email, password, dob, address, securityQuestionsAnswers, profilePhoto },
    { setSubmitting },
  ) => {
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

    if (profilePhoto) {
      const storageRef = storage.ref(`profilePhotos/${profile.id}`);

      storageRef.put(profilePhoto).then(() => {
        storageRef.getDownloadURL().then(profilePhotoURL => {
          data.profilePhotoURL = profilePhotoURL;
          dispatch(
            updateProfile({ profile: { ...profile, ...data }, history }),
          );
        });
      });
    } else {
      dispatch(updateProfile({ profile: { ...profile, ...data }, history }));
    }

    setSubmitting(false);
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
  }),
  isLoading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(EditProfile);
