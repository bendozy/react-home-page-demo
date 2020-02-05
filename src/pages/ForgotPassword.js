import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import withImageHeader from '../hocs/withImageHeader';
import { resetPassword } from '../actions/auth';

import '../styles/ForgotPassword.css';

const forgortPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
});

const ForgotPassword = ({ dispatch }) => {
  const handleSubmit = ({ email }, { setSubmitting }) => {
    dispatch(resetPassword(email));

    setSubmitting(false);
  };

  return (
    <div className="ForgotPassword">
      <h2 className="ForgotPassword-title">Forgot Password</h2>
      <div className="ForgotPassword-form">
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgortPasswordValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <div className="form-group-item">
                  <label htmlFor="email">
                    <span>Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control email-field"
                  />
                </div>
                <ErrorMessage
                  component="div"
                  name="email"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="form-submit"
                  disabled={isSubmitting}
                >
                  Send Reset Link
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(withImageHeader(ForgotPassword));
