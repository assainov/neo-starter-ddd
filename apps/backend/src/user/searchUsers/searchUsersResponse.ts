import { z } from "zod";
import userDtoSchema from "../userDtos/userDtoSchema";

const searchUsersResponseSchema = userDtoSchema.array();

export type SearchUsersResponse = z.infer<typeof searchUsersResponseSchema>;
export default searchUsersResponseSchema;