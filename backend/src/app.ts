import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorMiddleware } from './middleware/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import maintenanceRoutes from './modules/maintenance/maintenance.routes'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/maintenance', maintenanceRoutes)

app.use(errorMiddleware)

export default app