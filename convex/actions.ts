import {action} from "./_generated/server";
import {v} from "convex/values";
import OpenAI from "openai";
import{internal} from "./_generated/api";
import {requireUser} from "./helper";

const openai = new OpenAI({
     baseURL: "https://openrouter.ai/api/v1",
     apiKey : process.env.OPENROUTER_API_KEY
    })
export const generateTodos = action({
    args: {
        prompt: v.string(),
    },
    handler: async(ctx,args)=>{
        const user = await requireUser(ctx);
        const reponse = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "generate to-dos based on the given prompt. Please include a title and description.Please return a json object in the following format: { todos: [{ title: string, description: string }] } "
                },
                {
                    role: "user",
                    content:`Prompt: ${args.prompt}`
                }
            ],
            response_format: {type: "json_object"}
        });
        const content = JSON.parse(reponse.choices[0].message.content!) as {
            todos: {title: string, description: string}[]};
        await ctx.runMutation(internal.functions.createManyTodos,{
            todos: content.todos,
            userID: user.tokenIdentifier
        });
        return content.todos;
    }
    
})