
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDay(null);
  };

  const mealData: Record<number, Array<{type: string, menu: string, count: number}>> = {
    5: [
      { type: "Breakfast", menu: "Pancakes & Coffee", count: 45 },
      { type: "Lunch", menu: "Grilled Chicken Salad", count: 120 }
    ],
    12: [
      { type: "Breakfast", menu: "Oatmeal & Fruits", count: 38 },
      { type: "Lunch", menu: "Pasta Primavera", count: 95 },
      { type: "Dinner", menu: "Fish & Chips", count: 67 }
    ],
    18: [
      { type: "Lunch", menu: "BBQ Sandwich", count: 85 }
    ],
    25: [
      { type: "Breakfast", menu: "Bagel & Cream Cheese", count: 52 },
      { type: "Lunch", menu: "Caesar Salad", count: 110 }
    ]
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const getMealTypeColor = (type: string) => {
    switch(type) {
      case "Breakfast": return "bg-blue-100 text-blue-800";
      case "Lunch": return "bg-green-100 text-green-800";
      case "Dinner": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Meal Calendar</h1>
        <p className="text-slate-600">Plan and manage daily meal schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-slate-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {emptyDays.map(day => (
                  <div key={`empty-${day}`} className="p-2" />
                ))}
                {days.map(day => {
                  const hasMeals = mealData[day];
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "p-2 min-h-[60px] border rounded-lg text-left transition-colors relative",
                        isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50",
                        hasMeals ? "bg-green-50 border-green-200" : ""
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-blue-700" : "text-slate-700"
                      )}>
                        {day}
                      </span>
                      {hasMeals && (
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full absolute top-2 right-2" />
                          <div className="text-xs text-slate-600">
                            {hasMeals.length} meal{hasMeals.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Details */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-800">
                  {selectedDay ? `${monthNames[currentDate.getMonth()]} ${selectedDay}` : 'Select a Day'}
                </CardTitle>
                {selectedDay && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus size={16} className="mr-1" />
                    Add Meal
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDay ? (
                <div className="space-y-4">
                  {mealData[selectedDay] ? (
                    mealData[selectedDay].map((meal, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getMealTypeColor(meal.type)}>
                            {meal.type}
                          </Badge>
                          <span className="text-sm text-slate-500">{meal.count} servings</span>
                        </div>
                        <h4 className="font-medium text-slate-800">{meal.menu}</h4>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" className="text-xs">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs text-red-600 hover:text-red-700">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">No meals planned for this day</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus size={16} className="mr-1" />
                        Plan Meals
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">Click on a calendar day to view or add meals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
