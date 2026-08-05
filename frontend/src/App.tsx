import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./store/hooks";

import { markAuthInitialized, restoreSession } from "./store/slices/authSlice";

type AppProps = {
  children: ReactNode;
};

export default function App({ children }: AppProps) {
  const dispatch = useAppDispatch();
  const { idToken, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initialized) {
      return;
    }
    if (idToken) {
      void dispatch(restoreSession());
      return;
    }
    dispatch(markAuthInitialized());
  }, [dispatch, idToken, initialized]);

  return <>{children}</>;
}
