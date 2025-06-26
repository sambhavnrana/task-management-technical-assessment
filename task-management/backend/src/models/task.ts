import pool from '../utils/db';
import { Task } from '../types/models';

export async function getTasksByUser(userId: number): Promise<Task[]> {
  const result = await pool.query(
    `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [task.title, task.description, task.status, task.priority, task.user_id]
  );
  return result.rows[0];
}

export async function updateTask(id: number, userId: number, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Task | null> {
  const fields = Object.keys(updates);
  if (fields.length === 0) return null;
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  const values = fields.map(f => (updates as any)[f]);
  values.push(id, userId);
  const result = await pool.query(
    `UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteTask(id: number, userId: number): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
} 