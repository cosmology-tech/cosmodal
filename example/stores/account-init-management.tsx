import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "./index";
import { WalletStatus } from "@keplr-wallet/stores";
import { useWallet,  KeplrWalletConnectV1 } from "@chainapsis/cosmodal";

/** Manages the initialization of the Osmosis account. */
export const AccountInitManagement: FunctionComponent = observer(
  ({ children }) => {
    const { chainStore, accountStore } = useStore();

    const wallet = useWallet();

    const chainInfo = chainStore.chainInfos[0];
    const account = accountStore.getAccount(chainInfo.chainId);

    const [accountHasInit, setAccountHasInit] = useState(false);

    useEffect(() => {
      if (typeof localStorage !== "undefined") {
        const value = localStorage.getItem("account_auto_connect");
        if (value) {
          if (value === "walletconnect-keplr") {
            wallet.setDefaultConnectionType("walletconnect-keplr");
          } else {
            wallet.setDefaultConnectionType("keplr-wallet-extension");
          }
          account.init();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (account.walletStatus === WalletStatus.Loaded) {
        setAccountHasInit(true);
        if (typeof localStorage !== "undefined") {
          const value =
          wallet.connectionType === "walletconnect-keplr"
              ? "walletconnect-keplr"
              : "keplr-wallet-extension";
          localStorage.setItem("account_auto_connect", value);
        }
      }

      if (accountHasInit && account.walletStatus === WalletStatus.NotInit) {
        setAccountHasInit(false);
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("account_auto_connect");
        }
        wallet.getWallet().then((keplrAPI) => {
          if (keplrAPI && keplrAPI instanceof KeplrWalletConnectV1) {
            keplrAPI.connector.killSession();
          }

          wallet.clearLastUsedWallet();
          wallet.setDefaultConnectionType(undefined);
        });
      }

      if (
        account.walletStatus === WalletStatus.Rejected ||
        account.walletStatus === WalletStatus.NotExist
      ) {
        account.disconnect();
      }
    }, [account, account.walletStatus, accountHasInit, wallet]);

    return <React.Fragment>{children}</React.Fragment>;
  }
);