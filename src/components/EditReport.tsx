import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileSearch, Calendar, Settings, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditReport = () => {
  const navigate = useNavigate();

  // Departments list shared across forms (ids must match DataEntryForm)
  const departments = useMemo(
    () => [
      { id: "input-solid-cont", name: "Input-Solid Cont Dyeing" },
      { id: "input-solid-conv", name: "Input-Solid Conv. Dyeing" },
      { id: "input-print", name: "Input-Print" },
      { id: "input-yarn-dyed", name: "Input-Yarn Dyed" },
      { id: "input-rfd-wht", name: "Input-RFD/WHT" },
    ],
    []
  );

  type MonthKey = "7" | "8" | "9" | "10"; // Jul–Oct
  type DepartmentTargets = Record<string, Partial<Record<MonthKey, number>>>;

  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("7");
  const [year] = useState<number>(2025);
  const [targets, setTargets] = useState<Record<string, string>>({});

  const storageKey = useMemo(() => `monthlyTargets:${year}`, [year]);

  const loadFromStorage = (): DepartmentTargets => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      return JSON.parse(raw) as DepartmentTargets;
    } catch {
      return {};
    }
  };

  const saveToStorage = (data: DepartmentTargets) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  // Initialize form fields from localStorage for current month
  useEffect(() => {
    const stored = loadFromStorage();
    const initial: Record<string, string> = {};
    departments.forEach((d) => {
      const value = stored[d.id]?.[selectedMonth] ?? "";
      initial[d.id] = value === "" ? "" : String(value);
    });
    setTargets(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const handleChange = (deptId: string, value: string) => {
    setTargets((prev) => ({ ...prev, [deptId]: value }));
  };

  const handleSave = () => {
    const current = loadFromStorage();
    const updated: DepartmentTargets = { ...current };
    departments.forEach((d) => {
      const numeric = parseFloat(targets[d.id] ?? "");
      if (!updated[d.id]) updated[d.id] = {};
      if (!isNaN(numeric) && numeric > 0) {
        updated[d.id]![selectedMonth] = numeric;
      } else {
        // Allow clearing a value by leaving empty or 0
        if (updated[d.id] && updated[d.id]![selectedMonth]) {
          delete updated[d.id]![selectedMonth];
        }
      }
    });
    saveToStorage(updated);
  };

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
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Edit</h1>
            <p className="text-muted-foreground">Configure monthly targets and manage field data</p>
          </div>

          {/* Monthly Targets Card */}
          <Card className="industrial-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Edit Monthly Targets</CardTitle>
                </div>
              </div>
              <CardDescription>
                Set department-wise monthly targets for 2025 (Jul–Oct). These will auto-apply in the daily entry form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label>Month (2025)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { key: "7", label: "July" },
                      { key: "8", label: "August" },
                      { key: "9", label: "September" },
                      { key: "10", label: "October" },
                    ].map((m) => (
                      <Button
                        key={m.key}
                        variant={selectedMonth === (m.key as MonthKey) ? "industrial" : "outline"}
                        onClick={() => setSelectedMonth(m.key as MonthKey)}
                        className="w-full"
                      >
                        {m.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="industrial" onClick={handleSave}>Save Targets</Button>
                </div>
              </div>

              <div className="grid gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="grid md:grid-cols-2 gap-3 items-end p-3 rounded border bg-muted/20">
                    <div className="space-y-1">
                      <Label className="text-sm">{dept.name}</Label>
                      <p className="text-xs text-muted-foreground">Department ID: {dept.id}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`mt-${dept.id}`}>Monthly Target (Meter)</Label>
                      <div className="relative">
                        <Input
                          id={`mt-${dept.id}`}
                          type="number"
                          placeholder="0"
                          value={targets[dept.id] ?? ""}
                          onChange={(e) => handleChange(dept.id, e.target.value)}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Meter</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button variant="industrial" onClick={handleSave}>Save Targets</Button>
              </div>
            </CardContent>
          </Card>

          {/* Field Data Card - placeholder */}
          <Card className="industrial-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Field Data</CardTitle>
              </div>
              <CardDescription>Coming soon. Manage daily field data entries here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <FileSearch className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Search Entries</p>
                    <p className="text-sm text-muted-foreground">Find by date or status (planned)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Edit FTD</p>
                    <p className="text-sm text-muted-foreground">Modify daily figures (planned)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditReport;