import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addCompany } from "@/services/companyService";
import { addEmployee } from "@/services/employeeService";

export default function SettingsPage() {
  const { toast } = useToast();
  const [companyForm, setCompanyForm] = useState({ name: "", email: "", address: "" });
  const [employeeForm, setEmployeeForm] = useState({ name: "", email: "", position: "" });

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCompany = await addCompany(companyForm);
      toast({
        title: "Success!",
        description: `Company "${newCompany.name}" has been added.`,
      });
      setCompanyForm({ name: "", email: "", address: "" });
    } catch (err) {
      console.error("Failed to add company", err);
      toast({
        title: "Error",
        description: "Failed to add company. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEmployee = await addEmployee(employeeForm);
      toast({
        title: "Success!",
        description: `Employee "${newEmployee.name}" has been added.`,
      });
      setEmployeeForm({ name: "", email: "", position: "" });
    } catch (err) {
      console.error("Failed to add employee", err);
      toast({
        title: "Error",
        description: "Failed to add employee. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Add new companies and team members to the system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="text-blue-600" size={20} />
              <CardTitle className="text-slate-800">Add Company</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  placeholder="CaterPro Inc."
                  value={companyForm.name}
                  onChange={e => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  type="email"
                  placeholder="contact@caterpro.com"
                  value={companyForm.email}
                  onChange={e => setCompanyForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <Input
                  id="company-address"
                  placeholder="123 Main St, Anytown, USA"
                  value={companyForm.address}
                  onChange={e => setCompanyForm(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Add Company
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserPlus className="text-green-600" size={20} />
              <CardTitle className="text-slate-800">Add Employee</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee-name">Employee Name</Label>
                <Input
                  id="employee-name"
                  placeholder="John Doe"
                  value={employeeForm.name}
                  onChange={e => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-email">Email</Label>
                <Input
                  id="employee-email"
                  type="email"
                  placeholder="john.doe@caterpro.com"
                  value={employeeForm.email}
                  onChange={e => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-position">Position</Label>
                <Input
                  id="employee-position"
                  placeholder="Head Chef"
                  value={employeeForm.position}
                  onChange={e => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Add Employee
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}