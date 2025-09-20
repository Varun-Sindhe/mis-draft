import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileSearch, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditReport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Edit Existing Report</h1>
            <p className="text-muted-foreground">Search and modify previously submitted production reports</p>
          </div>

          {/* Coming Soon Card */}
          <Card className="industrial-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Feature Coming Soon</CardTitle>
              <CardDescription>
                The edit existing reports functionality is currently under development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <FileSearch className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Search Reports</p>
                    <p className="text-sm text-muted-foreground">Find reports by date or status</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Edit Entries</p>
                    <p className="text-sm text-muted-foreground">Modify production data and remarks</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  variant="industrial"
                  onClick={() => navigate('/create-report')}
                >
                  Create New Report Instead
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditReport;