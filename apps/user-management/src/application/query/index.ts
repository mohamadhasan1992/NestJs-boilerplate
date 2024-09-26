import { getMeQueryHandler } from "./handler/auth/get-me-query.handler";
import { getUserByEmailQueryHandler } from "./handler/auth/get-user-by-email-query.handler";





export const QueryHandlers = [
    getMeQueryHandler,
    getUserByEmailQueryHandler
]