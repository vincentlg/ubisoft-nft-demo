"use client"

import { useMemo } from "react"
import { Address, isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useCurrentViewerAddress } from "@/lib/web3/auth"
import { DataTable } from "@/components/data-table"

import { columns } from "./column"

export type AccountBuyOffersTableProps = {
  offers: BuyOffer[]
}

export function AccountBuyOffersTable({ offers }: AccountBuyOffersTableProps) {
  const viewer = useCurrentViewerAddress()
  
  const data = useMemo(() => {
    return offers
      .sort((a, b) => {
        const dateA = new Date(a.date.valueOf())
        const dateB = new Date(b.date.valueOf())
        if (dateA > dateB) return -1
        if (dateA < dateB) return 1
        return 0
      })
  }, [offers])

  return <DataTable columns={columns} data={data} />
}