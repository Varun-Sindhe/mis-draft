import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">WPD & HSS MIS Report</h1>
                <p className="text-sm text-muted-foreground">Production Data Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Report Card */}
          <Card className="industrial-card hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-success-light rounded-full w-fit">
                <Plus className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-xl">Create New Report</CardTitle>
              <CardDescription>
                Start a new production data entry report for today or a custom date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="industrial" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/create-report')}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Report
              </Button>
            </CardContent>
          </Card>

          {/* Edit Existing Report Card */}
          <Card className="industrial-card hover:shadow-md transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Edit Existing Report</CardTitle>
              <CardDescription>
                Modify or update previously submitted production reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/edit-report')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Edit Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="industrial-card md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reports Created</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Entry</span>
                <span className="font-semibold">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Target</span>
                <span className="font-semibold achievement-positive">85%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card className="industrial-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div>
                      <p className="font-medium">Production Report - September 15, 2025</p>
                      <p className="text-sm text-muted-foreground">Input Department - Submitted at 4:30 PM</p>
                    </div>
                  </div>
                  <span className="achievement-positive">Completed</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div>
                      <p className="font-medium">Production Report - September 14, 2025</p>
                      <p className="text-sm text-muted-foreground">Input Department - Draft saved</p>
                    </div>
                  </div>
                  <span className="achievement-warning">Draft</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div>
                      <p className="font-medium">Production Report - September 13, 2025</p>
                      <p className="text-sm text-muted-foreground">Input Department - Submitted at 5:15 PM</p>
                    </div>
                  </div>
                  <span className="achievement-positive">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;