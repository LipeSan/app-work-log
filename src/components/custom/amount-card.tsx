import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AmountCardProps {
  title: string
  amount: string
}

export function AmountCard({ title, amount }: AmountCardProps) {
  return (
    <Card className="mt-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
      </CardContent>
    </Card>
  )
}