import { MEMBERSHIP_TIERS, calculateMembershipTier, getNextMembershipTier, getUnlockedPerks } from '../constants/membership'

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export default function MembershipBenefitsCard({ total_spent = 0 }) {
  const totalSpent = Number.isFinite(Number(total_spent)) ? Number(total_spent) : 0
  const currentTier = calculateMembershipTier(totalSpent)
  const nextTier = getNextMembershipTier(totalSpent)
  const unlockedPerks = getUnlockedPerks(totalSpent)
  const remainingAmount = nextTier ? Math.max(0, nextTier.threshold - totalSpent) : 0

  return (
    <div
      className="mx-4 mt-5 p-6"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,243,237,0.96) 100%)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--accent)' }}>
            Membership
          </p>
          <h2 className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>
            当前等级 {currentTier.name}
          </h2>
        </div>
        <div
          className="px-3 py-1.5 text-[11px] font-bold rounded-full"
          style={{ color: 'white', background: 'var(--accent)', boxShadow: '0 6px 16px rgba(176,147,122,0.25)' }}
        >
          LV {currentTier.level}
        </div>
      </div>

      <div
        className="p-4 mb-5"
        style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(176,147,122,0.16)' }}
      >
        <p className="text-[12px] font-medium mb-1" style={{ color: 'var(--text-weak)' }}>
          累计消费金额
        </p>
        <p className="text-[28px] leading-none font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          ¥{formatCurrency(totalSpent)}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-[13px] font-bold mb-3" style={{ color: 'var(--text)' }}>
          当前已解锁权益
        </p>
        {unlockedPerks.length > 0 ? (
          <div className="space-y-2">
            {unlockedPerks.map((perk) => (
              <div
                key={perk}
                className="flex items-start gap-2.5 text-[13px] leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            当前尚未解锁专属礼遇，累计消费满 ¥{MEMBERSHIP_TIERS[1].threshold.toLocaleString('zh-CN')} 即可升级为 {MEMBERSHIP_TIERS[1].name}。
          </p>
        )}
      </div>

      <div
        className="px-4 py-3"
        style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
      >
        <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text)' }}>
          {nextTier
            ? `距离解锁下一等级 ${nextTier.name} 还需消费 ${formatCurrency(remainingAmount)} 元`
            : '您已是最高等级的公益共建人'}
        </p>
      </div>
    </div>
  )
}
