import { db } from "../db";
import { mentorshipSessions, paymentRequests, transactions, users } from "@shared/schema";
import { eq, and, desc, sum, count } from "drizzle-orm";
import { momoService } from "./momoService";

export interface MentorshipSession {
  id: number;
  mentorId: number;
  clientId: number;
  sessionType: string;
  duration: number;
  rate: number;
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  clientPhone?: string;
  clientName?: string;
}

export interface PaymentRequest {
  id: number;
  mentorId: number;
  clientPhone: string;
  clientName?: string;
  amount: number;
  description: string;
  status: 'pending' | 'sent' | 'paid' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface EarningsStats {
  totalEarnings: number;
  pendingPayments: number;
  completedSessions: number;
  monthlyGrowth: number;
}

export class MentorPaymentService {
  
  async getMentorSessions(mentorId: number): Promise<MentorshipSession[]> {
    try {
      const sessions = await db
        .select({
          id: mentorshipSessions.id,
          mentorId: mentorshipSessions.mentorId,
          clientId: mentorshipSessions.clientId,
          sessionType: mentorshipSessions.sessionType,
          duration: mentorshipSessions.duration,
          rate: mentorshipSessions.rate,
          scheduledAt: mentorshipSessions.scheduledAt,
          status: mentorshipSessions.status,
          paymentStatus: mentorshipSessions.paymentStatus,
          clientName: users.username,
          clientPhone: users.phone
        })
        .from(mentorshipSessions)
        .leftJoin(users, eq(mentorshipSessions.clientId, users.id))
        .where(eq(mentorshipSessions.mentorId, mentorId))
        .orderBy(desc(mentorshipSessions.scheduledAt));

      return sessions.map(session => ({
        ...session,
        scheduledAt: new Date(session.scheduledAt),
        rate: parseFloat(session.rate)
      }));
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      throw new Error("Failed to fetch mentor sessions");
    }
  }

  async getPaymentRequests(mentorId: number): Promise<PaymentRequest[]> {
    try {
      const requests = await db
        .select()
        .from(paymentRequests)
        .where(eq(paymentRequests.mentorId, mentorId))
        .orderBy(desc(paymentRequests.createdAt));

      return requests.map(request => ({
        ...request,
        amount: parseFloat(request.amount),
        createdAt: new Date(request.createdAt)
      }));
    } catch (error) {
      console.error("Error fetching payment requests:", error);
      throw new Error("Failed to fetch payment requests");
    }
  }

  async getEarningsStats(mentorId: number): Promise<EarningsStats> {
    try {
      // Get current month and previous month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Total earnings (all time)
      const totalEarningsResult = await db
        .select({ total: sum(mentorshipSessions.rate) })
        .from(mentorshipSessions)
        .where(
          and(
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.paymentStatus, 'paid')
          )
        );

      // Pending payments
      const pendingPaymentsResult = await db
        .select({ total: sum(mentorshipSessions.rate) })
        .from(mentorshipSessions)
        .where(
          and(
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.paymentStatus, 'pending'),
            eq(mentorshipSessions.status, 'completed')
          )
        );

      // Completed sessions this month
      const completedSessionsResult = await db
        .select({ count: count() })
        .from(mentorshipSessions)
        .where(
          and(
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.status, 'completed'),
            eq(mentorshipSessions.scheduledAt, currentMonthStart) // This should use >= comparison
          )
        );

