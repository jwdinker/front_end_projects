import React, { useEffect, useRef, useState, useCallback, Component } from 'react';
import PropTypes from 'prop-types';
import useEventListner from '@jwdinker/use-event-listener';

function Mapkit({ handleAuthorization, language, children, isLoaded }) {
  const handler = useRef();

  useEffect(() => {
    handler.current = handleAuthorization;
  });

  useEffect(() => {
    mapkit.init({
      language,
      authorizationCallback: async (done) => {
        await handler.current((token) => {
          done(token);
        });
      },
    });
  }, [language]);

  return null;
}

Mapkit.defaultProps = {
  language: null,
};

Mapkit.propTypes = {
  handleAuthorization: PropTypes.func.isRequired,
};

export default Mapkit;
