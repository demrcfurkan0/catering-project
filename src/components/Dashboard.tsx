import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Utensils } from "lucide-react";

// Gerekli tüm servisleri ve tipleri import ediyoruz
import { getAllCompanies } from "@/services/companyService";
import { getAllEmployees } from "@/services/employeeService";
import { getAllMeals } from "@/services/mealService";
import { Company } from "@/types/company";
import { Employee } from "@/types/employee";
import { Meal } from "@/types/meal";

// Grafik verileri için özel tipler
type WeeklyMealData = { day: string; meals: number };
type MealTypeData = { name: string; value: number; color: string };

const Dashboard = () => {
  // Tüm verileri tutacak state'ler
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  
  // Arayüz ve hesaplanmış veri state'leri
  const [isLoading, setIsLoading] = useState(true);
  const [totalMealsToday, setTotalMealsToday] = useState(0);
  const [weeklyMealData, setWeeklyMealData] = useState<WeeklyMealData[]>([]);
  const [mealTypeData, setMealTypeData] = useState<MealTypeData[]>([]);

  // Sayfa yüklendiğinde tüm verileri API'den çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Tüm API isteklerini aynı anda yap
        const [companiesData, employeesData, mealsData] = await Promise.all([
          getAllCompanies(),
          getAllEmployees(),
          getAllMeals(),
        ]);
        setCompanies(companiesData);
        setEmployees(employeesData);
        setMeals(mealsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yemek verileri geldiğinde veya değiştiğinde kartları ve grafikleri güncelle
  useEffect(() => {
    if (meals.length === 0) return;

    // 1. "Total Meals Today" kartı için veri hesaplama
    const today = new Date();
    const todaysMealsCount = meals
      .filter(m => 
        m.year === today.getFullYear() && 
        m.month === today.getMonth() + 1 && 
        m.day === today.getDate()
      )
      .reduce((sum, meal) => sum + meal.count, 0);
    setTotalMealsToday(todaysMealsCount);

    // 2. "Weekly Meal Distribution" grafiği için veri hesaplama
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = dayNames.map(day => ({ day, meals: 0 }));
    
    meals.forEach(meal => {
      const mealDate = new Date(meal.year, meal.month - 1, meal.day);
      const dayIndex = mealDate.getDay();
      weeklyData[dayIndex].meals += meal.count;
    });
    setWeeklyMealData(weeklyData);

    // 3. "Meal Types Distribution" grafiği için veri hesaplama
    const typeDistribution = { Breakfast: 0, Lunch: 0, Dinner: 0 };
    meals.forEach(meal => {
        if (typeDistribution.hasOwnProperty(meal.type)) {
            typeDistribution[meal.type as keyof typeof typeDistribution] += meal.count;
        }
    });

    setMealTypeData([
      { name: "Breakfast", value: typeDistribution.Breakfast, color: "#3B82F6" },
      { name: "Lunch", value: typeDistribution.Lunch, color: "#10B981" },
      { name: "Dinner", value: typeDistribution.Dinner, color: "#F59E0B" },
    ]);

  }, [meals]);

  const activeCompaniesCount = companies.filter(c => c.status === "Active").length;

  return (
    <div className="p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your catering operations.</p>
      </div>

      {/* Üst Kısım: 3 Ana Kart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Meals Today</p>
                <p className="text-3xl font-bold">{isLoading ? "..." : totalMealsToday}</p>
              </div>
              <Utensils size={40} className="text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Companies</p>
                <p className="text-3xl font-bold">{isLoading ? "..." : activeCompaniesCount}</p>
              </div>
              <Building2 size={40} className="text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Team Members</p>
                <p className="text-3xl font-bold">{isLoading ? "..." : employees.length}</p>
              </div>
              <Users size={40} className="text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orta Kısım: Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-slate-800">Weekly Meal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyMealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="meals" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-800">Meal Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={mealTypeData} cx="50%" cy="50%" labelLine={false} outerRadius={110} dataKey="value" nameKey="name">
                  {mealTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value) => `${value} meals`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          </CardContent>
        </Card>
      </div>

      {/* Alt Kısım: Şirket ve Çalışan Listeleri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Client Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : companies.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No companies found.</p>
              ) : (
                companies.map(company => (
                  <div key={company._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-800">{company.name}</h4>
                      <p className="text-sm text-slate-600">{company.email}</p>
                    </div>
                    <Badge className={company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {company.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-800">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              ) : employees.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No employees found.</p>
              ) : (
                employees.map(employee => (
                  <div key={employee._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-800">{employee.name}</h4>
                      <p className="text-sm text-slate-600">{employee.position}</p>
                    </div>
                    <Badge variant="outline" className="text-slate-600">
                      {employee.shift}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;