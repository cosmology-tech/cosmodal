import { StdTx } from "@cosmjs/launchpad";
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import React from "react";
import ReactDOM from "react-dom";
import { BroadcastMode } from "secretjs";
import App from "./App";
import { KeplrWalletConnectV1, GetWalletProvider, WalletInfo } from "cosmodal";
import { StoreProvider } from "./stores";
import Axios from "axios";
import { EmbedChainInfos } from "./config";

import "./styles/index.css";
import { AccountInitManagement } from "./stores/account-init-management";
import WalletConnect from "@walletconnect/client";

export async function sendTxWC(
  chainId: string,
  tx: StdTx | Uint8Array,
  mode: BroadcastMode
): Promise<Uint8Array> {
  const restInstance = Axios.create({
    baseURL: EmbedChainInfos.find((chainInfo) => chainInfo.chainId === chainId)!
      .rest,
  });

  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;

  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString("base64"),
        mode: (() => {
          switch (mode) {
            case "async":
              return "BROADCAST_MODE_ASYNC";
            case "block":
              return "BROADCAST_MODE_BLOCK";
            case "sync":
              return "BROADCAST_MODE_SYNC";
            default:
              return "BROADCAST_MODE_UNSPECIFIED";
          }
        })(),
      }
    : {
        tx,
        mode: mode,
      };

  const result = await restInstance.post(
    isProtoTx ? "/cosmos/tx/v1beta1/txs" : "/txs",
    params
  );

  const txResponse = isProtoTx ? result.data["tx_response"] : result.data;

  if (txResponse.code != null && txResponse.code !== 0) {
    throw new Error(txResponse["raw_log"]);
  }

  return Buffer.from(txResponse.txhash, "hex");
}

const walletInfoList: WalletInfo[] = [
  {
    id: "keplr-wallet-extension",
    name: "Keplr Wallet",
    description: "Keplr Browser Extension",
    logoImgUrl: "/keplr-logo.png",
    getWallet: () => getKeplrFromWindow(),
  },
  {
    id: "walletconnect-keplr",
    name: "WalletConnect",
    description: "Keplr Mobile",
    logoImgUrl: "/wallet-connect-logo.png",
    getWallet: (connector: WalletConnect) =>
      Promise.resolve(
        connector
          ? new KeplrWalletConnectV1(connector, {
              sendTx: sendTxWC,
            })
          : undefined
      ),
  },
];

ReactDOM.render(
  <React.StrictMode>
    <GetWalletProvider walletInfoList={walletInfoList}>
      <StoreProvider>
        <AccountInitManagement walletInfoList={walletInfoList} />

        <App />
      </StoreProvider>
    </GetWalletProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
