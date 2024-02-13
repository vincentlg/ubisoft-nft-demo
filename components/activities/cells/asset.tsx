import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

import { env } from "@/config/env"

export type AssetCellProps = {
  row: Row<BuyOffer>
}

export const AssetCell = ({ row }: AssetCellProps) => {
  const assetName = row.original.trade.asset?.metadata.name
  const tokenId = row.original.trade.tokenId

  return (
    <Link href={`${env.NEXT_PUBLIC_BASE_PATH}/marketplace/${tokenId}`}>
      <Button variant="ghost" className="gap-x-2 font-medium">
      {`${assetName} #${tokenId}`} <ExternalLink size="16" />
      </Button>
    </Link>
  )
}
