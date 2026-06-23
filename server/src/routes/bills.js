import Bill from "../models/Bill.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Bill, ["name", "dueDate", "amount"]);
