// Bu tip, backend'den gelen çalışan verisini temsil eder.
export interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  shift: string; // EKSİK OLAN ALANI EKLEDİK
}

// Yeni bir çalışan oluşturmak için gereken veriler.
export interface EmployeeCreate {
  name: string;
  email: string;
  position: string;
}