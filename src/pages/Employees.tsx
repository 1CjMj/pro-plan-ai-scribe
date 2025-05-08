
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Download, 
  Upload,
  UserPlus,
  PlusCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/contexts/ProjectContext';
import { getWorkers, addWorker, Worker } from '@/utils/workerUtils';

const ImportEmployeesDialog = ({ 
  open, 
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [jsonData, setJsonData] = useState('');
  const { importEmployeesFromFile } = useProjects();
  
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      setJsonData(text);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read the file. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!jsonData.trim()) {
        throw new Error('No JSON data provided');
      }

      const data = JSON.parse(jsonData);
      await importEmployeesFromFile(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Invalid JSON data. Please check the format and try again.');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Employees</DialogTitle>
          <DialogDescription>
            Import employees from a JSON file or paste JSON data directly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="json-file">Upload JSON File</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="json-file"
                  type="file"
                  accept=".json"
                  className="flex-1"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <Button type="button" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or paste JSON data
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="json-data">JSON Data</Label>
              <Textarea
                id="json-data"
                placeholder="Paste employee data in JSON format"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="mt-2 h-32"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Example format: [&#123;"name": "John Doe", "email": "john.doe@example.com", "role": "Developer", "skills": ["React", "JavaScript"]&#125;]
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Import</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const NewEmployeeDialog = ({
  open,
  onOpenChange,
  onAddEmployee,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: () => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add the new employee
    addWorker({
      name,
      email,
      role,
      skills: skills.split(',').map(s => s.trim()),
    });
    
    // Reset the form
    setName('');
    setEmail('');
    setRole('');
    setSkills('');
    
    // Close the dialog and refresh the list
    onOpenChange(false);
    onAddEmployee();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account and profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, JavaScript, Project Management (comma separated)"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [newEmployeeDialogOpen, setNewEmployeeDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Worker[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Load employees
  useEffect(() => {
    setEmployees(getWorkers());
  }, [refreshTrigger]);
  
  // Handle refresh after adding new employee
  const handleEmployeeAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.role && employee.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle export employees
  const handleExportEmployees = () => {
    try {
      const dataStr = JSON.stringify(employees, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = 'employees.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting employees:', error);
      alert('Failed to export employees');
    }
  };
  
  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage your team members and their skills
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Employees
                </Button>
              </DialogTrigger>
            </Dialog>
            
            <Dialog open={newEmployeeDialogOpen} onOpenChange={setNewEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, email, role, or skills..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <p className="text-muted-foreground">No employees found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {employee.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.role || "Not specified"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {skill}
                            </Badge>
                          ))}
                          {employee.skills.length > 3 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-help">
                                    +{employee.skills.length - 3}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <p className="font-medium mb-1">All skills:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {employee.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{employee.email || "Not provided"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
            <Button variant="outline" onClick={handleExportEmployees}>
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <ImportEmployeesDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />
      <NewEmployeeDialog 
        open={newEmployeeDialogOpen} 
        onOpenChange={setNewEmployeeDialogOpen}
        onAddEmployee={handleEmployeeAdded}
      />
    </Layout>
  );
};

export default Employees;
