import { getKeplrFromWindow } from "@keplr-wallet/stores";
import WalletConnect from "@walletconnect/client";
import {
  KeplrWalletConnectV1,
  WalletInfo,
  WalletManagerProvider,
} from "cosmodal";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { EmbedChainInfos } from "../config";
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
    <WalletManagerProvider walletInfoList={walletInfoList}>
      <Head>
        <title>Cosmodal</title>
        <meta property="og:title" content="Cosmodal" />
        <meta
          property="og:description"
          content="Connecting web applications to the Cosmos ecosystem"
        />
      </Head>
      <Component {...pageProps} />
    </WalletManagerProvider>
  );
}

export default MyApp;
