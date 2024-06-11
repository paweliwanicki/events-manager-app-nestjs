import './App.css';
import { RouterProvider } from 'react-router-dom';
import { useRouter } from './hooks/useRouter';
import { UserProvider } from './providers/UserProvider';
import SnackBarProvider from './providers/SnackBarProvider';
import { EventsProvider } from './providers/EventsProvider';
import { CookiesProvider } from 'react-cookie';

function App() {
  const { router } = useRouter();
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <UserProvider>
        <EventsProvider>
          <SnackBarProvider>
            <RouterProvider router={router} />
          </SnackBarProvider>
        </EventsProvider>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;
