import { Prisma, PrismaClient } from '@prisma/client'

export const MEMBERSHIP_TIERS = [
  {
    level: 0,
    threshold: 0,
    perks: ['Browse and purchase artworks', 'Apply to become an artist'],
  },
  {
    level: 1,
    threshold: 3000,
    perks: ['Digital membership certificate', 'Priority nonprofit updates'],
  },
  {
    level: 2,
    threshold: 5000,
    perks: ['Tier 2 digital certificate', 'Priority event registration', 'Dedicated nonprofit notifications'],
  },
  {
    level: 3,
    threshold: 10000,
    perks: ['Tier 3 digital certificate', 'Meiyaji gift package', 'Priority charity auction access'],
  },
  {
    level: 4,
    threshold: 100000,
    perks: ['Tier 4 honor certificate', 'Annual nonprofit commemorative gift', 'Priority invitation and dedicated acknowledgment'],
  },
] as const

type MembershipPrismaClient = PrismaClient | Prisma.TransactionClient

export interface ProcessNewOrderOptions {
  orderId?: string
  note?: string
  prismaClient?: MembershipPrismaClient
}

export interface ProcessNewOrderResult {
  totalSpent: number
  previousTierLevel: number
  currentTierLevel: number
  upgraded: boolean
  perks: string[]
}

function normalizeAmount(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

function getTierPerks(level: number): string[] {
  const tier = MEMBERSHIP_TIERS.find((item) => item.level === level)
  return tier ? [...tier.perks] : []
}

export function calculateUserTier(totalSpent: number): number {
  const normalizedTotalSpent = Math.max(0, normalizeAmount(totalSpent))

  return MEMBERSHIP_TIERS.reduce((highestLevel, tier) => {
    return normalizedTotalSpent >= tier.threshold ? tier.level : highestLevel
  }, 0)
}

export async function processNewOrder(
  userId: string,
  orderAmount: number,
  options: ProcessNewOrderOptions = {},
): Promise<ProcessNewOrderResult> {
  if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
    throw new RangeError('orderAmount must be a positive number')
  }

  const db = options.prismaClient

  if (!db) {
    throw new Error('A Prisma client is required to process a new order in TypeScript service usage.')
  }

  const normalizedOrderAmount = normalizeAmount(orderAmount)
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      total_spent: true,
      current_tier_level: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const previousTierLevel = user.current_tier_level ?? 0
  const totalSpent = normalizeAmount(Number(user.total_spent ?? 0) + normalizedOrderAmount)
  const currentTierLevel = calculateUserTier(totalSpent)
  const upgraded = currentTierLevel > previousTierLevel
  const perks = upgraded ? getTierPerks(currentTierLevel) : []

  await db.user.update({
    where: { id: userId },
    data: {
      total_spent: new Prisma.Decimal(totalSpent),
      current_tier_level: currentTierLevel,
    },
  })

  await db.transaction.create({
    data: {
      userId,
      orderId: options.orderId ?? null,
      type: 'order_payment',
      amount: new Prisma.Decimal(normalizedOrderAmount),
      total_spent_snapshot: new Prisma.Decimal(totalSpent),
      tier_level_snapshot: currentTierLevel,
      perks,
      note: options.note ?? null,
    },
  })

  return {
    totalSpent,
    previousTierLevel,
    currentTierLevel,
    upgraded,
    perks,
  }
}
