import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';

import { store } from './model/store';

import { initializeConfig } from './services/Config';

initializeConfig();

const root = document.getElementById('root') as HTMLElement;

if (root) {
  ReactDOM.createRoot(root).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.log('ID root could not be found on the page.');
}
