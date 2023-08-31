import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { reduxStore, persistor } from './reduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import { RootState } from './reduxStore';

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <MUDProvider value={result}>
            <App />
            <ToastContainer position="bottom-right" draggable={false} theme="dark" />
          </MUDProvider>
        </PersistGate>
    </Provider>
  )
  
  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      blockStorageOperations$: result.network.blockStorageOperations$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
