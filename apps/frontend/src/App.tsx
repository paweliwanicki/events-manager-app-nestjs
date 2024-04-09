import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useRouter } from "./hooks/useRouter";
import { UserProvider } from "./providers/UserProvider";
import SnackBarProvider from "./providers/SnackBarProvider";
import { EventsProvider } from "./providers/EventsProvider";

function App() {
  const { router } = useRouter();
  return (
    <UserProvider>
      <EventsProvider>
        <SnackBarProvider>
          <RouterProvider router={router} />
        </SnackBarProvider>
      </EventsProvider>
    </UserProvider>
  );
}

export default App;
