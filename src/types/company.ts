// Bu tip, backend'den veri OKURKEN kullanılır (Dashboard için).
export interface Company {
  _id: string;
  name: string;
  email: string;
  address: string;
  status: string;
  employeesCount: number;
}

// Bu tip, backend'e veri OLUŞTURMAK için gönderilirken kullanılır (Settings formu için).
export interface CompanyCreate {
  name: string;
  email: string;
  address: string;
}