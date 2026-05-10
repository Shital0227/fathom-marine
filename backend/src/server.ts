import 'dotenv/config'
import app from './app'
import { pool } from './db/pool'

const PORT = process.env.PORT || 5000

async function start() {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ Database connected')

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

    // graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully')
      server.close(async () => {
        await pool.end()
        console.log('✅ DB pool closed')
        process.exit(0)
      })
    })

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason)
    })

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err)
      server.close(async () => {
        await pool.end()
        process.exit(1)
      })
    })

  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

start()