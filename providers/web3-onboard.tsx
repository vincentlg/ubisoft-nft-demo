"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { manifest } from "@/manifests"
import {
  ConnectAdaptor,
  ConnectOnboardConnector,
  SupportedNetworks,
} from "@cometh/connect-sdk"

import "@web3-onboard/common"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import Onboard, { OnboardAPI } from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"

import { env } from "@/config/env"
import networks from "@/config/networks"
import { COMETH_CONNECT_STORAGE_LABEL } from "@/config/site"

const web3OnboardNetworks = Object.values(networks).map((network) => {
  return {
    id: network.hexaId,
    token: network.nativeToken.symbol,
    label: network.name,
  }
})

export interface SetOnboardOptions {
  isComethWallet: boolean
  walletAddress?: string
}

const Web3OnboardContext = createContext<{
  onboard: OnboardAPI | null
  initOnboard: (options: SetOnboardOptions) => void
  isConnected: boolean
  setIsconnected: Dispatch<SetStateAction<boolean>>
  reconnecting: boolean
}>({
  onboard: null,
  initOnboard: () => {},
  isConnected: false,
  setIsconnected: () => {},
  reconnecting: false,
})

export function useWeb3OnboardContext() {
  return useContext(Web3OnboardContext)
}

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

export function Web3OnboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [onboard, setOnboard] = useState<OnboardAPI | null>(null)
  const [isConnected, setIsconnected] = useState<boolean>(false)
  const [reconnecting, setReconnecting] = useState<boolean>(false)
  const { comethWalletAddressInStorage } = useStorageWallet()

  const initOnboard = useCallback((options: SetOnboardOptions) => {
    const wallets = [injectedModule()]
    if (options.isComethWallet) {
      // TODO: Remove hack once connect is fixed and removed the spread
      // const uiConfig = {
      //   uiConfig: {
      //     displayValidationModal: false,
      //   },
      // } as any

      // const connectAdaptor = new ConnectAdaptor({
      //   chainId: numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks,
      //   apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      // })
      // let addressToUse = options.walletAddress


      // const connectConnector = ConnectOnboardConnector({
      //   apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      //   authAdapter: connectAdaptor,
      //   ...(addressToUse && {
      //     walletAddress: addressToUse,
      //   }),
      //   uiConfig: uiConfig,
      // })

      // wallets.push(connectConnector)
    }

    const web3OnboardInstance = Onboard({
      wallets,
      chains: web3OnboardNetworks,
      appMetadata: {
        name: manifest.collectionName,
        description: "Description",
        icon: `${env.NEXT_PUBLIC_BASE_PATH}/marketplace.png`,
        logo: `${env.NEXT_PUBLIC_BASE_PATH}/metamask.svg`,
        recommendedInjectedWallets: [
          { name: "MetaMask", url: "https://metamask.io" },
        ],
      },
      theme: manifest.web3Onboard?.theme,
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        },
      },
    })

    setOnboard(web3OnboardInstance)
  }, [])

  useEffect(() => {
    initOnboard({ isComethWallet: false })
  }, [])

  useEffect(() => {
    const currentWalletInStorage = localStorage.getItem("selectedWallet")
    const isComethWallet =
      currentWalletInStorage === COMETH_CONNECT_STORAGE_LABEL
    if (isComethWallet) {
      initOnboard({
        isComethWallet,
        walletAddress: comethWalletAddressInStorage!,
      })
    }

    const startReconnecting = async () => {
      if (currentWalletInStorage) {
        setReconnecting(true)
        try {
          const connectionResult = await onboard?.connectWallet({
            autoSelect: {
              label: currentWalletInStorage,
              disableModals: true,
            },
          })
          if (connectionResult?.length) {
            setIsconnected(true)
            setReconnecting(false)
          }
        } catch (error) {
          console.error("Error reconnecting wallet", error)
          setReconnecting(false)
        }
      }
    }
    startReconnecting()
  }, [initOnboard, onboard, comethWalletAddressInStorage])

  return (
    <Web3OnboardContext.Provider
      value={{
        onboard,
        initOnboard,
        isConnected,
        setIsconnected,
        reconnecting,
      }}
    >
      {children}
    </Web3OnboardContext.Provider>
  )
}
