
import workersData from '../data/workers.json';

export type Worker = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  skills: string[];
  avatar?: string;
};

// Use the initial data from the JSON file as our workers
let workers: Worker[] = [...workersData];

// Get all workers
export const getWorkers = (): Worker[] => {
  return workers;
};

// Get a worker by ID
export const getWorkerById = (id: string): Worker | undefined => {
  return workers.find(worker => worker.id === id);
};

// Add a new worker
export const addWorker = (worker: Omit<Worker, 'id' | 'avatar'>): Worker => {
  const newId = `user-${String(workers.length + 1).padStart(3, '0')}`;
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.name.split(' ')[0]}`;
  
  const newWorker: Worker = {
    ...worker,
    id: newId,
    avatar
  };
  
  workers = [...workers, newWorker];
  saveWorkers();
  return newWorker;
};

// Update a worker
export const updateWorker = (id: string, updates: Partial<Worker>): Worker | undefined => {
  const workerIndex = workers.findIndex(worker => worker.id === id);
  
  if (workerIndex === -1) return undefined;
  
  const updatedWorker = {
    ...workers[workerIndex],
    ...updates
  };
  
  workers = [
    ...workers.slice(0, workerIndex),
    updatedWorker,
    ...workers.slice(workerIndex + 1)
  ];
  
  saveWorkers();
  return updatedWorker;
};

// Delete a worker
export const deleteWorker = (id: string): boolean => {
  const initialLength = workers.length;
  workers = workers.filter(worker => worker.id !== id);
  saveWorkers();
  return workers.length !== initialLength;
};

// Import multiple workers
export const importWorkers = (newWorkers: Omit<Worker, 'id' | 'avatar'>[]): Worker[] => {
  const addedWorkers: Worker[] = [];
  
  newWorkers.forEach(worker => {
    addedWorkers.push(addWorker(worker));
  });
  
  return addedWorkers;
};

// Save workers to localStorage for persistence
const saveWorkers = () => {
  try {
    localStorage.setItem('workers', JSON.stringify(workers));
  } catch (error) {
    console.error('Failed to save workers to localStorage:', error);
  }
};

// Load workers from localStorage (called on module initialization)
const loadWorkersFromStorage = () => {
  try {
    const savedWorkers = localStorage.getItem('workers');
    if (savedWorkers) {
      workers = JSON.parse(savedWorkers);
    }
  } catch (error) {
    console.error('Failed to load workers from localStorage:', error);
  }
};

// Initialize by loading from localStorage
loadWorkersFromStorage();
