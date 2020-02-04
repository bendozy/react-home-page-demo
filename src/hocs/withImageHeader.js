import React from 'react';

import '../styles/withImageHeader.css';

const withImageHeader = WrappedComponent => props => (
  <div className="withImageHeader">
    <div className="withImageHeader-image" />
    <div className="inner">
      <WrappedComponent {...props} />
    </div>
  </div>
);

export default withImageHeader;
