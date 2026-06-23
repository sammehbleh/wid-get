import Account from "../models/Account.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Account, ["bankName", "balance"]);
