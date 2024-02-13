import { useMutation } from "@tanstack/react-query"
import { UserFacingERC721AssetDataSerializedV4 } from "@traderxyz/nft-swap-sdk"

import globalConfig from "@/config/globalConfig"

import { useCurrentViewerAddress } from "../../lib/web3/auth"
import { useNFTSwapv4 } from "../../lib/web3/nft-swap-sdk"

export type UseApproveCollectionParams = {
  tokenId: string | number
  onSuccess?: () => void
}

export const useApproveCollection = ({
  tokenId,
  onSuccess,
}: UseApproveCollectionParams) => {
  const nftSwapSdk = useNFTSwapv4()
  const address = useCurrentViewerAddress()

  return useMutation({
    mutationFn: async () => {
      if (!nftSwapSdk || !address) throw new Error("SDK not initialized")
      const item: UserFacingERC721AssetDataSerializedV4 = {
        tokenAddress: globalConfig.contractAddress,
        tokenId: tokenId.toString(),
        type: "ERC721",
      }
      return nftSwapSdk.approveTokenOrNftByAsset(item, address)
    },

    onSuccess,
  })
}
