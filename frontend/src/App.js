import {BrowserRouter} from 'react-router-dom';
import Routes from './ui-components/Routes';
import { ToastProvider } from 'react-toast-notifications';

const App = () => {

    return (
      <ToastProvider
        autoDismiss
        autoDismissTimeout={5000}
        placement="top-right"
      >

        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </ToastProvider>
    );
  
}


export default App;
