import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import {
  Sdk,
  Env,
  EnvNames,
  MetaMaskWalletProvider,
  P2PPaymentChannel,
  NetworkNames,
  sleep,
  randomPrivateKey
} from 'etherspot'
//TransactionRequest,

import { ethers, utils } from 'ethers'
//BigNumberish

import { ContractNames } from '@etherspot/contracts'
//getContractAbi
//const erc20Abi: any = getContractAbi(ContractNames.ERC20Token);
console.log('contract name', ContractNames.ERC20Token)
//P2PPaymentChannel
const privateKeyA = randomPrivateKey()
const privateKeyB = randomPrivateKey()

var senderEtherspotUser: Sdk
var receiverEtherspotUser: Sdk
interface Props {
  text: string
}
declare let window: any
// change default environment
Env.defaultName = 'testnets' as EnvNames
//const privateKey ='0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140' //randomPrivateKey()
/*
interface ERC20Contract {
  encodeApprove(spender: string, value: BigNumberish): TransactionRequest
}
*/

//const erc20Address = '0xaD6D458402F60fD3Bd25163575031ACDce07538D' // DAI token

export const EtherspotComponent = ({ text }: Props) => {
  const [senderAddress, setSenderAddress] = useState('👽')
  const [receiverAddress, setReceiverAddress] = useState('👽')
  const [p2pPaymentDepositAddress, setP2pPaymentDepositAddress] = useState('👽')
  //  const [depositRec, setDepositRec] = useState('👽')
  const [gas, setGas] = useState('👽')
  const [hash2, setHash] = useState('👽')
  const [receiver, receiverAccountInput] = useState('👽')
  const [amount, amountInput] = useState('👽')
  const [lastHash, lastHashInput] = useState('👽')

  useEffect(() => {
    ;(async function run() {
      if (!MetaMaskWalletProvider.detect()) {
        console.log('MetaMask not detected')
        return
      }
      const walletProvider = await MetaMaskWalletProvider.connect()
      console.log(walletProvider)
      senderEtherspotUser = new Sdk(privateKeyA, {
        networkName: 'etherspot' as NetworkNames
      })

      senderEtherspotUser.notifications$.subscribe(
        async (notification: any) => {
          console.log('sdk 🦋🦋🦋🦋:', notification)
          await logDeposits()
        }
      )
      console.log('state', senderEtherspotUser.state)
      console.log(senderEtherspotUser.state.p2pPaymentDepositAddress)
      receiverEtherspotUser = new Sdk(
        { privateKey: privateKeyB },
        {
          networkName: 'etherspot' as NetworkNames
        }
      )
      await senderEtherspotUser.topUpAccount().catch(console.error)
      await receiverEtherspotUser.topUpAccount().catch(console.error)
      await senderEtherspotUser
        .topUpPaymentDepositAccount()
        .catch(console.error)
      await receiverEtherspotUser
        .topUpPaymentDepositAccount()
        .catch(console.error)
      sleep(5)
      const Senderbal = await senderEtherspotUser.getAccountBalances()

      console.log('Sender balances', Senderbal)
      console.log(Senderbal.items[0].balance.toString())
      const Rbal = await receiverEtherspotUser.getAccountBalances()

      console.log('Receiver balances', Rbal)
      console.log(Rbal.items[0].balance.toString())

      receiverEtherspotUser.notifications$.subscribe(
        async (notification: any) => {
          console.log('rec 🦋🦋🦋🦋:', notification)
          await logDeposits()
        }
      )

      // const { p2pDepositAddress } = senderEtherspotUser.state;

      console.info('SDK created')
      const output = await senderEtherspotUser.syncAccount()
      console.log('👽 account', output.address)
      console.log(output)
      console.log('👽 sender account', output.address)
      setSenderAddress(output.address)

      const output2 = await receiverEtherspotUser.syncAccount()
      setReceiverAddress(output2.address)
      console.log(
        '👽 receiver account',
        receiverEtherspotUser.state.accountAddress
      )

      const outputx = await senderEtherspotUser.computeContractAccount()

      console.log('sender contract account', outputx)

      const outputxx = await receiverEtherspotUser.computeContractAccount()

      console.log('receiver contract account', outputxx)

      const outputSS = await senderEtherspotUser.batchDeployAccount()

      console.log('gateway batch Sender', outputSS)

      const outputRR = await receiverEtherspotUser.batchDeployAccount()

      console.log('gateway batch Receiver', outputRR)

      const { p2pPaymentDepositAddress } = senderEtherspotUser.state
      setP2pPaymentDepositAddress(p2pPaymentDepositAddress)

      await logDeposits()

      //(receiverEtherspotUser.state.p2pPaymentDepositAddress)
    })().catch(console.error)
  }, [])

  const logChannels = async () => {
    console.log('xx sender address', senderAddress)
    const channels1 = await senderEtherspotUser.getP2PPaymentChannels({
      senderOrRecipient: senderAddress,
      page: 1
    })
    console.log('logChannels Sender', channels1)
    const channels = await senderEtherspotUser.getP2PPaymentChannels({
      senderOrRecipient: senderAddress,
      page: 2
    })
    console.log('logChannels Sender', channels)
    const size = channels.items.length
    //  setHash(channels.items[size - 1].hash)
    console.log('🛰 getP2pChannels.last hash', channels.items[size - 1].hash)

    console.log('xx receiver address', receiverAddress)
    const channelsR = await senderEtherspotUser.getP2PPaymentChannels({
      senderOrRecipient: receiverAddress
    })
    console.log('logChannels Receiver', channelsR)
    const sizeR = channelsR.items.length
    //setHash(channelsR.items[sizeR - 1].hash)
    if (sizeR > 0) {
      console.log(
        '🛰 getP2pChannels.last Receiver hash',
        channelsR.items[sizeR - 1].hash
      )
    }
  }

  const logDeposits = async () => {
    console.log(
      '🚄 getP2pPDeposits',
      await senderEtherspotUser.getP2PPaymentDeposits()
    )
    senderEtherspotUser.getP2PPaymentDeposits().then((x) => {
      console.log(
        '🚄 getP2pPDeposits.0.availableAmount',
        utils.formatUnits(x.items[0].availableAmount.toString(), 18)
      )
      console.log(
        'lockedAmount',
        utils.formatUnits(x.items[0].lockedAmount.toString(), 18)
      )
      console.log(
        'pendingAmount',
        utils.formatUnits(x.items[0].pendingAmount.toString(), 18)
      )
      if (x.items[0].latestWithdrawal) {
        console.log(
          'latestWithdrawal.value',
          utils.formatUnits(x.items[0].latestWithdrawal.value.toString(), 18)
        )
        console.log(
          'latestWithdrawal.totalAmount',
          utils.formatUnits(
            x.items[0].latestWithdrawal.totalAmount.toString(),
            18
          )
        )
      }
      console.log(
        'totalAmount',
        utils.formatUnits(x.items[0].totalAmount.toString(), 18)
      )
      console.log(
        'withdrawAmount',
        utils.formatUnits(x.items[0].withdrawAmount.toString(), 18)
      )
    })
  }

  return (
    <div className={styles.simple}>
      To sent:{' '}
      <input
        value={amount}
        onChange={(e) => amountInput(e.target.value)}
        type='text'
      />
      to Account :{' '}
      <input
        value={receiver}
        onChange={(e) => receiverAccountInput(e.target.value)}
        type='text'
      />{' '}
      <p />
      Hash for withdraw:{' '}
      <input
        value={lastHash}
        onChange={(e) => lastHashInput(e.target.value)}
        type='text'
      />
      🦋 Ethereum Wallet: {text} account: {senderAddress} 🚀 receiver account:{' '}
      {receiverAddress} 👻
      <p /> p2pPayment deposit address: {p2pPaymentDepositAddress} ⛽️ estimated
      Gas {gas} 🦋 last hash: {hash2}
      <button
        type='button'
        onClick={async () => {
          /**
           * We're going to set 1 ETH as amount to be transferred.
           */
          const partialPaymentValue = 10
          const partialPaymentCount = 1

          let hashx: string = ''

          for (let index = 1; index <= partialPaymentCount; index++) {
            const totalAmount = index * partialPaymentValue
            const paymentChannel = await senderEtherspotUser.updateP2PPaymentChannel(
              {
                totalAmount: totalAmount,
                recipient: receiverEtherspotUser.state.accountAddress
              }
            )

            if (hashx === '') {
              hashx = paymentChannel.hash
            }

            console.log(`payment channel #${index}`, paymentChannel)
          }

          console.log('🚘 Hash:', hashx)
          setHash(hashx)
        }}
      >
        📡 update 30 ETH
      </button>
      <button
        type='button'
        onClick={async () => {
          /**
           * We're going to set 1 ETH as amount to be transferred.
           */
          const amountToSend = ethers.utils.parseEther('1')
          console.log('receiver', receiver)
          const x: P2PPaymentChannel = await senderEtherspotUser.increaseP2PPaymentChannelAmount(
            {
              recipient: receiver, // input receiver address from UI
              value: amountToSend
            }
          )
          console.log('✈️ channel done', x)
          console.log('🚘 Hash:', x.hash)
          setHash(x.hash)
        }}
      >
        📡 increase 1 ETH
      </button>
      <button
        type='button'
        onClick={async () => {
          await logChannels()
          /*
          const amountToSend = ethers.utils.parseEther('1')

          const output: P2PPaymentChannel = await senderEtherspotUser.increaseP2PPaymentChannelAmount(
            {
              recipient: receiverEtherspotUser.state.accountAddress,
              value: amountToSend
            }
          )
          

          // This is the hash we will use in the next step.
          console.log('Hash:', output)
*/
          // require to clear all batch
          await receiverEtherspotUser.clearGatewayBatch()

          /**
           * Next, commit the Payment Channel. The
           * batchCommitP2PPaymentChannel takes an object with two
           * properties:
           * - hash: the previously created Payment channel hash
           * - deposit:
           * - - true: the exchange amount is transferred to the p2pDepositAddress.
           * - - false: the exchange amount is transferred to the accountAddress
           */
          await receiverEtherspotUser
            .batchCommitP2PPaymentChannel({
              hash: lastHash ? lastHash : hash2,
              deposit: false // See notes above
            })
            .catch(console.error)
          console.log('sender hash', hash2)
          console.log('input hash', lastHash)

          const es: any = await receiverEtherspotUser.estimateGatewayBatch()
          console.log('gas', es.estimation.estimatedGas)
          setGas(es.estimation.estimatedGas)

          await receiverEtherspotUser
            .submitGatewayBatch()
            .then(async () => {
              await senderEtherspotUser
                .batchWithdrawP2PPaymentDeposit({
                  amount: '0x0de0b6b3a7640000' // 1 ETH
                })
                .then(console.log)
            })
            .catch(console.error)

          await logDeposits()
        }}
      >
        📡 withDraw !!
      </button>
      <button
        type='button'
        onClick={async () => {
          console.log('logger')
          await logDeposits()
          await logChannels()
        }}
      >
        📡 logs!!
      </button>
      <button
        type='button'
        onClick={async () => {
          const recepitent =
            receiver === '' || receiver === '👽' ? receiverAddress : receiver
          console.log('send to recepitent', recepitent)

          //const amtInWei = '500000000000000000'; //Send 0.5 ETH (reverted)
          await senderEtherspotUser.clearGatewayBatch
          const batch = await senderEtherspotUser
            .batchExecuteAccountTransaction({
              to: receiverEtherspotUser.state.accountAddress, // Destination Ethereum address
              value: ethers.utils.parseEther('0.01')
            })
            .catch(console.error)
          console.log('batch numbner', batch)

          /*

          const erc20Contract: any = senderEtherspotUser.registerContract<
            ERC20Contract
          >('erc20Contract', erc20Abi, erc20Address)

          const transactionRequest = erc20Contract.encodeApprove(recepitent, 1);

          console.log('transaction request', transactionRequest)

          console.log(
            'gateway batch',
            await senderEtherspotUser.batchExecuteAccountTransaction(
              transactionRequest
            )
          )
          */

          const estimationResponse = await senderEtherspotUser
            .estimateGatewayBatch()
            .catch(console.error)

          console.log('Gas estimated at:', estimationResponse)

          const submittedBatch = await senderEtherspotUser.submitGatewayBatch()
          //.catch(console.error);

          const { hash } = submittedBatch

          await sleep(5)

          console.log(
            'submitted batch',
            await senderEtherspotUser.getGatewaySubmittedBatch({
              hash
            })
          )
        }}
      >
        📡 send 1 ETH to receiver!! (test)
      </button>
    </div>
  )
}
