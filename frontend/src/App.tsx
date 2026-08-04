import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { restoreSession } from "./store/slices/authSlice";

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  const dispatch = useAppDispatch();

  const { status, idToken } = useAppSelector((state) => state.auth);
  const authState = useAppSelector((state) => state.auth);

  console.log("auth state", authState);

  console.log("idToken", idToken);
  console.log("status", status);
  useEffect(() => {
    if (idToken && status === "authenticated") {
      void dispatch(restoreSession());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default App;
