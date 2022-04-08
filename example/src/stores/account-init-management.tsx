import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "./index";
import { WalletStatus } from "@keplr-wallet/stores";
import { useWallet, WalletInfo, KeplrWalletConnectV1 } from "cosmodal";

export const AccountInitManagement: FunctionComponent<{
  walletInfoList: WalletInfo[];
}> = observer(({ walletInfoList, children }) => {
  const { chainStore, accountStore } = useStore();

  const wallet = useWallet();

  const chainInfo = chainStore.chainInfos[0];
  const account = accountStore.getAccount(chainInfo.chainId);

  const [accountHasInit, setAccountHasInit] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const value = localStorage.getItem("account_auto_connect");
      if (value) {
        walletInfoList.some((walletInfo) => {
          if (walletInfo.id === value) {
            wallet.setDefaultConnectionType(walletInfo.id);
            return true;
          }
          return false;
        });
        account.init();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (account.walletStatus === WalletStatus.Loaded) {
      setAccountHasInit(true);
      if (typeof localStorage !== "undefined" && wallet.connectionType) {
        localStorage.setItem("account_auto_connect", wallet.connectionType);
      }
    }

    if (accountHasInit && account.walletStatus === WalletStatus.NotInit) {
      setAccountHasInit(false);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("account_auto_connect");
      }
      wallet.getWallet().then((wallet: any) => {
        if (wallet && wallet instanceof KeplrWalletConnectV1) {
          wallet.connector.killSession();
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
});
