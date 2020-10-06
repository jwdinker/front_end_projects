import React, { useEffect, useRef, useState, useCallback, Component } from 'react';

function Mapkit({ handleAuthorization, language, children, isLoaded }) {
  const handler = useRef();

  useEffect(() => {
    handler.current = handleAuthorization;
  });

  useEffect(() => {
    const isWindow = typeof window !== 'undefined';
    if (isWindow) {
      window.mapkit.init({
        language,
        authorizationCallback: async (done) => {
          await handler.current((token) => {
            done(token);
          });
        },
      });
    }
  }, [language]);

  return null;
}

Mapkit.defaultProps = {
  language: null,
};

export default Mapkit;
