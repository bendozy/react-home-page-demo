import * as Yup from 'yup';

export const registerFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(8)
    .max(16)
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  address: Yup.string().required('Address is required'),
  securityQuestionsAnswers: Yup.array().of(
    Yup.string().required('Answer to Security Question is Required'),
  ),
});

export const profileFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  address: Yup.string().required('Address is required'),
  securityQuestionsAnswers: Yup.array().of(
    Yup.string().required('Answer to Security Question is Required'),
  ),
});
