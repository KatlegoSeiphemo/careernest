import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Menu, 
  Target, 
  FileText, 
  Mail, 
  Search, 
  Sparkles, 
  Users, 
  BookOpen,
  TrendingUp,
  MessageCircle,
  Home,
  CreditCard
} from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  category: 'core' | 'ai' | 'community' | 'tools';
}

const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navigationItems: NavigationItem[] = [
    // Core Features
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
      description: "Your career journey overview",
      category: "core"
    },
    {
      title: "Career Assessment",
      href: "/career-assessment",
      icon: <Target className="h-4 w-4" />,
      description: "Discover your ideal career path",
      badge: "Popular",
      category: "core"
    },
    {
      title: "Career Pathways",
      href: "/career-pathway",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Step-by-step career roadmaps",
      badge: "New",
      category: "core"
    },

    // AI-Powered Services
    {
      title: "AI Services",
      href: "/ai-services",
      icon: <Sparkles className="h-4 w-4" />,
      description: "AI-powered career tools with MoMo payments",
      badge: "AI",
      category: "ai"
    },
    {
      title: "CV Generator",
      href: "/cv-generator",
      icon: <FileText className="h-4 w-4" />,
      description: "Create professional CVs",
      category: "ai"
    },
    {
      title: "Cover Letter",
      href: "/cover-letter",
      icon: <Mail className="h-4 w-4" />,
      description: "Generate compelling cover letters",
      category: "ai"
    },
    {
      title: "Job Search",
      href: "/job-search",
      icon: <Search className="h-4 w-4" />,
      description: "Find jobs and get personalized alerts",
      category: "ai"
    },

    // Community & Learning
    {
      title: "Skills Development",
      href: "/skills-development",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Learn new skills and get certified",
      category: "community"
    },
    {
      title: "Mentorship",
      href: "/mentorship",
      icon: <Users className="h-4 w-4" />,
      description: "Connect with industry mentors",
      category: "community"
    },
    {
      title: "Communities",
      href: "/communities",
      icon: <MessageCircle className="h-4 w-4" />,
      description: "Join career-focused communities",
      category: "community"
    },

    // Tools & Resources
    {
      title: "MoMo Services",
      href: "/momo-services",
      icon: <CreditCard className="h-4 w-4" />,
      description: "Pay for services with MoMo",
      category: "tools"
    },
    {
      title: "Mentor Payments",
      href: "/mentor-payments",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Manage mentor earnings and payments",
      category: "tools"
    }
  ];

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core': return 'Core Features';
      case 'ai': return 'AI-Powered Services';
      case 'community': return 'Community & Learning';
      case 'tools': return 'Tools & Resources';
      default: return 'Other';
    }
  };

  const getCategoryItems = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

  const categories = ['core', 'ai', 'community'];

  if (!isAuthenticated) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                CareerNest
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your AI-powered career companion
            </p>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {categories.map((category) => {
              const items = getCategoryItems(category);
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                    {getCategoryTitle(category)}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="flex-shrink-0 text-muted-foreground group-hover:text-foreground">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm group-hover:text-foreground">
                              {item.title}
                            </span>
                            {item.badge && (
                              <Badge 
                                variant={item.badge === 'AI' ? 'default' : 'secondary'} 
                                className={`text-xs ${
                                  item.badge === 'AI' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                                  item.badge === 'New' ? 'bg-green-500' : ''
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Quick Actions */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button 
                  asChild 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="/ai-services">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Browse AI Services
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="/job-search">
                    <Search className="h-4 w-4 mr-2" />
                    Find Jobs
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="/career-assessment">
                    <Target className="h-4 w-4 mr-2" />
                    Take Assessment
                  </a>
                </Button>
              </div>
            </div>

            {/* MoMo Services Info */}
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Pay with MoMo</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use MTN Mobile Money to access premium AI services:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• CV Generator - R50</li>
                  <li>• Cover Letters - R50</li>
                  <li>• Job Alerts - R100/month</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MainNavigation;
