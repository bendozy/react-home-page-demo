import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import withImageHeader from '../hocs/withImageHeader';
import { loginUser } from '../actions/auth';

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

const Login = ({ dispatch, history }) => {
  const handleSubmit = ({ email, password }, { setSubmitting }) => {
    dispatch(loginUser({ email, password, history }));

    setSubmitting(false);
  };

  return (
    <div className="Login">
      <h2 className="Login-title">Sign In</h2>
      <div className="Login-form">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginValidation}
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
      <Link className="forgot-password" to="/forgot-password">
        Forgot Password
      </Link>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(withImageHeader(Login));
