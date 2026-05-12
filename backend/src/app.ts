import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorMiddleware } from './middleware/error.middleware'
import authRoutes from './modules/auth/auth.routes'
import maintenanceRoutes from './modules/maintenance/maintenance.routes'
import complianceRoutes from './modules/compliance/compliance.routes'
import drillsRoutes from './modules/drills/drills.routes'
import shipsRoutes from './modules/ships/ships.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'

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
app.use('/api/drills', drillsRoutes)
app.use('/api/compliance', complianceRoutes)
app.use('/api/ships', shipsRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorMiddleware)

export default app