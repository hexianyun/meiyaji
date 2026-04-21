import { prisma } from './lib/prisma.js'
import { hashPassword } from './utils/auth.js'
import { charityActivities, charityArticleDetails, charityProjectDetails } from '../src/data.js'

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'content'
}

function buildSeedContents() {
  const activityContents = charityActivities.map((activity) => {
    const article = charityArticleDetails[activity.id]

    return {
      legacyId: activity.id,
      kind: 'activity',
      slug: `activity-${activity.id}-${slugify(activity.title)}`,
      title: article?.title || activity.title,
      cover: article?.cover || activity.cover,
      dateLabel: article?.date || activity.date,
      author: article?.author || '美芽集公益项目组',
      location: article?.location || activity.location,
      tag: article?.tag || activity.tag,
      summary: activity.desc || article?.sections?.[0] || '',
      sections: article?.sections || [],
      images: article?.images || [],
      published: true,
    }
  })

  const projectContents = Object.entries(charityProjectDetails).map(([rawLegacyId, article]) => {
    const legacyId = Number(rawLegacyId)

    return {
      legacyId,
      kind: 'project',
      slug: `project-${legacyId}-${slugify(article.title)}`,
      title: article.title,
      cover: article.cover,
      dateLabel: article.date,
      author: article.author,
      location: article.location,
      tag: article.tag,
      summary: article.sections?.[0] || '',
      sections: article.sections || [],
      images: article.images || [],
      published: true,
    }
  })

  return [...activityContents, ...projectContents]
}

async function ensureAdminUser() {
  const adminPasswordHash = await hashPassword('admin')
  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { username: 'admin' },
        { email: 'admin@meiyaji.local' },
      ],
    },
  })

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        username: 'admin',
        email: existingAdmin.email || 'admin@meiyaji.local',
        passwordHash: adminPasswordHash,
        role: 'admin',
        isActive: true,
      },
    })

    return
  }

  await prisma.user.create({
    data: {
      email: 'admin@meiyaji.local',
      username: 'admin',
      realName: '平台管理员',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
    },
  })
}

async function ensureCharityContents() {
  const contents = buildSeedContents()

  for (const content of contents) {
    await prisma.charityContent.upsert({
      where: {
        kind_legacyId: {
          kind: content.kind,
          legacyId: content.legacyId,
        },
      },
      update: {
        title: content.title,
        cover: content.cover,
        dateLabel: content.dateLabel,
        author: content.author,
        location: content.location,
        tag: content.tag,
        summary: content.summary,
        sections: content.sections,
        images: content.images,
        published: true,
      },
      create: content,
    })
  }
}

export async function ensurePlatformBootstrap() {
  await ensureAdminUser()
  await ensureCharityContents()
}
