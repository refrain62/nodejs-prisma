import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
