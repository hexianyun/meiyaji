import cors from 'cors'
import express from 'express'
import { ensurePlatformBootstrap } from './bootstrap.js'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import artistArtworkRoutes from './routes/artist-artworks.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import publicRoutes from './routes/public.routes.js'
import { verifyArtist, verifyMember } from './middleware/auth.js'
import { serializeUser } from './utils/auth.js'

const app = express()

await ensurePlatformBootstrap()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'meiyaji-auth-api',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/artist/artworks', artistArtworkRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/member/me', verifyMember, (req, res) => {
  res.json({
    message: '会员权限校验通过。',
    user: serializeUser(req.user),
  })
})

app.get('/api/artist/dashboard', verifyArtist, (req, res) => {
  res.json({
    message: '艺术家权限校验通过。',
    user: serializeUser(req.user),
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: `未找到接口：${req.method} ${req.originalUrl}`,
  })
})

export default app
