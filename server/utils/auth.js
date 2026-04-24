import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from '../config.js'

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      artistStatus: user.artistStatus ?? null,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret)
}

export function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    realName: user.realName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    artistStatus: user.artistStatus,
    bio: user.bio,
    artistIntro: user.artistIntro,
    portfolioUrl: user.portfolioUrl,
    totalSpent: Number(user.total_spent ?? 0),
    currentTierLevel: user.current_tier_level ?? 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
