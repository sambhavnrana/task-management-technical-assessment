import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { requireFields } from '../middleware/validate';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = Router();

router.get('/', authenticateJWT, getTasks);

router.post('/', authenticateJWT, requireFields(['title']), createTask);

router.put('/:id', authenticateJWT, updateTask);

router.delete('/:id', authenticateJWT, deleteTask);

export default router; 