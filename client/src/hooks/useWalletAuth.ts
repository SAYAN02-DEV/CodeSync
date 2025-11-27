import { useAccount, useSignMessage } from 'wagmi';

interface UseWalletAuthReturn {
  address: string | undefined;
  isConnected: boolean;
  signMessage: (message: string) => Promise<string>;
  verifyOwnership: () => Promise<{ signature: string; message: string; address: string } | null>;
}

export function useWalletAuth(): UseWalletAuthReturn {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signMessage = async (message: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    const signature = await signMessageAsync({ message });
    return signature;
  };

  const verifyOwnership = async () => {
    if (!address || !isConnected) {
      return null;
    }

    const message = `CodeSync - Verify ownership of wallet: ${address}\nTimestamp: ${Date.now()}`;
    
    try {
      const signature = await signMessageAsync({ message });
      return {
        signature,
        message,
        address,
      };
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  };

  return {
    address,
    isConnected,
    signMessage,
    verifyOwnership,
  };
}
