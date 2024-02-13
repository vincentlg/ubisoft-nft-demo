import { Row } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"
import { UserButton } from "@/components/ui/user-button"

export type EmitterCellProps = { row: Row<BuyOffer> }

export const EmitterCell = ({ row }: EmitterCellProps) => {
  return <UserButton user={row.original.emitter} />
}
