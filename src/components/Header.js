import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import '../styles/Header.css';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/auth';

export const Header = ({ user, isLoading, history: { push }, dispatch }) => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const mobileMenuNode = useRef();

  const handleClick = e => {
    if (!mobileMenuNode.current.contains(e.target)) {
      setMobileMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuVisible(false);
    push('/');
  };

  let menuLinks = [];

  if (!isLoading) {
    menuLinks = user
      ? (menuLinks = [
          { title: 'Profile', url: '/profile' },
          { title: 'Sign out', url: '/logout', button: true },
        ])
      : (menuLinks = [
          { title: 'Login', url: '/login' },
          { title: 'Register', url: '/register' },
        ]);
  }

  const menu = (
    <>
      {menuLinks.map(({ title, url, button }) => (
        <li key={url}>
          {!button && (
            <Link to={url} onClick={() => setMobileMenuVisible(false)}>
              {title}
            </Link>
          )}
          {button && (
            <button
              className="button-link"
              type="button"
              onClick={handleLogout}
            >
              {title}
            </button>
          )}
        </li>
      ))}
    </>
  );

  return (
    <>
      <header className="Header">
        <div className="inner">
          <div className="content">
            <nav>
              <Link className="Header-logo" to="/">
                <i className="fa fa-firefox" />
              </Link>
              <Link className="Header-title" to="/">
                JetCake
              </Link>
            </nav>
            <nav className="Header-webNav">{menu}</nav>
            <button
              className="Header-webNavButton"
              type="button"
              onClick={() => setMobileMenuVisible(true)}
            >
              <i className="fa fa-bars" />
            </button>
          </div>
        </div>
      </header>
      <nav
        ref={mobileMenuNode}
        className={classNames('Header-mobileMenu', {
          'is-visible': isMobileMenuVisible,
        })}
      >
        <ul className="links">{menu}</ul>
        <button
          className="Header-closeButton"
          type="button"
          onClick={() => setMobileMenuVisible(false)}
        >
          &nbsp;
        </button>
      </nav>
    </>
  );
};

Header.defaultProps = {
  user: null,
};

Header.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { user, isLoading } }) => ({
  user,
  isLoading,
});

export default withRouter(connect(mapStateToProps)(Header));
