import { ConnectKitProvider as _ConnectKitProvider } from "connectkit";

const ConnectKitProvider = ({ children }: { children: React.ReactNode }) => {
  return <_ConnectKitProvider>{children}</_ConnectKitProvider>;
};

export default ConnectKitProvider;
