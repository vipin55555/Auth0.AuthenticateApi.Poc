import { Suspense } from 'react';

import './translations/config'; // Internationalization config using 'react-i18next' package
import '../src/assets/style/style.scss'; // Styles

import { AppFrame } from './components'; // Frame component

import { AppRoute } from './routes/AppRoute'; // Routing either public/private using 'react-router', 'react-router-dom' packages

const App = () => {


  return (
    <Suspense fallback='Loading ..'>
      <AppFrame>
        <AppRoute />
      </AppFrame>
    </Suspense>
  );
}

export default App;
