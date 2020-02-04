import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getProfile } from '../actions/profile';
import Password from '../components/Password';

import '../styles/Profile.css';

const Profile = ({ user, profile, isLoading, dispatch, history: { push } }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile());
    }
  }, [profile, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const closeForm = () => {
    setShowPasswordForm(false);
  };

  return (
    <div className="Profile">
      <h2 className="Profile-title">My Account</h2>
      <div className="button-group">
        <button
          type="button"
          onClick={() => {
            push('/profile-edit');
          }}
        >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={() => {
            setShowPasswordForm(true);
          }}
          disabled={showPasswordForm}
        >
          Change Password
        </button>
      </div>
      {showPasswordForm && <Password closeForm={closeForm} />}
      <div className="row">
        <div className="Profile-label">Email:</div>
        <div className="Profile-data">{user.email}</div>
      </div>
      <div className="row">
        <div className="Profile-label">Address:</div>
        <div className="Profile-data">{profile.address}</div>
      </div>
      <div className="row">
        <div className="Profile-label">DOB:</div>
        <div className="Profile-data">
          {moment(profile.dob).format('YYYY-MM-DD')}
        </div>
      </div>
      {profile.securityQuestionsAnswers.map(({ id, question, answer }) => (
        <div className="row" key={id}>
          <div className="Profile-label">{question}</div>
          <div className="Profile-data">{answer}</div>
        </div>
      ))}
    </div>
  );
};

Profile.defaultProps = {
  profile: {},
};

Profile.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    securityQuestionsAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
    address: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({
  auth: { user },
  profile: { profile, isLoading },
}) => ({
  profile,
  isLoading,
  user,
});

export default connect(mapStateToProps)(Profile);
