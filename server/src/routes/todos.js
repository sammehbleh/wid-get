import Todo from "../models/Todo.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Todo, ["text", "priority", "done"]);
