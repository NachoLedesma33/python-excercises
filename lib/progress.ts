const STORAGE_KEY = 'python-exercises-progress';

export interface Progress {
  completedExercises: string[];
  lastAccessed: string;
  startedAt: string;
}

function getDefaultProgress(): Progress {
  return {
    completedExercises: [],
    lastAccessed: '',
    startedAt: new Date().toISOString(),
  };
}

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultProgress();
    return JSON.parse(data);
  } catch {
    return getDefaultProgress();
  }
}

function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markExerciseCompleted(exerciseId: string): void {
  const progress = loadProgress();
  if (!progress.completedExercises.includes(exerciseId)) {
    progress.completedExercises.push(exerciseId);
    progress.lastAccessed = exerciseId;
    saveProgress(progress);
  }
}

export function isExerciseCompleted(exerciseId: string): boolean {
  const progress = loadProgress();
  return progress.completedExercises.includes(exerciseId);
}

export function getSectionProgress(sectionId: string, exerciseIds: string[]): { completed: number; total: number; percentage: number } {
  const progress = loadProgress();
  const completed = exerciseIds.filter(id => progress.completedExercises.includes(id)).length;
  const total = exerciseIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function getGlobalProgress(): { completed: number; total: number; percentage: number } {
  const allIds: string[] = [];
  // We need to import sectionsData but that would cause circular dependency
  // So we'll just use localStorage directly
  const progress = loadProgress();
  return {
    completed: progress.completedExercises.length,
    total: 0, // Will be set by component
    percentage: 0,
  };
}
