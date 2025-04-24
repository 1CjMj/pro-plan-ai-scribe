
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  LayoutDashboard,
  ListTodo,
  Users,
  Database,
  Settings,
  BarChart2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { isManager, isWorker } = useAuth();

  const managerLinks = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/projects", icon: <Database className="h-5 w-5" />, label: "Projects" },
    { to: "/tasks", icon: <ListTodo className="h-5 w-5" />, label: "Tasks" },
    { to: "/employees", icon: <Users className="h-5 w-5" />, label: "Employees" },
    { to: "/analytics", icon: <BarChart2 className="h-5 w-5" />, label: "Analytics" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  const workerLinks = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/my-tasks", icon: <ListTodo className="h-5 w-5" />, label: "My Tasks" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  const links = isManager() ? managerLinks : isWorker() ? workerLinks : [];

  return (
    <div 
      className={cn(
        "bg-slate-50 border-r h-screen transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          {!isOpen && (
            <div className="flex justify-center">
              <Link to="/">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Home className="h-6 w-6" />
                </div>
              </Link>
            </div>
          )}
        </div>
        <Separator />
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <Button
                  variant={location.pathname === link.to ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isOpen ? "px-4" : "justify-center px-2"
                  )}
                  asChild
                >
                  <Link to={link.to}>
                    {link.icon}
                    {isOpen && <span className="ml-3">{link.label}</span>}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <Separator className="mb-4" />
          <div className="text-xs text-gray-500 text-center">
            {isOpen && "ProPlanAI © 2023"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
