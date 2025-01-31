"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

interface PaymentPeriod {
  id: string
  startDate: string
  endDate: string
}

interface PaymentPeriodSelectorProps {
  onSelect: (period: PaymentPeriod) => void
}

export function PaymentPeriodSelector({ onSelect }: PaymentPeriodSelectorProps) {
  const [paymentPeriods, setPaymentPeriods] = useState<PaymentPeriod[]>([])
  const [periodSelect, setPeriodSelect] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    getPaymentPeriods()
  }, [])

  const getPaymentPeriods = async () => {
    try {
      const response = await fetch('/api/paymentPeriod', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error)
      } else {
        setPaymentPeriods(data.paymentPeriod);
        const currentPeriod = data.paymentPeriod.find((period: PaymentPeriod) => {
          const start = new Date(period.startDate)
          const end = new Date(period.endDate)
          const now = new Date()
          return now >= start && now <= end
        })
        if (currentPeriod) {
          onSelect(currentPeriod)
          setPeriodSelect(currentPeriod.id)
        }

      }
    } catch (err) {
      console.log("ERROR: ", err);
      setError("Something went wrong")
    }
  }

  const formatPeriodLabel = (period: PaymentPeriod) => {
    const start = new Date(period.startDate).toLocaleDateString()
    const end = new Date(period.endDate).toLocaleDateString()
    return `${start} - ${end}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Period</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => {
          const period:any = paymentPeriods.find(p => p.id === value)
          if (period) {
            onSelect(period)
            setPeriodSelect(period.id)
          }
        }} value={periodSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a payment period" />
          </SelectTrigger>
          <SelectContent>
            {paymentPeriods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {formatPeriodLabel(period)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}