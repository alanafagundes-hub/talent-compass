import { useState, useEffect, useCallback } from 'react';
import type { Area } from '@/types/ats';

const STORAGE_KEY = 'ats_areas';
const CUSTOM_EVENT_NAME = 'areasUpdated';

// Initial seed data
const initialAreas: Area[] = [
  { id: "1", name: "Tech", description: "Desenvolvimento e infraestrutura", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Comercial", description: "Vendas e relacionamento", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Criação", description: "Design e produção visual", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Marketing", description: "Comunicação e growth", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "5", name: "RH", description: "Pessoas e cultura", isArchived: false, createdAt: new Date(), updatedAt: new Date() },
];

// Helper to parse dates
const parseAreaDates = (area: Area): Area => ({
  ...area,
  createdAt: new Date(area.createdAt),
  updatedAt: new Date(area.updatedAt),
});

// Load from localStorage
const loadFromStorage = (): Area[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Area[];
      return parsed.map(parseAreaDates);
    }
  } catch (error) {
    console.error('Error loading areas from storage:', error);
  }
  return initialAreas;
};

// Save to localStorage
const saveToStorage = (areas: Area[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
  } catch (error) {
    console.error('Error saving areas to storage:', error);
  }
};

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>(() => loadFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAreas(loadFromStorage());
      }
    };

    const handleCustomEvent = () => {
      setAreas(loadFromStorage());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
    };
  }, []);

  // Get all areas (non-archived by default)
  const getAreas = useCallback((includeArchived = false) => {
    return includeArchived ? areas : areas.filter(a => !a.isArchived);
  }, [areas]);

  // Get area by ID
  const getAreaById = useCallback((id: string): Area | undefined => {
    return areas.find(area => area.id === id);
  }, [areas]);

  // Create new area
  const createArea = useCallback((areaData: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>): Area => {
    const newArea: Area = {
      ...areaData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedAreas = [...areas, newArea];
    setAreas(updatedAreas);
    saveToStorage(updatedAreas);
    
    return newArea;
  }, [areas]);

  // Update area
  const updateArea = useCallback((id: string, updates: Partial<Area>): Area | undefined => {
    let updatedArea: Area | undefined;
    
    const updatedAreas = areas.map(area => {
      if (area.id === id) {
        updatedArea = { ...area, ...updates, updatedAt: new Date() };
        return updatedArea;
      }
      return area;
    });
    
    if (updatedArea) {
      setAreas(updatedAreas);
      saveToStorage(updatedAreas);
    }
    
    return updatedArea;
  }, [areas]);

  // Toggle archive status
  const toggleArchive = useCallback((id: string): Area | undefined => {
    const area = areas.find(a => a.id === id);
    if (area) {
      return updateArea(id, { isArchived: !area.isArchived });
    }
    return undefined;
  }, [areas, updateArea]);

  return {
    areas,
    isLoading,
    getAreas,
    getAreaById,
    createArea,
    updateArea,
    toggleArchive,
  };
}

// Export for direct usage
export const getAreasFromStorage = loadFromStorage;
export const getAreaByIdFromStorage = (id: string): Area | undefined => {
  const areas = loadFromStorage();
  return areas.find(area => area.id === id);
};
