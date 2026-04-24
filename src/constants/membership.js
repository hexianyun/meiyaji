export const MEMBERSHIP_TIERS = [
  {
    level: 0,
    name: '唤春使者',
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
    name: '润枝使者',
    threshold: 5000,
    perks: [
      '新萌芽精美伴手礼一份',
      '艺术家原创速写作品一幅',
      '公益支持纪念证书',
    ],
  },
  {
    level: 3,
    name: '繁花知音',
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
]

export function calculateMembershipTier(totalSpent = 0) {
  const safeTotalSpent = Number.isFinite(Number(totalSpent)) ? Number(totalSpent) : 0

  return MEMBERSHIP_TIERS.reduce((currentTier, tier) => {
    return safeTotalSpent >= tier.threshold ? tier : currentTier
  }, MEMBERSHIP_TIERS[0])
}

export function getNextMembershipTier(totalSpent = 0) {
  const safeTotalSpent = Number.isFinite(Number(totalSpent)) ? Number(totalSpent) : 0
  return MEMBERSHIP_TIERS.find((tier) => tier.threshold > safeTotalSpent) || null
}

export function getUnlockedPerks(totalSpent = 0) {
  const currentTier = calculateMembershipTier(totalSpent)
  const unlockedTiers = MEMBERSHIP_TIERS.filter((tier) => tier.level > 0 && tier.level <= currentTier.level)
  const seen = new Set()

  return unlockedTiers
    .flatMap((tier) => tier.perks)
    .filter((perk) => {
      if (seen.has(perk)) return false
      seen.add(perk)
      return true
    })
}
