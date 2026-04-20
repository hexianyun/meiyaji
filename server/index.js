import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import artistArtworkRoutes from './routes/artist-artworks.routes.js'
import { config } from './config.js'
import { verifyArtist, verifyMember } from './middleware/auth.js'
import { serializeUser } from './utils/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'meiyaji-auth-api',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/artist/artworks', artistArtworkRoutes)

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

app.listen(config.port, () => {
  console.log(`Meiyaji auth server running at http://localhost:${config.port}`)
})
