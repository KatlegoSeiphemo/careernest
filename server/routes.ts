import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, type InsertUser, type LoginUser } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { careerPathwayService, type UserInterests } from "./services/careerPathwayService";
import { chatbotService } from "./services/chatbotService";
import { aiServicesService } from "./services/aiServicesService";
import { mentorPaymentService } from "./services/mentorPaymentService";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: "Registration successful", user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: "Login successful", user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await storage.getUser(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({ user: { id: user.id, email: user.email, name: user.name, surname: user.surname } });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Middleware to authenticate user
  const authenticateUser = async (req: any, res: any, next: any) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await storage.getUser(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

  // Career pathway validation schemas
  const userInterestsSchema = z.object({
    interests: z.array(z.string()).min(1, "At least one interest is required"),
    passions: z.array(z.string()).min(1, "At least one passion is required"),
    skills: z.array(z.string()).optional(),
    experience: z.array(z.string()).optional(),
    preferredIndustries: z.array(z.string()).optional(),
    workEnvironmentPreferences: z.object({
      remote: z.boolean(),
      office: z.boolean(),
      hybrid: z.boolean(),
      teamSize: z.enum(['small', 'medium', 'large']),
      pace: z.enum(['fast', 'moderate', 'relaxed']),
    }).optional(),
    salaryExpectations: z.string().optional(),
    locationPreferences: z.array(z.string()).optional(),
  });

  // Generate career pathways based on interests and passions
  app.post("/api/career/generate-pathways", authenticateUser, async (req, res) => {
    try {
      const userInterests = userInterestsSchema.parse(req.body);

      // Save user interests
      await careerPathwayService.saveUserInterests(req.user.id, userInterests);

      // Generate personalized pathways
      const pathways = careerPathwayService.generateCareerPathways(userInterests);

      res.json({
        message: "Career pathways generated successfully",
        pathways,
        count: pathways.length
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Generate pathways error:", error);
      res.status(500).json({ message: "Failed to generate career pathways" });
    }
  });

  // Save a selected career pathway
  app.post("/api/career/save-pathway", authenticateUser, async (req, res) => {
    try {
      const { pathway } = req.body;

      if (!pathway) {
        return res.status(400).json({ message: "Pathway data is required" });
      }

      const pathwayId = await careerPathwayService.saveCareerPathway(req.user.id, pathway);

      res.json({
        message: "Career pathway saved successfully",
        pathwayId
      });
    } catch (error) {
      console.error("Save pathway error:", error);
      res.status(500).json({ message: "Failed to save career pathway" });
    }
  });

  // Get user's saved pathways
  app.get("/api/career/my-pathways", authenticateUser, async (req, res) => {
    try {
      const pathways = await careerPathwayService.getUserPathways(req.user.id);

      res.json({ pathways });
    } catch (error) {
      console.error("Get pathways error:", error);
      res.status(500).json({ message: "Failed to retrieve pathways" });
    }
  });

  // Get pathway steps
  app.get("/api/career/pathway/:pathwayId/steps", authenticateUser, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.pathwayId);

      if (isNaN(pathwayId)) {
        return res.status(400).json({ message: "Invalid pathway ID" });
      }

      const steps = await careerPathwayService.getPathwaySteps(pathwayId);

      res.json({ steps });
    } catch (error) {
      console.error("Get pathway steps error:", error);
      res.status(500).json({ message: "Failed to retrieve pathway steps" });
    }
  });

  // Update step completion status
  app.put("/api/career/pathway/:pathwayId/step/:stepId/complete", authenticateUser, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.pathwayId);
      const stepId = parseInt(req.params.stepId);

      if (isNaN(pathwayId) || isNaN(stepId)) {
        return res.status(400).json({ message: "Invalid pathway or step ID" });
      }

      // TODO: Implement step completion logic
      // This would update the step completion status and calculate overall progress

      res.json({ message: "Step marked as complete" });
    } catch (error) {
      console.error("Complete step error:", error);
      res.status(500).json({ message: "Failed to complete step" });
    }
  });

  // Chatbot API endpoints
  const chatMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
    type: z.enum(['text', 'quick_reply']).optional().default('text'),
    payload: z.string().optional(),
  });

  // Send message to chatbot
  app.post("/api/chatbot/message", async (req, res) => {
    try {
      const { message, type, payload } = chatMessageSchema.parse(req.body);

      let response;
      if (type === 'quick_reply' && payload) {
        response = chatbotService.handleQuickReply(payload);
      } else {
        response = chatbotService.generateResponse(message);
      }

      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Chatbot error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Get popular questions
  app.get("/api/chatbot/popular-questions", async (req, res) => {
    try {
      const response = chatbotService.getPopularQuestions();
      res.json({
        success: true,
        response,
      });
    } catch (error) {
      console.error("Popular questions error:", error);
      res.status(500).json({ message: "Failed to get popular questions" });
    }
  });

  // AI Services API endpoints
  const purchaseServiceSchema = z.object({
    serviceId: z.number().min(1),
    phoneNumber: z.string().min(10, "Valid phone number required"),
  });

  const cvGenerationSchema = z.object({
    personalInfo: z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10),
      location: z.string().min(1),
      professionalTitle: z.string().min(1),
      summary: z.string().min(10),
    }),
    experience: z.array(z.object({
      company: z.string().min(1),
      position: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      current: z.boolean(),
      description: z.string().min(10),
    })),
    education: z.array(z.object({
      institution: z.string().min(1),
      degree: z.string().min(1),
      field: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      grade: z.string().optional(),
    })),
    skills: z.array(z.string()),
    languages: z.array(z.object({
      language: z.string(),
      proficiency: z.string(),
    })),
    template: z.string().min(1),
  });

  const coverLetterSchema = z.object({
    personalInfo: z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10),
    }),
    jobDetails: z.object({
      jobTitle: z.string().min(1),
      companyName: z.string().min(1),
      jobDescription: z.string().min(10),
    }),
    userBackground: z.object({
      relevantExperience: z.string().min(10),
      keySkills: z.array(z.string()),
      motivation: z.string().min(10),
    }),
  });

  const jobSearchSchema = z.object({
    keywords: z.array(z.string()).optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    jobType: z.string().optional(),
    salaryMin: z.number().optional(),
    experienceLevel: z.string().optional(),
    limit: z.number().max(50).optional(),
  });

  // Get available AI services
  app.get("/api/ai-services", async (req, res) => {
    try {
      const services = await aiServicesService.getAvailableServices();
      res.json({ success: true, services });
    } catch (error) {
      console.error("Get AI services error:", error);
      res.status(500).json({ message: "Failed to get AI services" });
    }
  });

  // Purchase AI service
  app.post("/api/ai-services/purchase", authenticateUser, async (req, res) => {
    try {
      const { serviceId, phoneNumber } = purchaseServiceSchema.parse(req.body);
      const userId = req.user!.id;

      const result = await aiServicesService.purchaseService({
        serviceId,
        userId,
        phoneNumber
      });

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Purchase service error:", error);
      res.status(500).json({ message: "Failed to purchase service" });
    }
  });

  // Verify payment
  app.post("/api/ai-services/verify-payment/:transactionId", authenticateUser, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const result = await aiServicesService.verifyPayment(transactionId);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // Generate CV
  app.post("/api/ai-services/generate-cv", authenticateUser, async (req, res) => {
    try {
      const cvData = cvGenerationSchema.parse(req.body);
      const userId = req.user!.id;

      const result = await aiServicesService.generateCv(userId, cvData);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Generate CV error:", error);
      res.status(500).json({ message: "Failed to generate CV" });
    }
  });

  // Generate cover letter
  app.post("/api/ai-services/generate-cover-letter", authenticateUser, async (req, res) => {
    try {
      const letterData = coverLetterSchema.parse(req.body);
      const userId = req.user!.id;

      const result = await aiServicesService.generateCoverLetter(userId, letterData);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Generate cover letter error:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  // Search jobs
  app.post("/api/ai-services/search-jobs", async (req, res) => {
    try {
      const searchParams = jobSearchSchema.parse(req.body);
      const result = await aiServicesService.searchJobs(searchParams);
      res.json(result);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Search jobs error:", error);
      res.status(500).json({ message: "Failed to search jobs" });
    }
  });

  // Subscribe to job alerts
  app.post("/api/ai-services/job-alerts", authenticateUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const result = await aiServicesService.subscribeToJobAlerts(userId, req.body);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Subscribe to job alerts error:", error);
      res.status(500).json({ message: "Failed to subscribe to job alerts" });
    }
  });

  // Get user's AI services
  app.get("/api/ai-services/my-services", authenticateUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const services = await aiServicesService.getUserServices(userId);
      res.json({ success: true, services });
    } catch (error) {
      console.error("Get user services error:", error);
      res.status(500).json({ message: "Failed to get user services" });
    }
  });

  // Get user's generated CVs
  app.get("/api/ai-services/my-cvs", authenticateUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const cvs = await aiServicesService.getUserCvs(userId);
      res.json({ success: true, cvs });
    } catch (error) {
      console.error("Get user CVs error:", error);
      res.status(500).json({ message: "Failed to get user CVs" });
    }
  });

  // Get user's generated cover letters
  app.get("/api/ai-services/my-cover-letters", authenticateUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const coverLetters = await aiServicesService.getUserCoverLetters(userId);
      res.json({ success: true, coverLetters });
    } catch (error) {
      console.error("Get user cover letters error:", error);
      res.status(500).json({ message: "Failed to get user cover letters" });
    }
  });

  // Mentor Payment Routes
  app.get("/api/mentor/sessions", requireAuth, async (req, res) => {
    try {
      const mentorId = req.user!.id;
      const sessions = await mentorPaymentService.getMentorSessions(mentorId);
      res.json(sessions);
    } catch (error) {
      console.error("Get mentor sessions error:", error);
      res.status(500).json({ message: "Failed to get mentor sessions" });
    }
  });

  app.get("/api/mentor/payment-requests", requireAuth, async (req, res) => {
    try {
      const mentorId = req.user!.id;
      const requests = await mentorPaymentService.getPaymentRequests(mentorId);
      res.json(requests);
    } catch (error) {
      console.error("Get payment requests error:", error);
      res.status(500).json({ message: "Failed to get payment requests" });
    }
  });

  app.get("/api/mentor/earnings", requireAuth, async (req, res) => {
    try {
      const mentorId = req.user!.id;
      const earnings = await mentorPaymentService.getEarningsStats(mentorId);
      res.json(earnings);
    } catch (error) {
      console.error("Get earnings stats error:", error);
      res.status(500).json({ message: "Failed to get earnings stats" });
    }
  });

  app.post("/api/mentor/create-payment-request", requireAuth, async (req, res) => {
    try {
      const mentorId = req.user!.id;
      const { clientPhone, amount, description } = req.body;

      if (!clientPhone || !amount || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await mentorPaymentService.createPaymentRequest(
        mentorId,
        clientPhone,
        parseFloat(amount),
        description
      );

      res.json(result);
    } catch (error) {
      console.error("Create payment request error:", error);
      res.status(500).json({ message: "Failed to create payment request" });
    }
  });

  app.post("/api/mentor/request-session-payment/:sessionId", requireAuth, async (req, res) => {
    try {
      const mentorId = req.user!.id;
      const sessionId = parseInt(req.params.sessionId);

      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const result = await mentorPaymentService.requestSessionPayment(mentorId, sessionId);
      res.json(result);
    } catch (error) {
      console.error("Request session payment error:", error);
      res.status(500).json({ message: "Failed to request session payment" });
    }
  });

  // MoMo webhook for payment status updates
  app.post("/api/momo/webhook", async (req, res) => {
    try {
      const { transactionId, status } = req.body;

      if (status === 'SUCCESSFUL') {
        await mentorPaymentService.updatePaymentStatus(transactionId, 'paid');
      } else if (status === 'FAILED') {
        await mentorPaymentService.updatePaymentStatus(transactionId, 'failed');
      }

      res.status(200).json({ message: "Webhook processed" });
    } catch (error) {
      console.error("MoMo webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
