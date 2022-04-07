import { Bech32Address } from "@keplr-wallet/cosmos";
import { WalletStatus } from "@keplr-wallet/stores";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores";

function App() {
  const { chainStore, accountStore } = useStore();
  const account = accountStore.getAccount(chainStore.chainInfos[0].chainId);

  return (
    <div className="h-screen bg-white dark:bg-dark text-gray-800 dark:text-gray-200">
      <header className="fixed top-0 p-4 w-full">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between">
          <span className="text-xl font-bold">Cosmodal</span>
          {account.walletStatus === WalletStatus.Loaded ? (
            <div className="flex items-center gap-4">
              <span>
                {Bech32Address.shortenAddress(account.bech32Address, 18)}
              </span>
              <button
                className="px-3 py-2 rounded-md border border-gray-800 dark:border-gray-200"
                onClick={(e) => {
                  e.preventDefault();
                  account.disconnect();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="px-3 py-2 rounded-md border border-gray-800 dark:border-gray-200"
              onClick={(e) => {
                e.preventDefault();
                account.init();
              }}
            >
              Test Cosmodal
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default observer(App);
