import SavingsGoal from "../models/SavingsGoal.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(SavingsGoal, ["name", "targetAmount", "currentAmount", "targetDate"]);
