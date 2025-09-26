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
  const [isTargetSectionOpen, setIsTargetSectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");
  const [openMetrics, setOpenMetrics] = useState<Record<string, boolean>>({});

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
    // BSR section
    {
      id: "bsr-solid",
      name: "BSR production- Solid",
      ftd: "",
      remarks: "",
      monthlyTarget: 0,
      previousMTD: 0,
    },
    {
      id: "bsr-print",
      name: "BSR production- Print",
      ftd: "",
      remarks: "",
      monthlyTarget: 0,
      previousMTD: 0,
    },
    {
      id: "bsr-yarn-dyed",
      name: "BSR production- Yarn Dyed",
      ftd: "",
      remarks: "",
      monthlyTarget: 0,
      previousMTD: 0,
    },
    {
      id: "bsr-rfd-wht",
      name: "BSR production- RFD/WHT",
      ftd: "",
      remarks: "",
      monthlyTarget: 0,
      previousMTD: 0,
    },
  ]);

  // Load saved monthly targets for 2025 from localStorage and apply by month
  const applySavedTargetsForMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1) as "7" | "8" | "9" | "10" | string;
    const key = `monthlyTargets:${year}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const saved: Record<string, Partial<Record<string, number>>> = JSON.parse(raw);
      setProductionItems(prev => prev.map(item => {
        const savedForDept = saved[item.id]?.[month];
        if (typeof savedForDept === 'number' && savedForDept > 0) {
          return { ...item, monthlyTarget: savedForDept };
        }
        return item;
      }));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Parse date from URL params
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const d = new Date(dateParam);
      setSelectedDate(d);
      applySavedTargetsForMonth(d);
    }
  }, [searchParams, applySavedTargetsForMonth]);

  // When date changes via UI later, ensure targets refresh
  useEffect(() => {
    if (selectedDate) {
      applySavedTargetsForMonth(selectedDate);
    }
  }, [selectedDate, applySavedTargetsForMonth]);

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

  // Section helpers
  const getSectionItems = useCallback((prefix: "input" | "bsr") => {
    return productionItems.filter(p => p.id.startsWith(prefix));
  }, [productionItems]);

  const calculateSectionTotals = useCallback((section: "input" | "bsr") => {
    const items = getSectionItems(section);
    const ftdSum = items.reduce((acc, it) => acc + (parseFloat(it.ftd) || 0), 0);
    const monthlyTargetSum = items.reduce((acc, it) => acc + (it.monthlyTarget || 0), 0);
    const previousMTDSum = items.reduce((acc, it) => acc + (it.previousMTD || 0), 0);
    const currentDay = selectedDate.getDate();
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const mtd = previousMTDSum + ftdSum;
    const runningAvgPerDay = mtd / (currentDay || 1);
    const projectedMonthly = runningAvgPerDay * daysInMonth;
    const targetPerDay = monthlyTargetSum / daysInMonth;
    const achievementPercent = targetPerDay > 0 ? (ftdSum / targetPerDay) * 100 : 0;
    return {
      ftdSum: Math.round(ftdSum),
      monthlyTargetSum: Math.round(monthlyTargetSum),
      mtd: Math.round(mtd),
      runningAvgPerDay: Math.round(runningAvgPerDay),
      projectedMonthly: Math.round(projectedMonthly),
      achievementPercent: Math.round(achievementPercent),
      targetPerDay: Math.round(targetPerDay),
    };
  }, [getSectionItems, selectedDate]);

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

  // Targets are managed per-department and per-month via Edit page

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
            <h2 className="text-2xl font-bold text-foreground">Input - Daily Production Entry</h2>
            <p className="text-sm text-muted-foreground">Sections: input and bsr</p>
          </div>

          {/* Target Settings Section */}
          <Card className="industrial-card">
            <Collapsible open={isTargetSectionOpen} onOpenChange={setIsTargetSectionOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Targets Overview</CardTitle>
                    </div>
                    {isTargetSectionOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  <CardDescription>
                    Overview of monthly and daily production targets
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Individual Department Targets</Label>
                    <div className="grid gap-2">
                      {productionItems.map((item) => {
                        const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
                        const targetPerDay = Math.round(item.monthlyTarget / daysInMonth);
                        return (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-muted/20 rounded border">
                            <span className="text-sm font-medium">{item.name}</span>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-muted-foreground">
                                Monthly: {item.monthlyTarget.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">
                                Daily: {targetPerDay.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    * Individual targets can be modified in the data entry section below
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Data Entry Grid - Input Section */}
          <Card className="industrial-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>input section</span>
              </CardTitle>
              <CardDescription>
                Enter daily production figures for input subdepartments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getSectionItems("input").map((item) => {
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
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                          <Label>Average Daily Target</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="0"
                              value={Math.round(item.monthlyTarget / (new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()))}
                              readOnly
                              className="pr-16 bg-muted/30"
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              Meter
                            </span>
                          </div>
                        </div>
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
                        <div className="space-y-2">
                          <Label htmlFor={`remarks-${item.id}`}>Remarks</Label>
                          <Input
                            id={`remarks-${item.id}`}
                            type="text"
                            placeholder="Optional remarks..."
                            value={item.remarks}
                            onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                            className="pr-3"
                          />
                        </div>
                      </div>

                      {/* Metrics Display - collapsible */}
                      <div className="mt-2">
                        <Collapsible
                          open={!!openMetrics[item.id]}
                          onOpenChange={(open) => setOpenMetrics((prev) => ({ ...prev, [item.id]: open }))}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <span className="mr-2">Metrics</span>
                              {openMetrics[item.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {item.ftd ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-4 mt-3 bg-muted/20 rounded-lg border border-border/50">
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
                            ) : (
                              <div className="text-sm text-muted-foreground p-3 mt-2">Enter FTD to see metrics.</div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  );
                })}
                {/* Input Total Row */}
                {(() => {
                  const t = calculateSectionTotals("input");
                  return (
                    <div className="data-grid">
                      <div className="col-span-full">
                        <Label className="text-base font-semibold text-foreground">Input- Total</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="metric-display">Monthly Target Sum</p>
                          <p className="text-lg font-semibold">{t.monthlyTargetSum.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">FTD Sum</p>
                          <p className="text-lg font-semibold">{t.ftdSum.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">MTD</p>
                          <p className="text-lg font-semibold">{t.mtd.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">Daily Achievement</p>
                          <span className={cn("text-sm font-semibold px-2 py-1 rounded", getAchievementStyle(t.achievementPercent))}>{t.achievementPercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Data Entry Grid - BSR Section */}
          <Card className="industrial-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>bsr section</span>
              </CardTitle>
              <CardDescription>
                Enter daily production figures for bsr subdepartments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getSectionItems("bsr").map((item) => {
                  const metrics = calculateMetrics(item);
                  return (
                    <div key={item.id} className="data-grid">
                      <div className="col-span-full">
                        <Label className="text-base font-semibold text-foreground">{item.name}</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                          <Label>Average Daily Target</Label>
                          <div className="relative">
                            <Input type="number" placeholder="0" value={Math.round(item.monthlyTarget / (new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()))} readOnly className="pr-16 bg-muted/30" required />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Meter</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ftd-${item.id}`}>FTD (Figure to Date)</Label>
                          <div className="relative">
                            <Input id={`ftd-${item.id}`} type="number" placeholder="0" value={item.ftd} onChange={(e) => updateItem(item.id, 'ftd', e.target.value)} className="pr-16" required />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Meter</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`remarks-${item.id}`}>Remarks</Label>
                          <Input id={`remarks-${item.id}`} type="text" placeholder="Optional remarks..." value={item.remarks} onChange={(e) => updateItem(item.id, 'remarks', e.target.value)} className="pr-3" />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Collapsible open={!!openMetrics[item.id]} onOpenChange={(open) => setOpenMetrics((prev) => ({ ...prev, [item.id]: open }))}>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <span className="mr-2">Metrics</span>
                              {openMetrics[item.id] ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {item.ftd ? (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-4 mt-3 bg-muted/20 rounded-lg border border-border/50">
                                <div className="text-center space-y-1">
                                  <p className="metric-display">MTD</p>
                                  <p className="text-lg font-semibold">{metrics.mtd.toLocaleString()}</p>
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="metric-display">Running Avg/Day</p>
                                  <p className="text-lg font-semibold">{metrics.runningAvgPerDay.toLocaleString()}</p>
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="metric-display">Projected Monthly</p>
                                  <div className="flex items-center justify-center space-x-1">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-lg font-semibold">{metrics.projectedMonthly.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="metric-display">Daily Achievement</p>
                                  <span className={cn("text-sm font-semibold px-2 py-1 rounded", getAchievementStyle(metrics.achievementPercent))}>{metrics.achievementPercent}%</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground p-3 mt-2">Enter FTD to see metrics.</div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  );
                })}

                {/* BSR Total Row */}
                {(() => {
                  const t = calculateSectionTotals("bsr");
                  return (
                    <div className="data-grid">
                      <div className="col-span-full">
                        <Label className="text-base font-semibold text-foreground">BSR production- Total</Label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                          <p className="metric-display">Monthly Target Sum</p>
                          <p className="text-lg font-semibold">{t.monthlyTargetSum.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">FTD Sum</p>
                          <p className="text-lg font-semibold">{t.ftdSum.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">MTD</p>
                          <p className="text-lg font-semibold">{t.mtd.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="metric-display">Daily Achievement</p>
                          <span className={cn("text-sm font-semibold px-2 py-1 rounded", getAchievementStyle(t.achievementPercent))}>{t.achievementPercent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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