export const QUOTES = [
  "Small steps every day add up to big results.",
  "Focus on progress, not perfection.",
  "Your future is created by what you do today.",
  "Discipline is choosing what you want most over what you want now.",
  "Start where you are. Use what you have. Do what you can.",
  "Productivity is never an accident, it's a choice.",
  "One task at a time, one day at a time.",
  "Clarity comes from action, not thought.",
  "Done is better than perfect.",
  "You don't have to see the whole staircase, just take the first step.",
];

export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
