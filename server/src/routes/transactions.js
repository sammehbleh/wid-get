import Transaction from "../models/Transaction.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Transaction, [
  "date",
  "category",
  "description",
  "income",
  "expense",
  "paymentSource",
  "notes",
]);
