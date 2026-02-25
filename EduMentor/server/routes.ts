import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { initializeSubjects, initializeCourses, initializeLessons, initializeInstructors } from "./subjects";
import { generateHomeworkQuestions, generateQuizQuestions } from "./openai";

// Keep track of connected clients for real-time interaction
const clients = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Set up WebSocket server for real-time classroom interaction
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Initialize sample data for the application
  await initializeData();

  wss.on('connection', (ws, req) => {
    const clientId = Math.random().toString(36).substring(2, 15);
    clients.set(clientId, ws);

    // Track active classrooms for instructor responses
    const classroomSessions = new Map<string, { userId: number, courseId: number, lessonId: number }>();

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'classroom-join') {
          classroomSessions.set(clientId, {
            userId: data.userId,
            courseId: data.courseId,
            lessonId: data.lessonId
          });
          
          // Send classroom data to client
          const user = await storage.getUser(data.userId);
          const course = await storage.getCourse(data.courseId);
          const lesson = await storage.getLesson(data.lessonId);
          
          ws.send(JSON.stringify({
            type: 'classroom-data',
            data: { user, course, lesson }
          }));
        }
        
        if (data.type === 'ask-question') {
          const session = classroomSessions.get(clientId);
          if (!session) {
            ws.send(JSON.stringify({
              type: 'error',
              error: 'No active classroom session'
            }));
            return;
          }
          
          // Process AI response to question here
          setTimeout(() => {
            ws.send(JSON.stringify({
              type: 'instructor-response',
              data: {
                question: data.question,
                answer: `This is a response to your question: "${data.question}"`,
                instructorId: data.instructorId
              }
            }));
          }, 1500); // Simulated delay for AI processing
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      classroomSessions.delete(clientId);
    });
  });

  // API routes for the application
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { username, password, displayName, email } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const user = await storage.createUser({
        username,
        password, // In a real app, this would be hashed
        displayName,
        email,
        language: 'en'
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        language: user.language
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        language: user.language
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Subject routes
  app.get('/api/subjects', async (req: Request, res: Response) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Failed to fetch subjects' });
    }
  });

  // Course routes
  app.get('/api/courses', async (req: Request, res: Response) => {
    try {
      const { subjectId } = req.query;
      let courses;
      
      if (subjectId) {
        courses = await storage.getCoursesBySubject(Number(subjectId));
      } else {
        courses = await storage.getAllCourses();
      }
      
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourse(Number(req.params.id));
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const lessons = await storage.getLessonsByCourse(course.id);
      res.json({ ...course, lessons });
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Failed to fetch course' });
    }
  });

  // User progress routes
  app.get('/api/user/:userId/progress', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const coursesWithProgress = await storage.getUserCoursesWithProgress(userId);
      res.json(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ message: 'Failed to fetch user progress' });
    }
  });

  app.post('/api/user/:userId/progress', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const { courseId, lastLessonId, percentComplete } = req.body;
      
      const progress = await storage.updateUserProgress(userId, courseId, {
        lastLessonId,
        percentComplete
      });
      
      // Create activity feed entry for progress update
      await storage.createActivityFeedEntry({
        userId,
        activityType: 'progress_update',
        resourceId: courseId,
        resourceType: 'course',
        details: { percentComplete }
      });
      
      res.json(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Failed to update progress' });
    }
  });

  // Instructor routes
  app.get('/api/instructors', async (req: Request, res: Response) => {
    try {
      const instructors = await storage.getAllInstructors();
      res.json(instructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      res.status(500).json({ message: 'Failed to fetch instructors' });
    }
  });

  app.get('/api/user/:userId/instructors', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const instructors = await storage.getUserInstructors(userId);
      res.json(instructors);
    } catch (error) {
      console.error('Error fetching user instructors:', error);
      res.status(500).json({ message: 'Failed to fetch user instructors' });
    }
  });

  app.post('/api/user/:userId/instructors', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const { instructorId, isCustomized, customSettings } = req.body;
      
      const userInstructor = await storage.saveUserInstructor({
        userId,
        instructorId,
        isCustomized,
        customSettings
      });
      
      res.json(userInstructor);
    } catch (error) {
      console.error('Error saving user instructor:', error);
      res.status(500).json({ message: 'Failed to save user instructor' });
    }
  });

  // Quiz/Homework generation routes
  app.post('/api/lessons/:lessonId/homework', async (req: Request, res: Response) => {
    try {
      const lessonId = Number(req.params.lessonId);
      const { count = 5, language = 'en' } = req.body;
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      
      const course = await storage.getCourse(lesson.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const subject = await storage.getSubject(course.subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      
      // Generate homework questions using OpenAI
      const questions = await generateHomeworkQuestions(
        subject.name, 
        course.name, 
        lesson.title, 
        count, 
        language
      );
      
      res.json({ questions });
    } catch (error) {
      console.error('Error generating homework:', error);
      res.status(500).json({ message: 'Failed to generate homework' });
    }
  });

  app.post('/api/lessons/:lessonId/quiz', async (req: Request, res: Response) => {
    try {
      const lessonId = Number(req.params.lessonId);
      const { count = 5, language = 'en' } = req.body;
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      
      const course = await storage.getCourse(lesson.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      const subject = await storage.getSubject(course.subjectId);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      
      // Generate quiz questions using OpenAI
      const questions = await generateQuizQuestions(
        subject.name, 
        course.name, 
        lesson.title, 
        count, 
        language
      );
      
      res.json({ questions });
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.status(500).json({ message: 'Failed to generate quiz' });
    }
  });

  // Activity feed routes
  app.get('/api/user/:userId/activity', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      
      const activities = await storage.getUserActivityFeed(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      res.status(500).json({ message: 'Failed to fetch activity feed' });
    }
  });

  return httpServer;
}

// Initialize sample data for the application
async function initializeData() {
  const subjects = await storage.getAllSubjects();
  if (subjects.length === 0) {
    await initializeSubjects(storage);
    await initializeCourses(storage);
    await initializeLessons(storage);
    await initializeInstructors(storage);

    // Create a demo user
    const demoUser = await storage.createUser({
      username: 'demo',
      password: 'password',
      displayName: 'Alex Demo',
      email: 'demo@example.com',
      language: 'en'
    });

    // Set up some initial progress
    await storage.updateUserProgress(demoUser.id, 1, {
      lastLessonId: 2,
      percentComplete: 78
    });
    
    await storage.updateUserProgress(demoUser.id, 2, {
      lastLessonId: 5,
      percentComplete: 45
    });
    
    await storage.updateUserProgress(demoUser.id, 3, {
      lastLessonId: 8,
      percentComplete: 62
    });

    // Create sample activity feed entries
    await storage.createActivityFeedEntry({
      userId: demoUser.id,
      activityType: 'quiz_completed',
      resourceId: 1,
      resourceType: 'lesson',
      details: { score: 92, total: 100 }
    });
    
    await storage.createActivityFeedEntry({
      userId: demoUser.id,
      activityType: 'lesson_watched',
      resourceId: 6,
      resourceType: 'lesson',
      details: { duration: 25 }
    });
    
    await storage.createActivityFeedEntry({
      userId: demoUser.id,
      activityType: 'homework_submitted',
      resourceId: 3,
      resourceType: 'lesson',
      details: { name: 'Practice Essay #3' }
    });
  }
}
