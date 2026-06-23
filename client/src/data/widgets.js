import BudgetCard from "../components/BudgetCard";
import ReminderCard from "../components/ReminderCard";
import MiniCalendar from "../components/MiniCalendar";
import TodoList from "../components/TodoList";

export const WIDGETS = {
  budget: { title: "Budget Management", component: BudgetCard },
  reminders: { title: "Reminders", component: ReminderCard },
  calendar: { title: "Calendar", component: MiniCalendar },
  todos: { title: "To-Do List", component: TodoList },
};

export const DEFAULT_LAYOUT = {
  left: ["budget", "reminders"],
  right: ["calendar", "todos"],
  hidden: [],
  notepadSize: "normal",
};
