import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation, useCurrency, useMoMo } from "@/contexts/LanguageContext";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Send,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Plus
} from "lucide-react";

interface MentorshipSession {
  id: number;
  clientName: string;
  sessionType: string;
  duration: number;
  rate: number;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  clientPhone?: string;
}

interface PaymentRequest {
  id: number;
  clientName: string;
  amount: number;
  description: string;
  status: 'pending' | 'sent' | 'paid' | 'failed';
  createdAt: string;
  transactionId?: string;
}

interface EarningsStats {
  totalEarnings: number;
  pendingPayments: number;
  completedSessions: number;
  monthlyGrowth: number;
}

const MentorPayments = () => {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [earnings, setEarnings] = useState<EarningsStats>({
    totalEarnings: 0,
    pendingPayments: 0,
    completedSessions: 0,
    monthlyGrowth: 0
  });
  const [newPaymentRequest, setNewPaymentRequest] = useState({
    clientPhone: "",
    amount: "",
    description: ""
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  
  const { user } = useAuth();
  const { t, formatPrice } = useTranslation();
  const { currency } = useCurrency();
  const { provider } = useMoMo();
  const { toast } = useToast();

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      // Fetch mentorship sessions
      const sessionsResponse = await fetch("/api/mentor/sessions");
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
      }

      // Fetch payment requests
      const paymentsResponse = await fetch("/api/mentor/payment-requests");
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPaymentRequests(paymentsData);
      }

      // Fetch earnings stats
      const earningsResponse = await fetch("/api/mentor/earnings");
      if (earningsResponse.ok) {
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData);
      }
    } catch (error) {
      console.error("Error fetching mentor data:", error);
    }
  };

  const createPaymentRequest = async () => {
    if (!newPaymentRequest.clientPhone || !newPaymentRequest.amount || !newPaymentRequest.description) {
      toast({
        title: t('error'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    setIsCreatingRequest(true);

    try {
      const response = await fetch("/api/mentor/create-payment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientPhone: newPaymentRequest.clientPhone,
          amount: parseFloat(newPaymentRequest.amount),
          description: newPaymentRequest.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('paymentRequestSent'),
          description: t('clientWillReceivePrompt'),
        });

        setNewPaymentRequest({ clientPhone: "", amount: "", description: "" });
        fetchMentorData();
      } else {
        toast({
          title: t('error'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToCreateRequest'),
        variant: "destructive",
      });
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const requestSessionPayment = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/mentor/request-session-payment/${sessionId}`, {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: t('paymentRequestSent'),
          description: t('clientWillReceivePrompt'),
        });
        fetchMentorData();
      } else {
        toast({
          title: t('error'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRequestPayment'),
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'sent':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'paid': 'default',
      'completed': 'default',
      'pending': 'secondary',
      'sent': 'secondary',
      'failed': 'destructive',
      'cancelled': 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{t(status)}</span>
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('mentorPayments')}</h1>
          <p className="text-muted-foreground">
            {t('managePaymentsAndEarnings')} • {provider}
          </p>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalEarnings')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(earnings.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                +{earnings.monthlyGrowth}% {t('fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pendingPayments')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(earnings.pendingPayments)}</div>
              <p className="text-xs text-muted-foreground">
                {t('awaitingCollection')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('completedSessions')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnings.completedSessions}</div>
              <p className="text-xs text-muted-foreground">
                {t('thisMonth')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('growth')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{earnings.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                {t('monthOverMonth')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">{t('mentorshipSessions')}</TabsTrigger>
            <TabsTrigger value="requests">{t('paymentRequests')}</TabsTrigger>
            <TabsTrigger value="create">{t('createRequest')}</TabsTrigger>
          </TabsList>

          {/* Mentorship Sessions */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>{t('mentorshipSessions')}</CardTitle>
                <CardDescription>
                  {t('manageSessionPayments')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{session.clientName}</h3>
                          {getStatusBadge(session.paymentStatus)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{session.sessionType} • {session.duration} {t('minutes')}</p>
                          <p>{t('scheduled')}: {new Date(session.scheduledAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatPrice(session.rate)}</div>
                        {session.paymentStatus === 'pending' && session.status === 'completed' && (
                          <Button 
                            size="sm" 
                            onClick={() => requestSessionPayment(session.id)}
                            className="mt-2"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            {t('requestPayment')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>{t('noSessionsYet')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentRequests')}</CardTitle>
                <CardDescription>
                  {t('trackPaymentRequests')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{request.clientName}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{request.description}</p>
                          <p>{t('created')}: {new Date(request.createdAt).toLocaleString()}</p>
                          {request.transactionId && (
                            <p>{t('transactionId')}: {request.transactionId}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatPrice(request.amount)}</div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {paymentRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wallet className="h-12 w-12 mx-auto mb-4" />
                      <p>{t('noPaymentRequestsYet')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Payment Request */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>{t('createPaymentRequest')}</CardTitle>
                <CardDescription>
                  {t('sendPaymentRequestToClient')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientPhone">{t('clientPhoneNumber')}</Label>
                      <Input
                        id="clientPhone"
                        type="tel"
                        placeholder="+27 123 456 789"
                        value={newPaymentRequest.clientPhone}
                        onChange={(e) => setNewPaymentRequest(prev => ({
                          ...prev,
                          clientPhone: e.target.value
                        }))}
                        disabled={isCreatingRequest}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('clientMomoNumber')}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="amount">{t('amount')} ({currency.symbol})</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newPaymentRequest.amount}
                        onChange={(e) => setNewPaymentRequest(prev => ({
                          ...prev,
                          amount: e.target.value
                        }))}
                        disabled={isCreatingRequest}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">{t('description')}</Label>
                      <Input
                        id="description"
                        placeholder={t('mentorshipSessionPayment')}
                        value={newPaymentRequest.description}
                        onChange={(e) => setNewPaymentRequest(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        disabled={isCreatingRequest}
                      />
                    </div>

                    <Button 
                      onClick={createPaymentRequest}
                      disabled={isCreatingRequest}
                      className="w-full"
                      size="lg"
                    >
                      {isCreatingRequest ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {isCreatingRequest ? t('creating') : t('createPaymentRequest')}
                    </Button>
                  </div>

                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-medium mb-4">{t('howItWorks')}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p>{t('enterClientDetails')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p>{t('clientReceivesPaymentPrompt')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p>{t('paymentProcessedAutomatically')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p>{t('fundsTransferredToAccount')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorPayments;
