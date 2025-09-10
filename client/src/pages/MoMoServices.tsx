import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation, useCurrency, useMoMo } from "@/contexts/LanguageContext";
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Wallet,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  serviceType: string;
  isActive: boolean;
  duration?: string;
  features: string[];
}

interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
}

const MoMoServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [userServices, setUserServices] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { t, formatPrice } = useTranslation();
  const { currency } = useCurrency();
  const { provider } = useMoMo();
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
    fetchUserServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/ai-services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchUserServices = async () => {
    try {
      const response = await fetch("/api/user-services");
      if (response.ok) {
        const data = await response.json();
        setUserServices(data);
      }
    } catch (error) {
      console.error("Error fetching user services:", error);
    }
  };

  const handlePayment = async () => {
    if (!selectedService || !phoneNumber) {
      toast({
        title: t('error'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/ai-services/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          phoneNumber: phoneNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus({
          transactionId: result.transactionId,
          status: 'pending',
          message: result.message
        });

        toast({
          title: t('paymentInitiated'),
          description: t('checkPhoneForPrompt'),
        });

        // Monitor payment status
        monitorPaymentStatus(result.transactionId);
      } else {
        toast({
          title: t('paymentFailed'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('paymentError'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const monitorPaymentStatus = async (transactionId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/ai-services/payment-status/${transactionId}`);
        const result = await response.json();

        setPaymentStatus(prev => prev ? { ...prev, status: result.status } : null);

        if (result.status === 'completed') {
          toast({
            title: t('paymentSuccessful'),
            description: t('serviceActivated'),
          });
          fetchUserServices();
          setSelectedService(null);
          setPhoneNumber("");
          setPaymentStatus(null);
        } else if (result.status === 'failed') {
          toast({
            title: t('paymentFailed'),
            description: t('paymentFailedMessage'),
            variant: "destructive",
          });
          setPaymentStatus(null);
        } else {
          // Continue monitoring
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkStatus();
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'cv_generation':
        return <CreditCard className="h-6 w-6" />;
      case 'cover_letter':
        return <Zap className="h-6 w-6" />;
      case 'job_alerts':
        return <Smartphone className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const hasActiveService = (serviceType: string) => {
    return userServices.some(service => 
      service.serviceType === serviceType && 
      service.status === 'completed' &&
      new Date(service.expiresAt) > new Date()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('momoServices')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('payWithMomo')} {provider} • {t('securePayments')}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{t('secureEncrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>{t('instantActivation')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">{t('availableServices')}</h2>
            <div className="grid gap-6">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all ${
                    selectedService?.id === service.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getServiceIcon(service.serviceType)}
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(parseFloat(service.price))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.duration || t('oneTime')}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasActiveService(service.serviceType) ? (
                          <Badge variant="secondary" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('active')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{t('available')}</Badge>
                        )}
                      </div>
                      <Button 
                        variant={selectedService?.id === service.id ? "default" : "outline"}
                        size="sm"
                      >
                        {selectedService?.id === service.id ? t('selected') : t('select')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {t('payWithMomo')}
                </CardTitle>
                <CardDescription>
                  {provider} • {currency.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedService ? (
                  <>
                    {/* Selected Service */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{selectedService.name}</span>
                        <span className="font-bold text-primary">
                          {formatPrice(parseFloat(selectedService.price))}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedService.description}
                      </p>
                    </div>

                    <Separator />

                    {/* Payment Form */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">{t('phoneNumber')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+27 123 456 789"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isProcessing}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('momoRegisteredNumber')}
                        </p>
                      </div>

                      {/* Payment Status */}
                      {paymentStatus && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(paymentStatus.status)}
                            <span className="font-medium capitalize">
                              {t(paymentStatus.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {paymentStatus.message}
                          </p>
                          {paymentStatus.status === 'pending' && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              {t('transactionId')}: {paymentStatus.transactionId}
                            </div>
                          )}
                        </div>
                      )}

                      <Button 
                        onClick={handlePayment}
                        disabled={!phoneNumber || isProcessing || paymentStatus?.status === 'pending'}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing ? t('processing') : `${t('payNow')} ${formatPrice(parseFloat(selectedService.price))}`}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('selectServiceToPay')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Services */}
            {userServices.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">{t('myServices')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{service.serviceName}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('expires')}: {new Date(service.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                        {getStatusIcon(service.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoMoServices;
