export const STUDY_QUOTES = [
  "Small progress every day adds up.",
  "Focus on the next 25 minutes, not the whole exam.",
  "Your future self is taking notes right now.",
  "Deep work beats long hours.",
  "Review today so tomorrow is easier.",
  "Done with this chapter is better than perfect on no chapters.",
  "Every page read is a page you don't have to read later.",
  "Consistency beats intensity.",
  "You don't need motivation, you need a timer and a task.",
  "Study like the exam is tomorrow, rest like it's not.",
];

export function randomStudyQuote(exclude) {
  const pool = exclude ? STUDY_QUOTES.filter((q) => q !== exclude) : STUDY_QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
