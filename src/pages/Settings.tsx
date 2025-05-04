
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Languages } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const { theme, language, toggleTheme, setLanguage } = useTheme();

  return (
    <Layout requiresAuth={true}>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Moon className="h-5 w-5" />
                <span>Theme</span>
              </CardTitle>
              <CardDescription>
                Choose between light and dark theme for the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="cursor-pointer">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Label>
                <Switch 
                  id="theme-toggle" 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <span>Language</span>
              </CardTitle>
              <CardDescription>
                Select your preferred language for the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="language-select">Language</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                  <SelectTrigger id="language-select" className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
