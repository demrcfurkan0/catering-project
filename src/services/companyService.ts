import apiClient from "@/lib/apiClient";
// Yeni tipleri import ediyoruz
import { Company, CompanyCreate } from "@/types/company";

export async function getAllCompanies(): Promise<Company[]> {
  const response = await apiClient.get<Company[]>("/companies/");
  return response.data;
}

// Fonksiyonun parametresini CompanyCreate olarak güncelliyoruz.
export async function addCompany(companyData: CompanyCreate): Promise<Company> {
  const response = await apiClient.post<Company>("/companies/", companyData);
  return response.data;
}