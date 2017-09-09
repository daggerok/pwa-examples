import './styles.scss';

import appTemplate from './components/App.hbs';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').innerHTML = appTemplate({
    title: 'hi!'
  });
});
