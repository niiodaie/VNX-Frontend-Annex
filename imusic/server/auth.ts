import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "darknotes-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id as number);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // After user creation, create their journey steps
      const journeySteps = await storage.getJourneySteps();
      for (const step of journeySteps) {
        // Set the first step as in-progress, others as locked
        const status = step.order === 1 ? "in-progress" : "locked";
        
        // This would be here but we're not implementing it in this MVP
        // await storage.createUserJourneyStep({
        //   userId: user.id,
        //   stepId: step.id,
        //   status,
        //   progress: 0
        // });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  
  // Password reset endpoints
  app.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // For security, don't reveal whether the email exists
        return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
      }
      
      // Generate a reset token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
      
      // Save the token and expiry to the user's record
      await storage.updateUserResetToken(user.id, token, expiresAt);
      
      // In a real implementation, you would send an email with a link containing the token
      // For this demo, we're just returning the token in the response
      // The client would receive an email with a link like: example.com/reset-password?token={token}
      
      console.log(`Password reset token for ${email}: ${token}`);
      
      res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      
      const user = await storage.getUserByResetToken(token);
      if (!user || !user.resetTokenExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      
      // Check if token is expired
      const now = new Date();
      const tokenExpiry = new Date(user.resetTokenExpiresAt);
      if (now > tokenExpiry) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(password);
      
      // Update user's password and remove reset token
      await storage.updateUserResetToken(user.id, null, null);
      await storage.updateUserPassword(user.id, hashedPassword);
      
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
      next(err);
    }
  });
}
