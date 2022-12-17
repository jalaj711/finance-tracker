import "../styles/globals.css";
import type { AppProps } from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import BackButton from "../components/BackButton";
import store, { persistor } from "../utils/store";
import { Provider } from "react-redux";
import Snackbar from "../components/Snackbar";
import GlobalLoader from "../components/GlobalLoader";
import Router from "next/router";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "../utils/reduxHooks";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../components/GlobalLoader/loaderSlice";
import { PersistGate } from "redux-persist/integration/react";
import { refreshWallets } from "../utils/walletThunk";
import { refreshLabels } from "../utils/labelThunk";

config.autoAddCss = false;

const PageTransitionAnimation = (props: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    Router.events.on("routeChangeStart", () => dispatch(showGlobalLoader()));
    Router.events.on("routeChangeComplete", () => dispatch(hideGlobalLoader()));
    // Refresh wallets & labels on first load
    dispatch(refreshWallets());
    dispatch(refreshLabels());
  }, [dispatch]);
  return <>{props.children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PageTransitionAnimation>
            <BackButton />
            <Component {...pageProps} />
            <Snackbar />
          </PageTransitionAnimation>
          <GlobalLoader />
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
