import {
  KeplrWalletConnectV1,
  WalletInfo,
  WalletProvider,
} from "@chainapsis/cosmodal";
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import WalletConnect from "@walletconnect/client";
import type { AppProps } from "next/app";
import React from "react";
import { EmbedChainInfos } from "../config";
import { StoreProvider } from "../stores";
import "../styles/globals.css";

const walletInfoList: WalletInfo[] = [
  {
    id: "keplr-wallet-extension",
    name: "Keplr Wallet",
    description: "Keplr Browser Extension",
    logoImgUrl: "/keplr-wallet-extension.png",
    getWallet: () => getKeplrFromWindow(),
  },
  {
    id: "walletconnect-keplr",
    name: "WalletConnect",
    description: "Keplr Mobile",
    logoImgUrl: "/walletconnect-keplr.png",
    getWallet: (connector?: WalletConnect) =>
      Promise.resolve(
        connector
          ? new KeplrWalletConnectV1(connector, EmbedChainInfos)
          : undefined
      ),
  },
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider walletInfoList={walletInfoList}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </WalletProvider>
  );
}

export default MyApp;
