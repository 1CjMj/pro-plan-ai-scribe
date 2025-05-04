import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/contexts/ProjectContext';

// Mock employee data
const employees = [
  {
    id: "user-001",
    name: "Aaron Edwards",
    email: "aaron.edwards@example.com",
    role: "frontend developer",
    skills: ["React", "JavaScript", "CSS", "HTML", "TailwindCSS", "UI Design", "Wireframing", "Visual Design"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron",
  },
  {
    id: "user-002",
    name: "James Meyer",
    email: "james.meyer@example.com",
    role: "backend developer",
    skills: ["Node.js", "Express", "SQL", "MongoDB", "Docker", "Database", "Systems Integration", "DevOps"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: "user-003",
    name: "Stacy Blankenship",
    email: "stacy.blankenship@example.com",
    role: "ai developer",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Analysis", "Research", "User Analysis"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy",
  },
  {
    id: "user-004",
    name: "Phillip Roberts",
    email: "phillip.roberts@example.com",
    role: "frontend developer",
    skills: ["Vue.js", "JavaScript", "CSS", "HTML", "Bootstrap", "UI Design", "Wireframing"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phillip",
  },
  {
    id: "user-005",
    name: "Ann Hill",
    email: "ann.hill@example.com",
    role: "backend developer",
    skills: ["Ruby on Rails", "PostgreSQL", "Redis", "API Development", "Authentication", "Systems Integration", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ann",
  },
  {
    id: "user-006",
    name: "Brett Hayes",
    email: "brett.hayes@example.com",
    role: "ai developer",
    skills: ["Natural Language Processing", "Computer Vision", "Python", "Keras", "Data Engineering", "Research", "Planning"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brett",
  },
  {
    id: "user-007",
    name: "Robert Alexander",
    email: "robert.alexander@example.com",
    role: "frontend developer",
    skills: ["Angular", "TypeScript", "SCSS", "HTML", "RxJS", "UI Design", "Communication"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
  {
    id: "user-008",
    name: "Michael Strickland",
    email: "michael.strickland@example.com",
    role: "backend developer",
    skills: ["Java", "Spring Boot", "MySQL", "Kubernetes", "Microservices", "CI/CD", "DevOps"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: "user-009",
    name: "Samantha Robinson",
    email: "samantha.robinson@example.com",
    role: "ai developer",
    skills: ["Deep Learning", "Python", "Scikit-learn", "Data Visualization", "Big Data", "Research", "User Analysis"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
  },
  {
    id: "user-010",
    name: "Kenneth Anderson",
    email: "kenneth.anderson@example.com",
    role: "frontend developer",
    skills: ["Svelte", "JavaScript", "CSS", "HTML", "GraphQL", "UI Design", "Wireframing"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenneth",
  },
  {
    id: "user-011",
    name: "Emily Carter",
    email: "emily.carter@example.com",
    role: "backend developer",
    skills: ["Go", "gRPC", "PostgreSQL", "Docker", "Cloud Infrastructure", "Systems Integration", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: "user-012",
    name: "Daniel Thompson",
    email: "daniel.thompson@example.com",
    role: "ai developer",
    skills: ["Reinforcement Learning", "Python", "OpenAI Gym", "Data Preprocessing", "AI Ethics", "Research", "Planning"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
  },
  {
    id: "user-013",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    role: "frontend developer",
    skills: ["React", "Next.js", "CSS Modules", "HTML", "Webpack", "UI Design", "Communication"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  },
  {
    id: "user-014",
    name: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    role: "backend developer",
    skills: ["C#", ".NET Core", "SQL Server", "Azure", "API Design", "Systems Integration", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  },
  {
    id: "user-015",
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    role: "ai developer",
    skills: ["Generative AI", "Python", "GANs", "Data Augmentation", "AI Model Optimization", "Research", "Planning"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
  },
  {
    id: "user-016",
    name: "Laura Bennett",
    email: "laura.bennett@example.com",
    role: "project manager",
    skills: ["Project Planning", "Team Coordination", "Risk Management", "Agile Methodologies", "Scrum", "Organization", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
  },
  {
    id: "user-017",
    name: "Mark Peterson",
    email: "mark.peterson@example.com",
    role: "qa engineer",
    skills: ["Testing", "Automation", "Integration", "Bug Tracking", "Regression Testing", "Quality Assurance", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
  },
  {
    id: "user-018",
    name: "Sarah Collins",
    email: "sarah.collins@example.com",
    role: "project manager",
    skills: ["Organization", "Resource Allocation", "Stakeholder Communication", "Budget Management", "Project Documentation", "Planning", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "user-019",
    name: "Tom Harris",
    email: "tom.harris@example.com",
    role: "qa engineer",
    skills: ["Manual Testing", "Performance Testing", "Test Case Design", "API Testing", "Load Testing", "Quality Assurance", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
  },
  {
    id: "user-020",
    name: "Jessica Wright",
    email: "jessica.wright@example.com",
    role: "project manager",
    skills: ["Strategic Planning", "Change Management", "Process Improvement", "Leadership", "Cross-functional Collaboration", "Organization", "Execution"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
  },
];

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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    
    // In a real app, this would create a new employee
    console.log('New employee:', { name, email, role, skills: skills.split(',').map(s => s.trim()) });
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
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {employee.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {skill}
                            </Badge>
                          ))}
                          {employee.skills.length > 3 && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              +{employee.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
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
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <ImportEmployeesDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
      <NewEmployeeDialog open={newEmployeeDialogOpen} onOpenChange={setNewEmployeeDialogOpen} />
    </Layout>
  );
};

export default Employees;
