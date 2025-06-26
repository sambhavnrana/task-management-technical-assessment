import pool from '../utils/db';
import { User } from '../types/models';

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *`,
    [email, password, name]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

export async function findUserById(id: number): Promise<User | null> {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
} 