// usePurgeStore.ts
import { useEffect, useState } from 'react';
import { persistor } from "./reduxStore";

export const usePurgeStore = (shouldPurge: boolean) => {
  const [purgeComplete, setPurgeComplete] = useState(false);

  const manualPurge = () => {
    persistor.purge().then(() => {
      setPurgeComplete(true);
      console.log("purge complete");
    });
  };

  return [purgeComplete, manualPurge] as const;
};
