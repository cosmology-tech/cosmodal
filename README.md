
# Cosmodal is now CosmosKit

CosmosKit: A wallet connector for the Cosmos ⚛️

https://github.com/cosmology-tech/cosmos-kit

Cosmos Kit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

# use Create Cosmos App to get started with CosmosKit

Create Cosmos App: Set up a modern Cosmos app by running one command ⚛️

https://github.com/cosmology-tech/create-cosmos-app

Everything is preconfigured, ready-to-go, so you can focus on your code!

* ⚡️ Connect easily to keplr + keplr mobile via wallet connect 
* ⚛️ Sign and broadcast with [cosmjs](https://github.com/cosmos/cosmjs) stargate + cosmwasm signers
* 🛠 Render pages with [next.js](https://nextjs.org/) hybrid static & server rendering
* 🎨 Build awesome UI with [Cosmos Kit](https://github.com/cosmology-tech/cosmos-kit) and [Chakra UI](https://chakra-ui.com/docs/components)
* 📝 Leverage [chain-registry](https://github.com/cosmology-tech/chain-registry) for Chain and Asset info for all Cosmos chains

# Cosmodal

Connecting web applications to the Cosmos ecosystem.

## Preview

You can test the library on https://cosmodal.vercel.app/

![preview](./preview.png)

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
