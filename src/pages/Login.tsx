
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from || '/dashboard';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Failed to log in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (type: 'manager' | 'worker') => {
    setIsSubmitting(true);
    
    try {
      if (type === 'manager') {
        await login('manager@example.com', 'password');
      } else {
        await login('worker@example.com', 'password');
      }
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Failed to log in with demo account:', error);
      toast({
        title: 'Login failed',
        description: 'Could not log in with demo account',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">ProPlanAI</CardTitle>
          <CardDescription>
            Sign in to access your projects and tasks
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full mb-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="w-full pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('manager')}
                >
                  Manager Demo
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('worker')}
                >
                  Worker Demo
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
