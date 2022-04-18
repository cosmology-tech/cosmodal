import { SigningStargateClient } from "@cosmjs/stargate";
import { Bech32Address } from "@keplr-wallet/cosmos";
import { Keplr } from "@keplr-wallet/types";
import { KeplrWalletConnectV1, useWalletManager } from "cosmodal";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { EmbedChainInfos } from "../config";

const AUTO_CONNECT_WALLET_KEY = "auto_connect_wallet";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [stakeCurrencyAmount, setStakeCurrencyAmount] = useState(0);
  const {
    getWallet,
    clearLastUsedWallet,
    connectionType,
    setDefaultConnectionType,
  } = useWalletManager();

  const currentChain = EmbedChainInfos[0];

  const connectWallet = async () => {
    const wallet: Keplr | KeplrWalletConnectV1 = await getWallet();
    await wallet.enable([currentChain.chainId]);
    const key = await wallet.getKey(currentChain.chainId);
    setAddress(key.bech32Address);

    const offlineSigner = wallet.getOfflineSigner(currentChain.chainId);
    const client = await SigningStargateClient.connectWithSigner(
      currentChain.rpc,
      offlineSigner
    );
    const stakeCurrencyBalance = await client.getBalance(
      key.bech32Address,
      currentChain.stakeCurrency.coinMinimalDenom
    );
    setStakeCurrencyAmount(parseFloat(stakeCurrencyBalance.amount) / 1000000);
  };

  const signOut = () => {
    setAddress("");
    clearLastUsedWallet();
    setDefaultConnectionType(undefined);
    localStorage.removeItem(AUTO_CONNECT_WALLET_KEY);
    // For removing cached WalletConnect info
    localStorage.removeItem("walletconnect");
  };

  // Store connected wallet type
  useEffect(() => {
    if (connectionType) {
      localStorage.setItem(AUTO_CONNECT_WALLET_KEY, connectionType);
    }
  }, [connectionType]);

  // Automatically connect wallet as stored type, even if page refreshed,
  useEffect(() => {
    const autoConnectionType = localStorage.getItem(AUTO_CONNECT_WALLET_KEY);
    if (autoConnectionType) {
      setDefaultConnectionType(autoConnectionType);
      connectWallet();
    }
  }, []);

  return (
    <div className="max-w-[768px] m-auto px-4">
      <header className="flex items-center justify-between py-3">
        <div className="flex items-center">
          <img src="/logo.png" alt="logo" className="h-12" />
          <img src="/cosmodal.png" alt="cosmodal" className="ml-2 w-32" />
        </div>
        <div className="flex items-center">
          <span className="hidden sm:inline">
            {Bech32Address.shortenAddress(address, 22)}
          </span>
          <button
            onClick={(e) => (address ? signOut() : connectWallet())}
            className="border border-black rounded-md ml-3 py-2 px-3 flex items-center justify-center"
          >
            {address ? "Sign Out" : "Connect Wallet"}
          </button>
        </div>
      </header>
      {address && (
        <main className="mt-12 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg">Connected Network</div>
            <div className="text-2xl mt-2">{currentChain.chainName}</div>
          </div>
          <div className="mt-14">
            <div className="flex flex-col items-center w-[280px]">
              <div className="font-bold text-lg">Balances</div>
              <div className="text-xl mt-4 flex justify-between w-full">
                <div className="flex items-center">
                  <img src="/atom.svg" className="w-8 h-8" />
                  <span className="ml-2">
                    {currentChain.stakeCurrency.coinDenom}
                  </span>
                </div>
                <div>{stakeCurrencyAmount}</div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Home;
