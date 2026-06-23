import Event from "../models/Event.js";
import { createCrudRouter } from "./crudFactory.js";

export default createCrudRouter(Event, ["date", "title", "time", "place"]);
