const STORAGE_KEY = "algorithm-visualizer-progress";

const DEFAULT_PROGRESS = {
  xp: 0,
  level: 1,
  challengesCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  bestStreak: 0,
};

export function loadProgress() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return { ...DEFAULT_PROGRESS };
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(progress)
    );
  } catch {
    // Ignore storage errors
  }
}

export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp) {
  const level = calculateLevel(xp);

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const progressXP =
    xp - currentLevelXP;

  const requiredXP =
    nextLevelXP - currentLevelXP;

  const percentage = Math.min(
    100,
    Math.max(
      0,
      (progressXP / requiredXP) * 100
    )
  );

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    progressXP,
    requiredXP,
    percentage,
  };
}

export function addChallengeResult(
  progress,
  correct,
  points = 10,
  streak = 0
) {
  const safePoints =
    Number.isFinite(points)
      ? points
      : 10;

  const newXP = correct
    ? progress.xp + safePoints
    : progress.xp;

  const newBestStreak = Math.max(
    progress.bestStreak,
    streak
  );

  return {
    ...progress,

    xp: newXP,

    level: calculateLevel(
      newXP
    ),

    challengesCompleted:
      progress.challengesCompleted +
      1,

    correctAnswers:
      progress.correctAnswers +
      (correct ? 1 : 0),

    totalAnswers:
      progress.totalAnswers + 1,

    bestStreak: newBestStreak,
  };
}

export function resetProgress() {
  const fresh = {
    ...DEFAULT_PROGRESS,
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(fresh)
    );
  } catch {
    // Ignore storage errors
  }

  return fresh;
}

export { DEFAULT_PROGRESS };