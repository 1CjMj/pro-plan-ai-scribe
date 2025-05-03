/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

export const saveEmployeesToFile = (employees: any[]) => {
  try {
    fs.writeFileSync('backend/employees.json', JSON.stringify(employees, null, 2));
  } catch (error) {
    console.error('Error saving employees to file:', error);
  }
};