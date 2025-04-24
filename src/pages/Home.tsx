
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Users,
  Calendar,
} from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI-Powered Project Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text mb-6">
            ProPlanAI
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10">
            Generate tasks, allocate resources, and track project progress with the power of AI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
            <Link to="/login">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supercharge your project management
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              ProPlanAI combines powerful AI capabilities with intuitive project management tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Task Generation</h3>
                <p className="text-slate-600">
                  Turn project descriptions into detailed task lists with skill and resource requirements
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Task Allocation</h3>
                <p className="text-slate-600">
                  Automatically assign tasks to team members based on skills and availability
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Resource Management</h3>
                <p className="text-slate-600">
                  Track and optimize resource allocation across projects and tasks
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-slate-600">
                  Monitor task completion and project progress with real-time updates
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <BarChart2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-slate-600">
                  Gain insights into project performance, team utilization, and more
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 hover-scale card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-slate-600">
                  Keep everyone on the same page with role-based access and notifications
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-primary/80 rounded-xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your project management?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of project managers who are saving time and improving outcomes with ProPlanAI
          </p>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <span className="text-white font-semibold text-xl">ProPlanAI</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>© 2023 ProPlanAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
