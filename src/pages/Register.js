import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withImageHeader from '../hocs/withImageHeader';
import ProfileForm from '../components/ProfileForm';
import { firestore } from '../firebase/firebase';
import { createUser } from '../actions/auth';

import '../styles/Register.css';

const Register = ({ dispatch, history: { push } }) => {
  const [securityQuestions, setSecurityQuestions] = useState([]);

  useEffect(() => {
    firestore
      .collection('securityQuestions')
      .get()
      .then(snapshots => {
        const questions = snapshots.docs
          .sort(() => 0.5 - Math.random())
          .splice(0, 3)
          .map(doc => {
            const { id } = doc;
            const { question } = doc.data();

            return { id, question };
          });

        setSecurityQuestions(questions);
      });
  }, []);

  const handleSubmit = (
    { email, password, dob, address, securityQuestionsAnswers },
    { setSubmitting },
  ) => {
    const data = {
      email,
      password,
      dob: dob.toString(),
      address,
      securityQuestionsAnswers: securityQuestions.map((question, index) => ({
        ...question,
        answer: securityQuestionsAnswers[index],
      })),
    };

    dispatch(createUser(data)).then(() => {
      push('/');
      setSubmitting(false);
    });
  };

  return (
    <div className="Register">
      <h2 className="Register-title">Register Account</h2>
      {securityQuestions.length === 0 && <div>Loading...</div>}
      {securityQuestions.length > 0 && (
        <ProfileForm
          questions={securityQuestions}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

Register.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default withImageHeader(connect()(Register));
