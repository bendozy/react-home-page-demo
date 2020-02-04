import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { changePassword } from '../actions/auth';

import '../styles/Password.css';

const passwordValidation = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8)
    .max(16)
    .required('Password is required'),
  newPassword: Yup.string()
    .min(8)
    .max(16)
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const Password = ({ dispatch, closeForm }) => (
  <div className="Password">
    <div className="Password-form">
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={passwordValidation}
        onSubmit={({ currentPassword, newPassword }, { setSubmitting }) => {
          console.log('Form is validated! Submitting the form...');
          dispatch(changePassword({ currentPassword, newPassword }))
            .then(() => {
              console.log('success');
            })
            .catch(error => {
              console.log('error', error);
            });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="currentPassword">
                  <span>Current Password</span>
                </label>
                <Field
                  type="password"
                  name="currentPassword"
                  className="form-control password-field"
                />
              </div>
              <ErrorMessage
                component="div"
                name="currentPassword"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="newPassword">
                  <span>New Password</span>
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  className="form-control password-field"
                />
              </div>
              <ErrorMessage
                component="div"
                name="newPassword"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="password">
                  <span>Confirm Password</span>
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control password-field"
                />
              </div>
              <ErrorMessage
                component="div"
                name="confirmPassword"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                Change Password
              </button>
            </div>
            <div className="form-group">
              <button type="button" className="form-submit" onClick={closeForm}>
                Close Form
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);

Password.propTypes = {
  dispatch: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
};
export default connect()(Password);
