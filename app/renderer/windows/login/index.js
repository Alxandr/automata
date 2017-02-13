import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';

export const start = (id) => {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    ReactDOM.render(<Login id={id} />, root);
  });
};
