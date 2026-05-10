import { pool } from '../../db/pool'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../../utils/errors'

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )
  if (existing.rows.length > 0) {
    throw new AppError('Email already in use', 409)
  }

  const hash = await bcrypt.hash(password, 12)

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, hash, role]
  )

  return result.rows[0]
}

export async function loginUser(email: string, password: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  const user = result.rows[0]
  if (!user) throw new AppError('Invalid credentials', 401)

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new AppError('Invalid credentials', 401)

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  const { password_hash, ...safeUser } = user
  return { user: safeUser, token }
}

export async function getUserById(id: string) {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at 
     FROM users WHERE id = $1`,
    [id]
  )
  if (!result.rows[0]) throw new AppError('User not found', 404)
  return result.rows[0]
}