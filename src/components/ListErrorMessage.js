import React from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';

const ListErrorMessage = ({ name }) => (
  <div className="error-message">
    <Field name={name}>
      {({ form }) => {
        const error = getIn(form.errors, name);
        const touch = getIn(form.touched, name);
        return touch && error ? error : null;
      }}
    </Field>
  </div>
);

ListErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ListErrorMessage;
