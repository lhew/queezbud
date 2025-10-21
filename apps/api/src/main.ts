/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as path from 'path';
import admin from 'firebase-admin';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  User,
  signInWithEmailAndPassword,
  getAuth as clientAuth,
} from 'firebase/auth';
import { firebaseClientConfig } from './app.firebase.config';
import { firebaseConfig } from './service_account';

const app = express();

// Firebase config imports (you'll need to create these)

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
});

const clientFbApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      apiKey: firebaseClientConfig.API_KEY,
      authDomain: firebaseClientConfig.AUTH_DOMAIN,
      projectId: firebaseClientConfig.PROJECT_ID,
      appId: firebaseClientConfig.APP_ID,
    });

const db = getFirestore('queezbud-db');

type AuthRequest = Request & { user?: any & { sub?: string }; token?: string };

function jwtAuthInterceptor(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.path.startsWith('/api')) {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] as string;

    if (!token) return res.status(403).json({ error: 'No token provided' });

    admin
      .auth()
      .verifyIdToken(token)
      .then((firebaseUser: any) => {
        req.user = { ...firebaseUser, sub: firebaseUser.uid } as any;
        req.token = token;
        return next();
      })
      .catch((error: any) => {
        return res
          .status(403)
          .json({ error: 'Invalid token', details: error, token });
      });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: 'Failed to decode token', err });
  }
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwtAuthInterceptor);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

function devMessage(devMessage: any) {
  const isDev = process.env['NODE_ENV'] === 'development';
  if (isDev) {
    return { details: devMessage };
  }
  return {};
}

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.post('/access', async (req: Request, res: Response) => {
  try {
    await signInWithEmailAndPassword(
      clientAuth(clientFbApp),
      req.body.email,
      req.body.password
    )
      .then(async (userCredential) => {
        const user = userCredential.user as unknown as User & {
          sub?: string;
          token?: string;
        };
        const refreshToken = (user as unknown as Record<string, string>)[
          'refreshToken'
        ];

        user.sub = user.uid;

        // Check if custom claims already exist before setting them
        const existingUser = await admin.auth().getUser(user.uid);
        const currentClaims = existingUser.customClaims || {};

        if (!currentClaims['role']?.['server']) {
          await admin.auth().setCustomUserClaims(user.uid, { role: 'server' });
          const refreshedToken = await user.getIdToken(true);
          user.token = refreshedToken;
        }

        res.json({
          user: {
            uid: user.uid,
            email: user.email,
          },
          token: user.token,
          refreshToken,
        });
      })
      .catch((error) => {
        res.status(401).json({ error: 'Authentication failed' });
      });
  } catch (error) {
    throw new Error('Invalid credentials');
  }
});

// Get all quizzes (published ones + user's own)
app.get('/api/quiz', async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('quiz').get();
    const quizzes = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((quiz: any) => {
        // Show published quizzes or user's own quizzes
        return quiz.published === true || quiz.owner === req.user?.sub;
      });

    res.json({ data: quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', ...devMessage(error) });
  }
});

// Get quiz by ID with access control
app.get('/api/quiz/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('quiz').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizData = { id: doc.id, ...doc.data() } as any;
    const published = quizData.published === true;
    const isOwner = quizData.owner === req.user?.sub;


    console.log({isOwner})

    if (!published && !isOwner) {
      return res
        .status(403)
        .json({
          error: 'Forbidden',
          ...devMessage('User does not have permission to access this quiz'),
        });
    }

    res.json(quizData);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create quiz
app.post('/api/quiz', async (req: AuthRequest, res: Response) => {
  try {
    const owner = req.user;
    if (!owner?.sub) {
      return res
        .status(403)
        .json({ error: 'Forbidden: owner required to publish quiz' });
    }

    const payload = {
      ...req.body,
      owner: owner.sub,
      description: '',
      published: false,
    };
    const docRef = await db.collection('quiz').add(payload);
    const newDoc = await docRef.get();

    return res.status(201).json({ id: newDoc.id, ...newDoc.data() });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res
      .status(500)
      .json({ error: 'Internal Server Error', ...devMessage(error) });
  }
});

// Update quiz
app.patch('/api/quiz/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    const docRef = db.collection('quiz').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizData = doc.data();
    if (quizData?.owner !== req.user?.sub) {
      return res
        .status(403)
        .json({
          error: 'Forbidden',
          ...devMessage('User does not have permission to update this quiz'),
        });
    }


    console.log('final payload', payload, { ...doc.data(), ...payload });

    await docRef.update({
      ...doc.data(),
      ...payload,
    });
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' , ...devMessage(error)});
  }
});


