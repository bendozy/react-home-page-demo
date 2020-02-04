import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import withImageHeader from '../hocs/withImageHeader';

import '../styles/Login.css';

const loginValidation = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(8)
    .max(16)
    .required('Password is required'),
});

const Login = () => (
  <div className="Login">
    <h2 className="Login-title">Sign In</h2>
    <div className="Login-form">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidation}
        onSubmit={({ setSubmitting }) => {
          console.log('Form is validated! Submitting the form...');
          setSubmitting(false);
        }}
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
              <div className="form-group-item">
                <label htmlFor="password">
                  <span>Password</span>
                </label>
                <Field
                  type="password"
                  name="password"
                  className="form-control password-field"
                />
              </div>
              <ErrorMessage
                component="div"
                name="password"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                Sign In
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);

export default withImageHeader(Login);
