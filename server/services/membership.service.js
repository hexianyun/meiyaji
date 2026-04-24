import prismaPackage from '@prisma/client'
import { prisma } from '../lib/prisma.js'

const { Prisma } = prismaPackage

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
]

function normalizeAmount(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

function getTierPerks(level) {
  return MEMBERSHIP_TIERS.find((tier) => tier.level === level)?.perks ?? []
}

export function calculateUserTier(totalSpent) {
  const normalizedTotalSpent = Math.max(0, normalizeAmount(totalSpent))

  return MEMBERSHIP_TIERS.reduce((highestLevel, tier) => {
    return normalizedTotalSpent >= tier.threshold ? tier.level : highestLevel
  }, 0)
}

export async function processNewOrder(userId, orderAmount, options = {}) {
  if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
    throw new RangeError('orderAmount must be a positive number')
  }

  const db = options.prismaClient ?? prisma
  const normalizedOrderAmount = normalizeAmount(orderAmount)

  const execute = async (tx) => {
    const user = await tx.user.findUnique({
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

    await tx.user.update({
      where: { id: userId },
      data: {
        total_spent: new Prisma.Decimal(totalSpent),
        current_tier_level: currentTierLevel,
      },
    })

    await tx.transaction.create({
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

  if (options.prismaClient) {
    return execute(db)
  }

  return db.$transaction((tx) => execute(tx))
}
