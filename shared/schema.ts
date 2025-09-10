import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  age: integer("age").notNull(),
  employmentStatus: text("employment_status").notNull(),
  province: text("province").notNull(),
  gender: text("gender").notNull(),
  momoWalletId: text("momo_wallet_id"),
  momoPhoneNumber: text("momo_phone_number"),
  kycVerified: boolean("kyc_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const insertUserSchema = createInsertSchema(users).omit({ id: true }).extend({
  password: passwordSchema,
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(16, "You must be at least 16 years old").max(100, "Please enter a valid age"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  billingCycle: text("billing_cycle").notNull(), // monthly, yearly
  features: text("features"), // JSON string of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: text("status").notNull(), // active, cancelled, expired, pending
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  momoSubscriptionId: text("momo_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  externalId: text("external_id").notNull().unique(),
  momoTransactionId: text("momo_transaction_id"),
  type: text("type").notNull(), // collection, disbursement
  purpose: text("purpose").notNull(), // subscription, course_payment, cv_scoring, etc.
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  status: text("status").notNull(), // pending, successful, failed, cancelled
  payerPartyId: text("payer_party_id"),
  payeePartyId: text("payee_party_id"),
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scholarships
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").default("ZAR"),
  beneficiaryId: integer("beneficiary_id").references(() => users.id).notNull(),
  status: text("status").default("active"), // active, completed, cancelled
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scholarship Contributions
export const scholarshipContributions = pgTable("scholarship_contributions", {
  id: serial("id").primaryKey(),
  scholarshipId: integer("scholarship_id").references(() => scholarships.id).notNull(),
  contributorId: integer("contributor_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  transactionId: integer("transaction_id").references(() => transactions.id),
  isAnonymous: boolean("is_anonymous").default(false),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Savings Goals
export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").default("ZAR"),
  deadline: timestamp("deadline"),
  status: text("status").default("active"), // active, completed, cancelled
  momoWalletId: text("momo_wallet_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id),
  referredEmail: text("referred_email"),
  type: text("type").notNull(), // student, mentor, employer
  status: text("status").default("pending"), // pending, completed, rewarded
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }),
  rewardTransactionId: integer("reward_transaction_id").references(() => transactions.id),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career Interests & Passions
export const careerInterests = pgTable("career_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  interests: text("interests").notNull(), // JSON array of interests
  passions: text("passions").notNull(), // JSON array of passions
  skills: text("skills"), // JSON array of current skills
  experience: text("experience"), // JSON array of experience areas
  preferredIndustries: text("preferred_industries"), // JSON array
  workEnvironmentPreferences: text("work_environment_preferences"), // JSON object
  salaryExpectations: text("salary_expectations"),
  locationPreferences: text("location_preferences"), // JSON array
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career Pathways
export const careerPathways = pgTable("career_pathways", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  targetCareer: text("target_career").notNull(),
  currentLevel: text("current_level").notNull(), // beginner, intermediate, advanced
  estimatedDuration: text("estimated_duration"), // e.g., "6-12 months"
  difficultyLevel: text("difficulty_level"), // easy, moderate, challenging
  pathway: text("pathway").notNull(), // JSON object with detailed pathway
  status: text("status").default("active"), // active, completed, paused
  progress: integer("progress").default(0), // percentage 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pathway Steps
export const pathwaySteps = pgTable("pathway_steps", {
  id: serial("id").primaryKey(),
  pathwayId: integer("pathway_id").references(() => careerPathways.id).notNull(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // education, skill, experience, certification
  estimatedDuration: text("estimated_duration"),
  resources: text("resources"), // JSON array of resources/links
  prerequisites: text("prerequisites"), // JSON array
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Services
export const aiServices = pgTable("ai_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  serviceType: text("service_type").notNull(), // cv_generation, cover_letter, job_alerts
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User AI Service Purchases
export const userAiServices = pgTable("user_ai_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => aiServices.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  status: text("status").default("pending"), // pending, completed, failed
  usageCount: integer("usage_count").default(0),
  maxUsage: integer("max_usage").default(1),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated CVs
export const generatedCvs = pgTable("generated_cvs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => userAiServices.id),
  title: text("title").notNull(),
  content: text("content").notNull(), // JSON string with CV data
  template: text("template").notNull(),
  status: text("status").default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated Cover Letters
export const generatedCoverLetters = pgTable("generated_cover_letters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => userAiServices.id),
  jobTitle: text("job_title").notNull(),
  companyName: text("company_name").notNull(),
  content: text("content").notNull(),
  status: text("status").default("active"), // active, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Listings
export const jobListings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"), // JSON array
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  currency: text("currency").default("ZAR"),
  jobType: text("job_type").notNull(), // full-time, part-time, contract, internship
  industry: text("industry").notNull(),
  experienceLevel: text("experience_level").notNull(), // entry, mid, senior
  skills: text("skills"), // JSON array
  benefits: text("benefits"), // JSON array
  applicationUrl: text("application_url"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Alert Subscriptions
export const jobAlertSubscriptions = pgTable("job_alert_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => userAiServices.id),
  keywords: text("keywords"), // JSON array
  location: text("location"),
  industry: text("industry"),
  jobType: text("job_type"),
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  experienceLevel: text("experience_level"),
  frequency: text("frequency").default("daily"), // daily, weekly
  isActive: boolean("is_active").default(true),
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginUser = z.infer<typeof loginSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Scholarship = typeof scholarships.$inferSelect;
export type ScholarshipContribution = typeof scholarshipContributions.$inferSelect;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type CareerInterest = typeof careerInterests.$inferSelect;
export type CareerPathway = typeof careerPathways.$inferSelect;
export type PathwayStep = typeof pathwaySteps.$inferSelect;
export type AiService = typeof aiServices.$inferSelect;
export type UserAiService = typeof userAiServices.$inferSelect;
export type GeneratedCv = typeof generatedCvs.$inferSelect;
export type GeneratedCoverLetter = typeof generatedCoverLetters.$inferSelect;
export type JobListing = typeof jobListings.$inferSelect;
export type JobAlertSubscription = typeof jobAlertSubscriptions.$inferSelect;

// Mentorship Sessions
export const mentorshipSessions = pgTable("mentorship_sessions", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  clientId: integer("client_id").references(() => users.id).notNull(),
  sessionType: text("session_type").notNull(), // "career_guidance", "interview_prep", "skill_development"
  duration: integer("duration").notNull(), // in minutes
  rate: text("rate").notNull(), // session fee
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("scheduled"), // "scheduled", "completed", "cancelled"
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending", "paid", "failed"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Requests
export const paymentRequests = pgTable("payment_requests", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  clientPhone: text("client_phone").notNull(),
  clientName: text("client_name"),
  amount: text("amount").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "sent", "paid", "failed"
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MentorshipSession = typeof mentorshipSessions.$inferSelect;
export type PaymentRequest = typeof paymentRequests.$inferSelect;
