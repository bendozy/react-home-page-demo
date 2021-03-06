import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PageLayout from '../layouts/PageLayout';

/* eslint-disable react/jsx-props-no-spreading */
const NonAuthRoute = ({ component: Component, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const component = !user ? (
          <PageLayout>
            <Component {...props} />
          </PageLayout>
        ) : (
          <Redirect to="/" />
        );
        return component;
      }}
    />
  );
};

NonAuthRoute.defaultProps = {
  user: null,
};

NonAuthRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }),
};

export const mapStateToProps = ({ auth: { user } }) => ({
  user,
});

export default connect(mapStateToProps)(NonAuthRoute);
