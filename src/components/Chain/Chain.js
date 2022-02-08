import {AsyncAbi} from './async_abi.js';
import React, { useState, useEffect } from "react";

import { InjectedConnector } from '@web3-react/injected-connector'
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { formatEther } from '@ethersproject/units'
import { getContractAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';

import '../Messages/Message/Message.css';


const getLibrary = (provider) => {
    const library = new Web3Provider(provider); // resolved in the browser
    library.pollingInterval = 15000;
    return library;
}

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

const Chain = (props) => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <_Chain setContract={props.setContract}/>
        </Web3ReactProvider>
    )
}

const _Chain = (props) => {
    const context = useWeb3React();
    let { 
      chainId, 
      account, 
      library, 
      activate, 
      deactivate, 
      active 
    } = context;
    
    let [blockNumber, setBlockNumber] = useState();
    let [ethBalance, setEthBalance] = useState();
    let [contract, setContract] = useState();


    const updateBlockNumber = (blockNumber) =>  {
      setBlockNumber(blockNumber);
    };
    const updateEthBalance = (balance) =>  {
      setEthBalance(balance);
    };
    const getBlockNumber = () => {
      if (library){
        let stale = false;
        library
          .getBlockNumber()
          .then(blockNumber => {
            if (!stale) {
              updateBlockNumber(blockNumber);
              // props.setBlockNumber(blockNumber);
            }
          })
          .catch(() => {
            if (!stale) {
              updateBlockNumber(null);
            }
          });
        console.log(blockNumber);
        return blockNumber;
      }
    }
    const getEthBalance = () => {
      if (library && account) {
        let stale = false;
    
        library
          .getBalance(account)
          .then(balance => {
            if (!stale) {
              // console.log(formatEther(balance))
              setEthBalance(formatEther(balance));
            }
          })
          .catch(() => {
            if (!stale) {
              setEthBalance(null);
            }
          });
          
        return () => {
          stale = true;
          setEthBalance(undefined);
        };
      }
    }
    const activateConnector = () => {
      activate(injected)
      console.log(active)
    }
    const deactivateConnector = () => {
      deactivate(injected)
      console.log(active)
    }

    const getContract = () => {
      if (library) {
        const signer = library.getSigner(account)
        var asyncAddress = "0x4F37310372dd39d451f7022EE587FA8B9F72d80B" // contract address
        const _contract = new Contract(asyncAddress, AsyncAbi, signer)
        setContract(_contract)
        props.setContract(_contract)
      }
    }

    const ownerOfToken = async (token) => {
      if (contract) {
        // contract.ownerOf(BigNumber.from(732)).then((data) => {console.log(data)}).catch((err) => {console.log(err)})
        contract.ownerOf(BigNumber.from(token)).then((data) => {console.log(data)}).catch((err) => {console.log(err)})
        // console.log(owner)
      }
    }

    const valueOfToken = async (token) => {
      if (contract) {
        // contract.ownerOf(BigNumber.from(732)).then((data) => {console.log(data)}).catch((err) => {console.log(err)})
        contract.getControlToken(BigNumber.from(token))
                .then((data) => {console.log(data)})
                .catch((err) => {console.log(err)})
        // console.log(owner)
      }
    }

    useEffect(() => {
      if(!contract){
        getContract()
      }
    })

    const chainOptions = {
      "Activate": activateConnector,
      "Deactivate": deactivateConnector,
      "BlockNumber": getBlockNumber,
      "Balance": activateConnector,
      "Contract": () => {console.log(contract)},
      "Owner": ownerOfToken
    }
    
    return (
      <>
        <h2>Connected: {active ? <div><span className="emoji">✅</span> <span>Network: {chainId}</span></div> : <span className="emoji">❌</span> }</h2>
        <ul>
          {
          Object.keys(chainOptions).map((option,i) => {
            return(<li key={i}><button onClick={chainOptions[option]} className="messageBox backgroundOrange"><span className="messageText">{option}</span></button></li>)
          })
          }
        </ul>
      </>
    )
}

export default Chain;