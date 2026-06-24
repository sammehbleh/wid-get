import Reminder from "../models/Reminder.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Reminder, ["text", "done", "category", "dueDate"]);