app.delete('/api/quiz/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('quiz').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizData = doc.data();
    if (quizData?.owner !== req.user?.sub) {
      return res
        .status(403)
        .json({
          error: 'Forbidden',
          ...devMessage('User does not have permission to delete this quiz'),
        });
    }

    // Delete all questions in the subcollection
    const questionsSnapshot = await docRef.collection('questions').get();
    const deletePromises = questionsSnapshot.docs.map((questionDoc) =>
      questionDoc.ref.delete()
    );
    await Promise.all(deletePromises);

    // Delete the quiz document
    await docRef.delete();

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', ...devMessage(error) });
  }
});

// Get quiz with all questions
app.get('/api/quiz/:id/all', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const quizDoc = await db.collection('quiz').doc(id).get();
    const questionsSnapshot = await quizDoc.ref.collection('questions').get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizData = { id: quizDoc.id, ...quizDoc.data() };

    const questions = questionsSnapshot.empty
      ? []
      : questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

    (quizData as any).questions = questions;
    res.json(quizData);
  } catch (error) {
    console.error('Error fetching quiz with questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create question
app.post('/api/quiz/:id/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.user;

    if (!owner?.sub) {
      return res
        .status(403)
        .json({ error: 'Forbidden: owner required to create question' });
    }

    const payload = { ...req.body };
    const quizDocRef = db.collection('quiz').doc(id);
    const quizDoc = await quizDocRef.get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Add question to the subcollection 'questions' under this quiz
    const docRef = await quizDocRef
      .collection('questions')
      .add({ ...payload, owner: owner.sub });
    const newDoc = await docRef.get();

    res.status(201).json({ id: newDoc.id, owner: owner.sub, ...newDoc.data() });
  } catch (error) {
    console.error('Error creating question:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', ...devMessage(error) });
  }
});

// Get questions for a quiz
app.get('/api/quiz/:id/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    // First, get the quiz document reference
    const quizDocRef = db.collection('quiz').doc(id);
    const quizDoc = await quizDocRef.get();

    if (!quizDoc.exists) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Then, get all documents from the 'questions' subcollection of this quiz
    const questionsSnapshot = await quizDocRef.collection('questions').get();
    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', ...devMessage(error) });
  }
});

// Get single question
app.get(
  '/api/quiz/:id/questions/:questionId',
  async (req: AuthRequest, res: Response) => {
    try {
      const { questionId, id } = req.params;
      // First, get the quiz document reference
      const quizDocRef = db.collection('quiz').doc(id);

      const quizDoc = await quizDocRef.get();

      if (!quizDoc.exists) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Then, get the question from the 'questions' subcollection of this quiz
      const doc = await quizDocRef
        .collection('questions')
        .doc(questionId)
        .get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Update question
app.patch(
  '/api/quiz/:id/questions/:questionId',
  async (req: AuthRequest, res: Response) => {
    try {
      const payload = { ...req.body };
      const { id, questionId } = req.params;

      const quizDocRef = db.collection('quiz').doc(id);
      const quizDoc = await quizDocRef.get();

      if (!quizDoc.exists) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const docRef = quizDocRef.collection('questions').doc(questionId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const questionData = doc.data();

      console.log('questionData', questionData, req.user);
      if (questionData?.owner !== req.user?.sub) {
        return res
          .status(403)
          .json({
            error: 'Forbidden',
            ...devMessage(
              'User does not have permission to update this question'
            ),
          });
      }

      await docRef.update(payload);
      const updatedDoc = await docRef.get();
      res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Delete question
app.delete(
  '/api/quiz/:id/questions/:questionId',
  async (req: AuthRequest, res: Response) => {
    try {
      const { questionId, id } = req.params;

      const quizDocRef = db.collection('quiz').doc(id);
      const quizDoc = await quizDocRef.get();

      if (!quizDoc.exists) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const docRef = quizDocRef.collection('questions').doc(questionId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const questionData = doc.data();
      if (questionData?.owner !== req.user?.sub) {
        return res
          .status(403)
          .json({
            error: 'Forbidden',
            ...devMessage(
              'User does not have permission to delete this question'
            ),
          });
      }

      await docRef.delete();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res
        .status(500)
        .json({ error: 'Internal Server Error', ...devMessage(error) });
    }
  }
);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
