import Note from "../models/Note.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Note, ["title", "content", "category"]);
