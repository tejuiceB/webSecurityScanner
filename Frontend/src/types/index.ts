export interface User {
  id: number;
  email: string;
  username: string;
}

export interface Vulnerability {
  id: number;
  name: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  description: string;
  solution?: string;
}

export interface ScanResult {
  id: number;
  status: 'in_progress' | 'completed' | 'failed';
  vulnerabilities: Vulnerability[];
  target_url: string;
  scan_type: string;
  start_time: string;
  end_time?: string;
}

export interface ApiError {
  status: number;
  message: string;
}
