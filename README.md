# Cosmodal

Connecting web applications to the Cosmos ecosystem.

## Running example locally

```
yarn && yarn start

# OR

npm install && npm run start
```

## Usage

**Now It supports React application only.**

1. Install Cosmodal npm package

```
yarn add cosmodal

# OR

npm install --save cosmodal
```

2. Import `WalletManagerProvider` and render it around your whole app.

```tsx
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import WalletConnect from "@walletconnect/client";
import {
  KeplrWalletConnectV1,
  WalletInfo,
  WalletManagerProvider,
} from "cosmodal";
import type { AppProps } from "next/app";
import Head from "next/head";
import { EmbedChainInfos } from "../config";

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
      <Component {...pageProps} />
    </WalletManagerProvider>
  );
}

export default MyApp;
```

3. Manage and Use wallet using `useWalletManager` in your component

```tsx
import { Keplr } from "@keplr-wallet/types";
import { KeplrWalletConnectV1, useWalletManager } from "cosmodal";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const { getWallet } = useWalletManager();

  const connectWallet = async () => {
    const wallet: Keplr | KeplrWalletConnectV1 = await getWallet();
    await wallet.enable(["cosmoshub-4"]);

    const key = await wallet.getKey("cosmoshub-4");
    setAddress(key.bech32Address);
  };

  return <div>Your address: {address}</div>;
};

export default Home;
```

## Learn More

To learn more about Cosmodal API, please check [our example code](https://github.com/chainapsis/cosmodal/tree/main/example)

To learn more about how to use Keplr-specific API, please check the following resources:

- [Keplr Example](https://github.com/chainapsis/keplr-example)
- [Keplr Documentation](https://docs.keplr.app)

To learn more about JavaScript client library for Cosmos check out [CosmJS](https://github.com/chainapsis/keplr-example)
