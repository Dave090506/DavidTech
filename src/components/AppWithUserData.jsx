import App from "../App";
import useAuth from "../context/useAuth";

function AppWithUserData() {
  const { user } = useAuth();

  const userKey = user?.id || "guest";

  return <App key={userKey} />;
}

export default AppWithUserData;
