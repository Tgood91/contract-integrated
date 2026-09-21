import {
  createContext,
  useContext,
  useMemo
} from "react";

import {
  BrowserProvider,
  Contract
} from "ethers";

import ABI from "../abi/BushidoProtocol.json";

import { CONTRACTS } from "../config/contracts";

const BushidoContext =
  createContext<any>(null);

export function BushidoProvider({
  children,
  provider
}: any) {
  const value = useMemo(() => {
    if (!provider) return null;

    const contract = new Contract(
      CONTRACTS.bushido,
      ABI,
      provider
    );

    return {
      contract
    };
  }, [provider]);

  return (
    <BushidoContext.Provider value={value}>
      {children}
    </BushidoContext.Provider>
  );
}

export const useBushidoContext =
  () => useContext(BushidoContext);
