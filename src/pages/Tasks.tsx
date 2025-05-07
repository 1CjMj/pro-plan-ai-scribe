
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProjects, TaskStatus } from '@/contexts/ProjectContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TasksTable from '@/components/tasks/TasksTable';

const Tasks = () => {
  const { projects } = useProjects();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  
  // Check for tab parameter in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'completed') {
      setActiveTab('completed');
    }
  }, [location]);
  
  // Gather all tasks from all projects
  const allTasks = projects.flatMap(project => 
    project.tasks.map(task => ({
      ...task,
      projectId: project.id, // Ensure projectId is available
    }))
  );
  
  // Filter tasks based on active tab
  const filteredTasks = activeTab === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.status === activeTab);
  
  // Count tasks in each status
  const taskCounts = {
    all: allTasks.length,
    'not-started': allTasks.filter(t => t.status === 'not-started').length,
    'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
    'completed': allTasks.filter(t => t.status === 'completed').length,
  };
  
  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage all tasks across your projects
          </p>
        </header>
        
        <Tabs 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TaskStatus | 'all')}
        >
          <TabsList>
            <TabsTrigger value="all">
              All Tasks <span className="ml-2 bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-xs">{taskCounts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="not-started">
              Not Started <span className="ml-2 bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-xs">{taskCounts["not-started"]}</span>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress <span className="ml-2 bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-xs">{taskCounts["in-progress"]}</span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed <span className="ml-2 bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-xs">{taskCounts.completed}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            <TasksTable tasks={filteredTasks} showProject={true} />
          </TabsContent>
          
          <TabsContent value="not-started" className="space-y-4 mt-4">
            <TasksTable tasks={filteredTasks} showProject={true} />
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4 mt-4">
            <TasksTable tasks={filteredTasks} showProject={true} />
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4 mt-4">
            <TasksTable tasks={filteredTasks} showProject={true} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tasks;
