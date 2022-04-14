import { Keplr } from "@keplr-wallet/types";
import { KeplrWalletConnectV1, useWalletManager } from "cosmodal";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { EmbedChainInfos } from "../config";

const AUTO_CONNECT_WALLET_KEY = "auto_connect_wallet";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const {
    getWallet,
    clearLastUsedWallet,
    connectionType,
    setDefaultConnectionType,
  } = useWalletManager();
  const currentChainId = EmbedChainInfos[0].chainId;

  const connectWallet = async () => {
    const wallet: Keplr | KeplrWalletConnectV1 = await getWallet();
    await wallet.enable([currentChainId]);
    const key = await wallet.getKey(currentChainId);
    setAddress(key.bech32Address);
  };

  const signOut = () => {
    setAddress("");
    clearLastUsedWallet();
    setDefaultConnectionType(undefined);
    localStorage.removeItem(AUTO_CONNECT_WALLET_KEY);
    // For removing cached WalletConnect info
    localStorage.removeItem("walletconnect");
  };

  useEffect(() => {
    if (connectionType) {
      localStorage.setItem(AUTO_CONNECT_WALLET_KEY, connectionType);
    }
  }, [connectionType]);

  useEffect(() => {
    const autoConnectionType = localStorage.getItem(AUTO_CONNECT_WALLET_KEY);
    if (autoConnectionType) {
      setDefaultConnectionType(autoConnectionType);
      connectWallet();
    }
  }, []);

  return (
    <div className="flex items-center">
      {address}
      <button
        onClick={(e) => (address ? signOut() : connectWallet())}
        className="border border-black rounded-md py-2 px-4 flex items-center justify-center"
      >
        {address ? "Sign Out" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Home;
