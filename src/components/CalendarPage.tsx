import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format, isSameDay } from 'date-fns';
import { createMeal, getMealsByMonth } from '@/services/mealService';
import { Meal, MealCreate } from '@/types/meal';
import { UtensilsCrossed, Sun, Moon, ChefHat, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type DailyMeals = {
  [day: number]: Meal[];
};

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthlyMeals, setMonthlyMeals] = useState<DailyMeals>({});
  
  const [mealForm, setMealForm] = useState({
    menu: '',
    count: 0,
    type: 'Lunch',
  });

  // Seçilen güne ait yemekleri tutmak için yeni bir state
  const [mealsForSelectedDay, setMealsForSelectedDay] = useState<Meal[]>([]);

  // Ay değiştiğinde veya yeni yemek eklendiğinde takvimi günceller
  useEffect(() => {
    fetchMonthlyMeals();
  }, [currentMonth]);

  // Seçilen gün değiştiğinde sağ paneli günceller
  useEffect(() => {
    if (selectedDate) {
      const dayOfMonth = selectedDate.getDate();
      setMealsForSelectedDay(monthlyMeals[dayOfMonth] || []);
    }
  }, [selectedDate, monthlyMeals]);

  const fetchMonthlyMeals = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    try {
      const meals = await getMealsByMonth(year, month);
      const mealsByDay: DailyMeals = {};
      meals.forEach(meal => {
        const day = new Date(meal.year, meal.month - 1, meal.day).getDate();
        if (!mealsByDay[day]) {
          mealsByDay[day] = [];
        }
        mealsByDay[day].push(meal);
      });
      setMonthlyMeals(mealsByDay);
    } catch (error) {
      console.error("Failed to fetch monthly meals:", error);
      toast({ title: "Error", description: "Could not fetch meals.", variant: "destructive" });
    }
  };

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    setSelectedDate(day);
    setMealForm({ menu: '', count: 0, type: 'Lunch' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !mealForm.menu || mealForm.count <= 0) {
      toast({ title: "Validation Error", description: "Please fill all fields correctly.", variant: "destructive" });
      return;
    }
    const mealData: MealCreate = {
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
      type: mealForm.type,
      menu: mealForm.menu,
      count: Number(mealForm.count),
    };
    try {
      await createMeal(mealData);
      toast({ title: "Success", description: "Meal has been added." });
      setMealForm({ menu: '', count: 0, type: 'Lunch' });
      fetchMonthlyMeals(); // Takvimi ve dolayısıyla sağ paneli güncelle
    } catch (error) {
      console.error("Failed to create meal:", error);
      toast({ title: "Error", description: "Could not add the meal.", variant: "destructive" });
    }
  };

  // İkonları öğün tipine göre döndüren yardımcı fonksiyon
  const getMealIcon = (type: string) => {
    switch (type) {
      case 'Breakfast': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'Lunch': return <UtensilsCrossed className="h-5 w-5 text-green-500" />;
      case 'Dinner': return <Moon className="h-5 w-5 text-indigo-500" />;
      default: return <ChefHat className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex h-full p-4 md:p-8 gap-8">
      {/* Sol Panel: Takvim */}
      <div className="w-1/2 flex flex-col items-center">
        <Card className="w-full">
          <CardHeader><CardTitle>Meal Calendar</CardTitle></CardHeader>
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single" selected={selectedDate} onSelect={handleDayClick}
              month={currentMonth} onMonthChange={setCurrentMonth}
              className="p-0"
              classNames={{
                cell: "h-16 w-16 text-center text-sm p-0 relative",
                day: "h-16 w-16 p-1 rounded-md",
                day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
              }}
              components={{
                DayContent: ({ date: dayDate }) => {
                  const dayOfMonth = dayDate.getDate();
                  const mealsForDay = monthlyMeals[dayOfMonth];
                  return (
                    <div className="h-full w-full flex flex-col items-center justify-center p-1">
                      <span className="mb-1">{dayOfMonth}</span>
                      {mealsForDay && mealsForDay.length > 0 && (
                         <div className="flex gap-1.5">
                            {mealsForDay.some(m => m.type === 'Breakfast') && <Sun className="h-3 w-3 text-yellow-500" />}
                            {mealsForDay.some(m => m.type === 'Lunch') && <UtensilsCrossed className="h-3 w-3 text-green-500" />}
                            {mealsForDay.some(m => m.type === 'Dinner') && <Moon className="h-3 w-3 text-indigo-500" />}
                         </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sağ Panel: Detaylar ve Form */}
      <div className="w-1/2">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>
              {selectedDate ? `Details for ${format(selectedDate, 'MMMM d, yyyy')}` : "Select a day"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-6">
                {/* Mevcut Yemekler Listesi */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Scheduled Meals</h3>
                  {mealsForSelectedDay.length > 0 ? (
                    <div className="space-y-3">
                      {mealsForSelectedDay.map(meal => (
                        <div key={meal._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            {getMealIcon(meal.type)}
                            <div>
                              <p className="font-medium text-slate-800">{meal.type}</p>
                              <p className="text-sm text-slate-600">{meal.menu}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="font-semibold text-slate-800">{meal.count}</p>
                             <p className="text-xs text-slate-500">people</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No meals scheduled for this day.</p>
                  )}
                </div>

                <Separator />

                {/* Yeni Yemek Ekleme Formu */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Add a New Meal</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                        <Label className="mb-2 block text-sm font-medium">Meal Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button size="sm" type="button" variant={mealForm.type === 'Breakfast' ? 'default' : 'outline'} onClick={() => setMealForm(p => ({ ...p, type: 'Breakfast' }))}>Breakfast</Button>
                            <Button size="sm" type="button" variant={mealForm.type === 'Lunch' ? 'default' : 'outline'} onClick={() => setMealForm(p => ({ ...p, type: 'Lunch' }))}>Lunch</Button>
                            <Button size="sm" type="button" variant={mealForm.type === 'Dinner' ? 'default' : 'outline'} onClick={() => setMealForm(p => ({ ...p, type: 'Dinner' }))}>Dinner</Button>
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="menu">Menu Description</Label>
                        <Input id="menu" placeholder="e.g., Grilled Salmon" value={mealForm.menu} onChange={(e) => setMealForm(p => ({ ...p, menu: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="count">Number of People</Label>
                        <Input id="count" type="number" min="1" placeholder="e.g., 50" value={mealForm.count === 0 ? '' : mealForm.count} onChange={(e) => setMealForm(p => ({ ...p, count: parseInt(e.target.value, 10) || 0 }))} required />
                        </div>
                        <Button type="submit" className="w-full">Add This Meal</Button>
                    </form>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-24">
                <p>Click on a day in the calendar to view details and add meals.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}