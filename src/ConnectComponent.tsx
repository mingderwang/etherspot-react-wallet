import * as React from 'react'
import { useState, useEffect } from "react";
import styles from './styles.module.css'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider';

interface Props {
  text: string
}
declare let window: any;

export const ConnectComponent = ({ text }: Props) => {
  const ethereum = window.ethereum
  const [val, setVal] = useState(0)
  const [chainId, handleChainChanged] = useState('👻')
  const [account, setAccount] = useState('👻');

  const getChainId = async () => {
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('changed ID ', chainId)
    handleChainChanged(chainId.toString());
  }

  const updateAccount = async () => {
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    setAccount(accounts.length >= 1 ? accounts[0] : "no account");
  }

  const initMetamask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      console.log(provider)
      startApp(provider); // initialize your app
    } else {
      console.log('Please install MetaMask!');
    }
  }
  const startApp = async (provider: any) => {
    const library = new ethers.providers.Web3Provider(provider)
    const signer = library.getSigner()
    try {
      const addr = await signer.getAddress()
      console.log(addr)
      console.log('signer ', signer)
      setAccount(addr)
    }
    catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {

    (async function run() {
      await initMetamask()
      if (window) {
        await getChainId()
        window.ethereum.on('chainChanged', (_chainId: string) => {
          console.log('changed chainId ', _chainId)
          handleChainChanged(_chainId);
        });
        await updateAccount()
        window.ethereum.on('accountsChanged', (_accounts: Array<string>) => {
          console.log('get accounts ', _accounts)
          console.log(_accounts.length)
          setAccount((_accounts.length >= 1) ? _accounts[0] : 'no account');
        });

        console.log(window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(provider)
        const signer = provider.getSigner()
        try {
          const addr = await signer.getAddress()
          console.log(addr)
          console.log('signer ', signer)
          setAccount(addr)
        }
        catch (ex) {
          console.log(ex);
        }
      } else {
        alert('please login with metamask')
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVal((v: number) => v + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const connectMetamask = async () => {
    console.log('Start the metamask extension')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    console.log('account ', account)
    setAccount(account)
  }

  return <div className={styles.simple}>
    🦋 Connect to Ropsten (0x3) Testnet Only: {text} {val} {account} chainId: {chainId} 🚀
    <button type="button" onClick={connectMetamask}>
      📡 connect !!
    </button>
  </div>
}
