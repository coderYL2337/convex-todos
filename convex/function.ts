import { query } from "./_generated/server";
export const listTodos = query(
    {handler: async (ctx) => {
        return await ctx.db.query("todos").collect();
    }}
)