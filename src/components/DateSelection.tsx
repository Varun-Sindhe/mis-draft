import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const DateSelection = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string>("today");
  const [customDate, setCustomDate] = useState<Date>();
  const today = new Date();

  const handleContinue = () => {
    const selectedDate = selectedOption === "today" ? today : customDate;
    if (selectedDate) {
      // Navigate to data entry form with selected date
      navigate(`/data-entry?date=${selectedDate.toISOString()}`);
    }
  };

  const canContinue = selectedOption === "today" || (selectedOption === "custom" && customDate);

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
      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create Production Report</h1>
            <p className="text-muted-foreground">Select the date for your production data entry</p>
          </div>

          {/* Date Selection Card */}
          <Card className="industrial-card">
            <CardHeader>
              <CardTitle>Report Date</CardTitle>
              <CardDescription>
                Choose whether to create a report for today or select a custom date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {/* Today Option */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today" className="font-medium">Today</Label>
                  </div>
                  <div className="ml-6 p-4 bg-success-light rounded-lg border border-success/20">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">
                        {format(today, "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Date Option */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="font-medium">Custom Date</Label>
                  </div>
                  <div className="ml-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !customDate && "text-muted-foreground"
                          )}
                          disabled={selectedOption !== "custom"}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDate ? format(customDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDate}
                          onSelect={setCustomDate}
                          disabled={(date) => date > today}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </RadioGroup>

              {/* Selected Date Preview */}
              {canContinue && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Selected report date:</p>
                  <p className="font-semibold text-foreground">
                    {selectedOption === "today" 
                      ? format(today, "EEEE, MMMM d, yyyy")
                      : customDate && format(customDate, "EEEE, MMMM d, yyyy")
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="px-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="industrial"
              onClick={handleContinue}
              disabled={!canContinue}
              className="px-8 flex-1 max-w-xs"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DateSelection;