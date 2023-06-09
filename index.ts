import { PrismaClient, Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient({ rejectOnNotFound: true });

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { Posts: true },
  });
  return res.json(users);
})

app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.json(user);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        console.log('There is a unique constraint violation, a new user cannot be created with this email');
      }
    }
    return res.status(400).json(e);
  }
});

app.put('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(400).json(e);
  }
});


app.delete('/users/:id',async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.json(user);
  } catch (e) {
    return res.status(400).json(e);
  }
});


app.get('/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(400).json(e);
  }
});


app.get('/usersfirst', async (req: Request, res: Response) => {
  const users = await prisma.user.findFirst();
  return res.json(users);
});

app.get('/users_upsert', async (req: Request, res: Response) => {
  const user = await prisma.user.upsert({
    where: { id: 4 },
    create: {
      email: 'alice4@prisma.io',
      name: 'Alice4',
    },
    update: {
      email: 'alice4@prisma.io',
      name: 'Alice4B',
    },
  })
  return res.json(user);
});

// // createMany は SQLiteではサポートされない
// app.get('/users_add_many', async (req: Request, res: Response) => {
//   const users = await prisma.user.createMany({
//     data: [
//       { name: 'Sonali', email: 'sonali@prisma.io' },
//       { name: 'Alex', email: 'alex@prisma.io' },
//     ],
//   });
//   return res.json(users);
// });


app.post('/posts', async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    return res.json(post);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
