import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service if available
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      // You can integrate with error tracking services here (Sentry, LogRocket, etc.)
      console.error("Production error:", {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 border-destructive">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Oops! Something Went Wrong</h1>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                We encountered an unexpected error. Our team has been notified and is working to fix the issue.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="w-full mb-6 p-4 bg-muted rounded-lg text-left overflow-auto">
                  <p className="text-sm font-mono text-destructive mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-muted-foreground overflow-auto max-h-48">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button onClick={this.handleReset} className="w-full sm:w-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-border w-full">
                <p className="text-sm text-muted-foreground mb-2">Need Help?</p>
                <p className="text-sm">
                  Contact our support team at{" "}
                  <a 
                    href="mailto:support@gocargologisticsus.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    support@gocargologisticsus.com
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}