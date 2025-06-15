import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Utensils } from "lucide-react";
import { getAllCompanies } from "@/services/companyService";
import { getAllEmployees } from "@/services/employeeService";
import { Company } from "@/types/company";
import { Employee } from "@/types/employee";

const Dashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [companiesData, employeesData] = await Promise.all([
          getAllCompanies(),
          getAllEmployees(),
        ]);
        setCompanies(companiesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const dailyMealData = [
    { day: "Mon", meals: 450 }, { day: "Tue", meals: 520 },
    { day: "Wed", meals: 380 }, { day: "Thu", meals: 490 },
    { day: "Fri", meals: 620 }, { day: "Sat", meals: 280 },
    { day: "Sun", meals: 190 },
  ];

  const mealTypeData = [
    { name: "Breakfast", value: 35, color: "#3B82F6" },
    { name: "Lunch", value: 45, color: "#10B981" },
    { name: "Dinner", value: 20, color: "#F59E0B" },
  ];

  const activeCompaniesCount = companies.filter(c => c.status === "Active").length;

  return (
    <div className="p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your catering operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Meals Today</p>
                <p className="text-3xl font-bold">620</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-slate-800">Weekly Meal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMealData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                <Bar dataKey="meals" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-800">Meal Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={mealTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {mealTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {mealTypeData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <p className="text-sm text-slate-600">{company.employeesCount} employees</p>
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