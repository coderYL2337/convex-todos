import {action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {requireUser} from "./helper"
import { stripe } from "./stripe";

export const listTodos = query(
    {handler: async (ctx) => {
        const user = await requireUser(ctx);
        return await ctx.db.query("todos")
        .withIndex("by_user_id", q=>q.eq("userID",user.tokenIdentifier))
        // .filter(q=>q.eq(q.field("userID"),user.tokenIdentifier))
        .collect();
    }}
)

export const createTodo = mutation({
    args: {
        title: v.string(),
        description: v.string()
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        await ctx.db.insert("todos", {
             title: args.title, 
             description: args.description, 
             completed: false, 
             userID:user.tokenIdentifier
            });
    },
});
export const updateTodo = mutation({
    args: {
        id: v.id("todos"),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const todo = await ctx.db.get(args.id)
        if(todo?.userID != user.tokenIdentifier){
            throw new Error("Unauthorized");
        }
         await ctx.db.patch(args.id,{
             completed: args.completed 
            });
    },
});
export const deleteTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const todo = await ctx.db.get(args.id)
        if(todo?.userID != user.tokenIdentifier){
            throw new Error("Unauthorized");
        }
        await ctx.db.delete(args.id);
    },
});
export const createManyTodos = internalMutation({
    args: {
        userID: v.string(),
        todos: v.array(v.object({
            title: v.string(),
            description: v.string()
        }))
    },
    handler: async (ctx, args) => {
        for (const todo of args.todos) {
            await ctx.db.insert("todos", {
                title: todo.title,
                description: todo.description,
                completed: false,
                userID: args.userID
            });
        }
    },
});

// export const createDonationSession = action({
//   args: {
//     amount: v.number(),
//     userId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'Donation to GoalGetter',
//             },
//             unit_amount: args.amount * 100, // Stripe uses cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/donation-success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
//       client_reference_id: args.userId,
//     });

//     return { sessionId: session.id };
//   },
// });

// Define the type for createDonationSession arguments
type CreateDonationSessionArgs = {
  amount: number;
  userId: string;
  siteUrl: string;
};

export const createDonationSession = action({
  args: {
    amount: v.number(),
    userId: v.string(),
    siteUrl: v.string(),
  },
  handler: async (ctx, args: CreateDonationSessionArgs) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to GoalGetter',
            },
            unit_amount: args.amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${args.siteUrl}/donation-success`,
      cancel_url: `${args.siteUrl}`,
      client_reference_id: args.userId,
    });

    return { sessionId: session.id };
  },
});