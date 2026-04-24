import { Prisma, PrismaClient } from '@prisma/client'

export const MEMBERSHIP_TIERS = [
  {
    level: 0,
    name: '普通会员',
    threshold: 0,
    perks: [],
  },
  {
    level: 1,
    name: '新芽伙伴',
    threshold: 3000,
    perks: [
      '新萌芽精美伴手礼一份',
      '公益支持纪念证书',
    ],
  },
  {
    level: 2,
    name: '抽枝使者',
    threshold: 5000,
    perks: [
      '新萌芽精美伴手礼一份',
      '艺术家原创速写作品一幅',
      '公益支持纪念证书',
    ],
  },
  {
    level: 3,
    name: '繁花藏家',
    threshold: 10000,
    perks: [
      '新萌芽精美伴手礼一份',
      '艺术家原创速写作品一幅',
      '艺术家小幅原作一幅',
      '公益支持纪念证书',
    ],
  },
  {
    level: 4,
    name: '硕果共建人',
    threshold: 100000,
    perks: [
      '新萌芽精美伴手礼一份',
      '艺术家原创速写作品一幅',
      '艺术家小幅原作一幅',
      '尊享乡村美育公益项目支持冠名权',
      '在项目成果册、活动现场及官方宣传中专属署名鸣谢',
      '受邀参与线下美育公益活动与艺术交流',
      '公益支持纪念证书',
    ],
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
