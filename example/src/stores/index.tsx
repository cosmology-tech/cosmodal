import React, { FunctionComponent, useState } from "react";

import { RootStore } from "./root";
import { useWallet } from "cosmodal";

const StoreContext = React.createContext<RootStore | null>(null);

export const StoreProvider: FunctionComponent = ({ children }) => {
  const wallet = useWallet();

  const [rootStore] = useState(() => new RootStore(wallet.getWallet));

  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("You have forgot to use StoreProvider");
  }
  return store;
};
