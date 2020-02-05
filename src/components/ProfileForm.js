import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import DatePicker from 'react-date-picker';
import Dropzone from 'react-dropzone';
import ListErrorMessage from './ListErrorMessage';
import {
  registerFormValidation,
  profileFormValidation,
} from '../helpers/validators';

import '../styles/ProfileForm.css';

const ProfileForm = ({ profile, questions, handleSubmit }) => {
  const securityQuestions = profile
    ? profile.securityQuestionsAnswers
    : questions;
  const [previewSrc, setPreviewSrc] = useState(
    profile && profile.profilePhotoURL
      ? profile.profilePhotoURL
      : 'https://via.placeholder.com/200',
  );

  return (
    <div className="Profile-form">
      <Formik
        initialValues={{
          email: profile ? profile.email : '',
          password: '',
          confirmPassword: '',
          dob: new Date(),
          address: profile ? profile.address : '',
          securityQuestionsAnswers: Array.from({ length: 3 }, (v, i) =>
            securityQuestions[i].answer ? securityQuestions[i].answer : '',
          ),
          profilePhoto: null,
        }}
        validationSchema={
          profile ? profileFormValidation : registerFormValidation
        }
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {profile && (
              <div className="form-group">
                <Dropzone
                  onDrop={acceptedFiles => {
                    setFieldValue('profilePhoto', acceptedFiles[0]);

                    const reader = new FileReader();
                    reader.readAsDataURL(acceptedFiles[0]);
                    reader.onload = () => {
                      setPreviewSrc(reader.result);
                    };
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="image-upload">
                      <div {...getRootProps()}>
                        <img src={previewSrc} alt="preview..." />
                        <input {...getInputProps()} />
                        <p style={{ textAlign: 'center' }}>
                          Drag and drop your photo here, or click to select
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            )}

            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="email">
                  <span>Email</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  disabled={!!profile}
                  className="form-control email-field"
                />
              </div>
              <ErrorMessage
                component="div"
                name="email"
                className="error-message"
              />
            </div>
            {!profile && (
              <>
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
                  <div className="form-group-item">
                    <label htmlFor="confirmPassword">
                      <span>Confirm</span>
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
              </>
            )}
            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="dob">
                  <span>Date of Birth</span>
                </label>
                <DatePicker
                  onChange={date => setFieldValue('dob', date)}
                  value={values.dob || new Date()}
                  calendarIcon={null}
                  className="dob"
                />
              </div>
              <ErrorMessage
                component="div"
                name="dob"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <div className="form-group-item">
                <label htmlFor="address">
                  <span>Address</span>
                </label>
                <Field name="address" className="form-control text-field" />
              </div>
              <ErrorMessage
                component="div"
                name="address"
                className="error-message"
              />
            </div>
            <FieldArray
              name="securityQuestionsAnswers"
              render={() => (
                <>
                  {values.securityQuestionsAnswers.map((question, index) => (
                    <div
                      className="form-group"
                      key={securityQuestions[index].id}
                    >
                      <div className="security-questions form-group-item">
                        <label htmlFor={`securityQuestionsAnswers[${index}]`}>
                          <span>{securityQuestions[index].question}</span>
                        </label>
                        <Field
                          type="text"
                          name={`securityQuestionsAnswers[${index}]`}
                          className="form-control text-field"
                        />
                      </div>
                      <ListErrorMessage
                        name={`securityQuestionsAnswers[${index}]`}
                      />
                    </div>
                  ))}
                </>
              )}
            />
            <div className="form-group">
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {profile ? 'Update' : 'Register'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProfileForm.defaultProps = {
  profile: null,
  questions: [],
};

ProfileForm.propTypes = {
  profile: PropTypes.shape({
    securityQuestionsAnswers: PropTypes.arrayOf(PropTypes.object).isRequired,
    address: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePhotoURL: PropTypes.string,
  }),
  questions: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
};

export default ProfileForm;
