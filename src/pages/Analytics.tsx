/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import Layout from '@/components/layout/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowUpRight } from 'lucide-react';

const ProjectCompletionChart = ({ projects }: { projects: any[] }) => {
  // Calculate completion percentage for each project
  const projectData = projects.map(project => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      name: project.title,
      value: percentage
    };
  });
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={projectData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 70,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
        <YAxis domain={[0, 100]} unit="%" />
        <Tooltip
          formatter={(value: number) => [`${value}% Complete`, 'Completion']}
          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
        />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Project Completion (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TaskStatusDistribution = ({ projects }: { projects: any[] }) => {
  // Combine all tasks from all projects
  const allTasks = projects.flatMap(project => project.tasks);
  
  // Count tasks by status
  const notStarted = allTasks.filter(t => t.status === 'not-started').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const completed = allTasks.filter(t => t.status === 'completed').length;
  
  const data = [
    { name: 'Not Started', value: notStarted },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ];
  
  const COLORS = ['#d0d0d0', '#ffc658', '#82ca9d'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [value, 'Tasks']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const ResourceUtilizationChart = ({ projects }: { projects: any[] }) => {
  // Combine all tasks from all projects
  const allTasks = projects.flatMap(project => project.tasks);
  
  // Group resource usage
  const resourceUsage: Record<string, number> = {};
  
  allTasks.forEach(task => {
    task.resources.forEach((resource: any) => {
      if (!resourceUsage[resource.resourceId]) {
        resourceUsage[resource.resourceId] = 0;
      }
      
      resourceUsage[resource.resourceId] += resource.amount;
    });
  });
  
  // Convert to chart data
  const data = Object.entries(resourceUsage).map(([resourceId, amount]) => {
    const resourceName = resourceId.replace('resource-', 'Resource ');
    return {
      name: resourceName,
      value: amount
    };
  });
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => [value, 'Units Used']} />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Resource Usage" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ProjectTimelineChart = ({ projects }: { projects: any[] }) => {
  // Mock timeline data (in a real app, this would come from actual time tracking)
  const timelineData = [
    { name: 'Week 1', planned: 40, actual: 35 },
    { name: 'Week 2', planned: 45, actual: 48 },
    { name: 'Week 3', planned: 60, actual: 55 },
    { name: 'Week 4', planned: 50, actual: 52 },
    { name: 'Week 5', planned: 70, actual: 65 },
    { name: 'Week 6', planned: 60, actual: 70 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={timelineData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit="h" />
        <Tooltip formatter={(value: number) => [`${value} hrs`, '']} />
        <Legend />
        <Line type="monotone" dataKey="planned" stroke="#8884d8" name="Planned Hours" />
        <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual Hours" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Analytics = () => {
  const { projects } = useProjects();
  
  // Stats summary
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  
  // All tasks across all projects
  const allTasks = projects.flatMap(project => project.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate average task completion time (mock data)
  const avgCompletionTime = 3.2; // days
  
  // Mock resource efficiency
  const resourceEfficiency = 85; // percent
  
  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Project performance and resource utilization insights
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PROJECT COMPLETION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{taskCompletionRate}%</div>
                <div className="text-sm text-muted-foreground">
                  {completedTasks}/{totalTasks} tasks complete
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary">
                <div
                  className="h-1.5 bg-primary"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">AVG COMPLETION TIME</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{avgCompletionTime} days</div>
                  <p className="text-xs text-muted-foreground">per task</p>
                </div>
                <div className={`text-xs flex items-center gap-1 text-green-500`}>
                  <ArrowUpRight className="h-3 w-3" />
                  12% faster than avg.
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">RESOURCE EFFICIENCY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{resourceEfficiency}%</div>
                <div className="text-xs text-muted-foreground">
                  Based on allocation vs. usage
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary">
                <div
                  className="h-1.5 bg-primary"
                  style={{ width: `${resourceEfficiency}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ACTIVE PROJECTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{activeProjects}</div>
                <div className="text-sm text-muted-foreground">
                  of {totalProjects} total
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Completion Status</CardTitle>
              <CardDescription>
                Percentage of completed tasks by project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">No project data to display</p>
                </div>
              ) : (
                <ProjectCompletionChart projects={projects} />
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
              <CardDescription>
                Overview of task statuses across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">No task data to display</p>
                </div>
              ) : (
                <TaskStatusDistribution projects={projects} />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="resources">
          <TabsList className="w-full">
            <TabsTrigger value="resources" className="flex-1">Resource Utilization</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Project Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>
                  Usage of resources across all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">No resource data to display</p>
                  </div>
                ) : (
                  <ResourceUtilizationChart projects={projects} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>
                      Planned vs. actual hours over time
                    </CardDescription>
                  </div>
                  <Select defaultValue="project-001">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ProjectTimelineChart projects={projects} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
