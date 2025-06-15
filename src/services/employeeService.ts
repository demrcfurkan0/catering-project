import apiClient from "@/lib/apiClient";
// Tipleri import ediyoruz
import { Employee, EmployeeCreate } from "@/types/employee";

export async function getAllEmployees(): Promise<Employee[]> {
  const response = await apiClient.get<Employee[]>("/employees/");
  return response.data;
}

// Fonksiyonun parametresini EmployeeCreate olarak güncelliyoruz.
export async function addEmployee(employeeData: EmployeeCreate): Promise<Employee> {
  const response = await apiClient.post<Employee>("/employees/", employeeData);
  return response.data;
}