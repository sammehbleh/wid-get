export const TASK_CATEGORIES = [
  "Study",
  "School",
  "Assignment",
  "Reading",
  "Exam",
  "Project",
  "Work",
  "Personal",
  "Finance",
  "Health",
  "Other",
];

export const STUDY_CATEGORIES = ["Study", "School", "Assignment", "Reading", "Exam", "Project"];

export function isStudyCategory(category) {
  return STUDY_CATEGORIES.includes(category);
}

const STUDY_KEYWORDS = ["study", "assignment", "exam", "quiz", "homework", "review", "lecture"];

export function detectStudyCategory(text) {
  const lower = (text || "").toLowerCase();
  return STUDY_KEYWORDS.some((kw) => lower.includes(kw)) ? "Study" : null;
}
