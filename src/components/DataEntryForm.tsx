import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Eye, 
  Send,
  Calculator,
  Target,
  TrendingUp,
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProductionItem {
  id: string;
  name: string;
  ftd: string;
  remarks: string;
  monthlyTarget: number;
  previousMTD: number;
}

const DataEntryForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTargetSectionOpen, setIsTargetSectionOpen] = useState(true);
  const [monthlyTarget, setMonthlyTarget] = useState("2000000");
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  // Sample data with realistic previous MTD values
  const [productionItems, setProductionItems] = useState<ProductionItem[]>([
    {
      id: "input-solid-cont",
      name: "Input-Solid Cont Dyeing",
      ftd: "",
      remarks: "",
      monthlyTarget: 2000000,
      previousMTD: 1050000,
    },
    {
      id: "input-solid-conv",
      name: "Input-Solid Conv. Dyeing", 
      ftd: "",
      remarks: "",
      monthlyTarget: 289000,
      previousMTD: 156000,
    },
    {
      id: "input-print",
      name: "Input-Print",
      ftd: "",
      remarks: "",
      monthlyTarget: 1303000,
      previousMTD: 687000,
    },
    {
      id: "input-yarn-dyed",
      name: "Input-Yarn Dyed",
      ftd: "",
      remarks: "",
      monthlyTarget: 296000,
      previousMTD: 158000,
    },
    {
      id: "input-rfd-wht",
      name: "Input-RFD/WHT",
      ftd: "",
      remarks: "",
      monthlyTarget: 112000,
      previousMTD: 59000,
    },
  ]);

  // Parse date from URL params
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(new Date(dateParam));
    }
  }, [searchParams]);

  // Calculate metrics for each item
  const calculateMetrics = useCallback((item: ProductionItem) => {
    const ftdValue = parseFloat(item.ftd) || 0;
    const currentDay = selectedDate.getDate();
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const targetPerDay = item.monthlyTarget / daysInMonth;
    
    const mtd = item.previousMTD + ftdValue;
    const runningAvgPerDay = mtd / currentDay;
    const projectedMonthly = runningAvgPerDay * daysInMonth;
    const achievementPercent = (ftdValue / targetPerDay) * 100;

    return {
      mtd: Math.round(mtd),
      runningAvgPerDay: Math.round(runningAvgPerDay),
      projectedMonthly: Math.round(projectedMonthly),
      achievementPercent: Math.round(achievementPercent),
      targetPerDay: Math.round(targetPerDay),
    };
  }, [selectedDate]);

  // Update item data
  const updateItem = (id: string, field: keyof ProductionItem, value: string | number) => {
    setProductionItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Get achievement style
  const getAchievementStyle = (percent: number) => {
    if (percent >= 100) return "achievement-positive";
    if (percent >= 80) return "achievement-warning";
    return "achievement-negative";
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      setAutoSaveStatus("Saving...");
      setTimeout(() => {
        setAutoSaveStatus("Draft saved");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      }, 1000);
    }, 30000);

    return () => clearTimeout(autoSave);
  }, [productionItems]);

  // Handle form submission
  const handleSubmit = async (action: 'draft' | 'preview' | 'submit') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    switch (action) {
      case 'draft':
        toast({
          title: "Draft Saved",
          description: "Your production report has been saved as a draft.",
        });
        break;
      case 'preview':
        toast({
          title: "Preview Generated",
          description: "Review your report before final submission.",
        });
        break;
      case 'submit':
        toast({
          title: "Report Submitted",
          description: "Production report has been successfully submitted and published.",
        });
        navigate('/');
        break;
    }
  };

  const totalTargetPerDay = Math.round(parseInt(monthlyTarget) / new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/create-report')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Production Data Entry</h1>
                <p className="text-sm text-muted-foreground">
                  Report Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            {autoSaveStatus && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {autoSaveStatus === "Saving..." && <Loader2 className="h-4 w-4 animate-spin" />}
                {autoSaveStatus === "Draft saved" && <CheckCircle className="h-4 w-4 text-success" />}
                <span>{autoSaveStatus}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Section Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Input Department - Daily Production Entry</h2>
          </div>

          {/* Target Settings Section */}
          <Card className="industrial-card">
            <Collapsible open={isTargetSectionOpen} onOpenChange={setIsTargetSectionOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Target Settings</CardTitle>
                    </div>
                    {isTargetSectionOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  <CardDescription>
                    Configure monthly and daily production targets
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-target">Monthly Target</Label>
                      <div className="relative">
                        <Input
                          id="monthly-target"
                          type="number"
                          value={monthlyTarget}
                          onChange={(e) => setMonthlyTarget(e.target.value)}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Meter
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Target per Day</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={totalTargetPerDay}
                          readOnly
                          className="pr-16 bg-muted/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Meter
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    * Usually pre-filled from previous entries
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Data Entry Grid */}
          <Card className="industrial-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>Production Data Entry</span>
              </CardTitle>
              <CardDescription>
                Enter daily production figures and remarks for each input department item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productionItems.map((item) => {
                  const metrics = calculateMetrics(item);
                  
                  return (
                    <div key={item.id} className="data-grid">
                      {/* Item Header */}
                      <div className="col-span-full">
                        <Label className="text-base font-semibold text-foreground">
                          {item.name}
                        </Label>
                      </div>

                      {/* Input Fields Row */}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`ftd-${item.id}`}>FTD (Figure to Date)</Label>
                          <div className="relative">
                            <Input
                              id={`ftd-${item.id}`}
                              type="number"
                              placeholder="0"
                              value={item.ftd}
                              onChange={(e) => updateItem(item.id, 'ftd', e.target.value)}
                              className="pr-16"
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              Meter
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                          <Label htmlFor={`remarks-${item.id}`}>Remarks</Label>
                          <Textarea
                            id={`remarks-${item.id}`}
                            placeholder="Optional remarks..."
                            value={item.remarks}
                            onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                            className="resize-none"
                            rows={1}
                          />
                        </div>
                      </div>

                      {/* Metrics Display */}
                      {item.ftd && (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                          <div className="text-center space-y-1">
                            <p className="metric-display">MTD</p>
                            <p className="text-lg font-semibold">
                              {metrics.mtd.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="metric-display">Running Avg/Day</p>
                            <p className="text-lg font-semibold">
                              {metrics.runningAvgPerDay.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="metric-display">Projected Monthly</p>
                            <div className="flex items-center justify-center space-x-1">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <p className="text-lg font-semibold">
                                {metrics.projectedMonthly.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="metric-display">Daily Achievement</p>
                            <span className={cn("text-sm font-semibold px-2 py-1 rounded", getAchievementStyle(metrics.achievementPercent))}>
                              {metrics.achievementPercent}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => handleSubmit('draft')}
              disabled={isLoading}
              className="sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Draft
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit('preview')}
                disabled={isLoading}
                className="sm:w-auto border-primary text-primary hover:bg-primary/5"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                Preview Report
              </Button>
              <Button
                variant="industrial"
                onClick={() => handleSubmit('submit')}
                disabled={isLoading}
                className="sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit & Publish
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataEntryForm;