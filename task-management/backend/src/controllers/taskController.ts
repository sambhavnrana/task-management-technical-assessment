import { Request, Response, NextFunction } from 'express';
import { getTasksByUser, createTask as createTaskModel, updateTask as updateTaskModel, deleteTask as deleteTaskModel } from '../models/task';
import { TaskRequest } from '../types/api';

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const tasks = await getTasksByUser(user.userId);
    res.json(tasks);
  } catch (err) { next(err); }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { title, description, status = 'pending', priority = 'medium' } = req.body as TaskRequest;
    const task = await createTaskModel({ title, description, status, priority, user_id: user.userId });
    res.status(201).json(task);
  } catch (err) { next(err); }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    const updates = req.body;
    const updated = await updateTaskModel(id, user.userId, updates);
    if (!updated) {
      res.status(404).json({ message: 'Task not found or not yours' });
      return;
    }
    res.json(updated);
  } catch (err) { next(err); }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    const deleted = await deleteTaskModel(id, user.userId);
    if (!deleted) {
      res.status(404).json({ message: 'Task not found or not yours' });
      return;
    }
    res.json({ success: true });
  } catch (err) { next(err); }
} 