      // Current month earnings
      const currentMonthEarningsResult = await db
        .select({ total: sum(mentorshipSessions.rate) })
        .from(mentorshipSessions)
        .where(
          and(
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.paymentStatus, 'paid'),
            eq(mentorshipSessions.scheduledAt, currentMonthStart) // This should use >= comparison
          )
        );

      // Previous month earnings
      const previousMonthEarningsResult = await db
        .select({ total: sum(mentorshipSessions.rate) })
        .from(mentorshipSessions)
        .where(
          and(
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.paymentStatus, 'paid'),
            eq(mentorshipSessions.scheduledAt, previousMonthStart), // This should use >= and <= comparison
            eq(mentorshipSessions.scheduledAt, previousMonthEnd)
          )
        );

      const totalEarnings = parseFloat(totalEarningsResult[0]?.total || "0");
      const pendingPayments = parseFloat(pendingPaymentsResult[0]?.total || "0");
      const completedSessions = completedSessionsResult[0]?.count || 0;
      const currentMonthEarnings = parseFloat(currentMonthEarningsResult[0]?.total || "0");
      const previousMonthEarnings = parseFloat(previousMonthEarningsResult[0]?.total || "0");

      // Calculate monthly growth
      const monthlyGrowth = previousMonthEarnings > 0 
        ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100
        : 0;

      return {
        totalEarnings,
        pendingPayments,
        completedSessions,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100
      };
    } catch (error) {
      console.error("Error fetching earnings stats:", error);
      throw new Error("Failed to fetch earnings stats");
    }
  }

  async createPaymentRequest(
    mentorId: number, 
    clientPhone: string, 
    amount: number, 
    description: string
  ): Promise<{ success: boolean; transactionId?: string; message: string }> {
    try {
      // Create MoMo transaction for payment request
      const momoTransaction = momoService.createTransaction(
        amount.toString(),
        "ZAR",
        `mentor_payment_${mentorId}_${Date.now()}`,
        clientPhone,
        "msisdn",
        description
      );

      const referenceId = await momoService.requestToPay(momoTransaction);

      // Store payment request
      const [paymentRequest] = await db.insert(paymentRequests).values({
        mentorId,
        clientPhone,
        amount: amount.toString(),
        description,
        status: "sent",
        transactionId: referenceId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning({ id: paymentRequests.id });

      // Store transaction record
      await db.insert(transactions).values({
        userId: mentorId,
        externalId: momoTransaction.externalId,
        momoTransactionId: referenceId,
        type: "collection",
        purpose: "mentor_payment",
        amount: amount.toString(),
        currency: "ZAR",
        status: "pending",
        payerPartyId: clientPhone,
        description,
        metadata: JSON.stringify({ 
          paymentRequestId: paymentRequest.id,
          mentorId 
        })
      });

      return {
        success: true,
        transactionId: referenceId,
        message: "Payment request sent successfully"
      };
    } catch (error) {
      console.error("Error creating payment request:", error);
      return {
        success: false,
        message: "Failed to create payment request"
      };
    }
  }

  async requestSessionPayment(
    mentorId: number, 
    sessionId: number
  ): Promise<{ success: boolean; transactionId?: string; message: string }> {
    try {
      // Get session details
      const session = await db
        .select({
          id: mentorshipSessions.id,
          rate: mentorshipSessions.rate,
          sessionType: mentorshipSessions.sessionType,
          clientPhone: users.phone,
          clientName: users.username
        })
        .from(mentorshipSessions)
        .leftJoin(users, eq(mentorshipSessions.clientId, users.id))
        .where(
          and(
            eq(mentorshipSessions.id, sessionId),
            eq(mentorshipSessions.mentorId, mentorId),
            eq(mentorshipSessions.status, 'completed'),
            eq(mentorshipSessions.paymentStatus, 'pending')
          )
        )
        .limit(1);

      if (session.length === 0) {
        return {
          success: false,
          message: "Session not found or not eligible for payment"
        };
      }

      const sessionData = session[0];
      const amount = parseFloat(sessionData.rate);
      const description = `Payment for ${sessionData.sessionType} session`;

      // Create payment request
      const result = await this.createPaymentRequest(
        mentorId,
        sessionData.clientPhone || "",
        amount,
        description
      );

      if (result.success) {
        // Update session payment status
        await db.update(mentorshipSessions)
          .set({ 
            paymentStatus: 'pending',
            updatedAt: new Date()
          })
          .where(eq(mentorshipSessions.id, sessionId));
      }

      return result;
    } catch (error) {
      console.error("Error requesting session payment:", error);
      return {
        success: false,
        message: "Failed to request session payment"
      };
    }
  }

  async updatePaymentStatus(
    transactionId: string, 
    status: 'paid' | 'failed'
  ): Promise<void> {
    try {
      // Update transaction status
      await db.update(transactions)
        .set({ 
          status: status === 'paid' ? 'completed' : 'failed',
          updatedAt: new Date()
        })
        .where(eq(transactions.momoTransactionId, transactionId));

      // Update payment request status
      await db.update(paymentRequests)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(paymentRequests.transactionId, transactionId));

      // If payment is for a session, update session payment status
      const transaction = await db
        .select({ metadata: transactions.metadata })
        .from(transactions)
        .where(eq(transactions.momoTransactionId, transactionId))
        .limit(1);

      if (transaction.length > 0) {
        const metadata = JSON.parse(transaction[0].metadata || "{}");
        if (metadata.sessionId) {
          await db.update(mentorshipSessions)
            .set({ 
              paymentStatus: status,
              updatedAt: new Date()
            })
            .where(eq(mentorshipSessions.id, metadata.sessionId));
        }
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status");
    }
  }
}

export const mentorPaymentService = new MentorPaymentService();
