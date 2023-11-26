import React, { useEffect, useState } from 'react';
import { useWalletAddress, useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { createWalletStore } from './create-wallet-store';
import { WalletStores } from './wallet-store-provider';
import { WalletAddressContext } from './wallet-address-context';

export function AccountEvents() {
    const client = useXRPLClient();
    const address = useWalletAddress();

    // enable account events
    // update store

    const networkEmitter = useNetworkEmitter();

    useEffect(() => {
        networkEmitter.addAddress(address);

        return () => {
            networkEmitter.removeAddress(address);
        };
    });

    return null;
}
