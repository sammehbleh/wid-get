import BudgetLimit from "../models/BudgetLimit.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(BudgetLimit, ["category", "limit"]);
