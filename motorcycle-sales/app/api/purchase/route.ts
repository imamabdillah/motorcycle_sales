import { NextResponse } from 'next/server'

const motorcycles = {
  'Vario': { basePrice: 10000000 },
  'Nmax': { basePrice: 15000000 },
  'Satria FU': { basePrice: 20000000 },
}

const installmentRates = {
  '5': 1.3,  // 30% increase
  '10': 1.5, // 50% increase
  '15': 1.8, // 80% increase
}

export async function POST(req: Request) {
  const body = await req.json()
  const { buyerName, purchaseDate, motorcycleType, installmentPeriod } = body

  if (!buyerName || !purchaseDate || !motorcycleType || !installmentPeriod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const purchaseDateTime = new Date(purchaseDate)
  const isWithinPromoHours = purchaseDateTime.getHours() >= 8 && purchaseDateTime.getHours() < 17
  const isWithinPromoDates = purchaseDateTime >= new Date('2024-02-01') && purchaseDateTime <= new Date('2024-02-20')

  const basePrice = motorcycles[motorcycleType as keyof typeof motorcycles].basePrice
  const installmentRate = installmentRates[installmentPeriod as keyof typeof installmentRates]
  
  let totalPrice = basePrice * installmentRate
  const monthlyInstallment = totalPrice / parseInt(installmentPeriod)

  if (isWithinPromoHours && isWithinPromoDates) {
    // Apply 50% discount on last two months
    totalPrice -= monthlyInstallment
  }

  // In a real application, you would save this data to a database here
  console.log('Purchase saved:', { buyerName, purchaseDate, motorcycleType, installmentPeriod, totalPrice })

  return NextResponse.json({ message: 'Purchase saved successfully', totalPrice })
}

