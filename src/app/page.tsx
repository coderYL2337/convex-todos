// "use client"
// import{Authenticated, Unauthenticated, AuthLoading} from "convex/react";
// import { NewToDoForm } from "./_components/new-todo-form";
// import { ToDoList } from "./_components/to-do-list";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { GenerateTodosForm } from "./_components/generate-todos-form";


// export default function Home() {

//   return (
//     <div className="max-w-screen-md mx-auto p-4 space-y-4">
//       <Authenticated>
//         <div className="flex justify-between items-center">
//         <h1 className="text-xl font-bold">To-Do List</h1>
//         <UserButton />
//         </div>
//         <div className="space-y-8">
//           <ToDoList />
//           <GenerateTodosForm />
//           <NewToDoForm />
//         </div>
//       </Authenticated>
//       <Unauthenticated>
//         <p className="text-gray-600">Please sign in to continue</p>
//         <SignInButton>
//         <button className="p-1 bg-blue-500 text-white rounded">Sign In</button>
//         </SignInButton>
//       </Unauthenticated>
//       <AuthLoading>
//         <p>Loading...</p>
//       </AuthLoading>
//     </div>
//   )
// }

"use client"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { NewToDoForm } from "./_components/new-todo-form";
import { ToDoList } from "./_components/to-do-list";
import { SignInButton,SignUpButton, UserButton } from "@clerk/nextjs";
import { GenerateTodosForm } from "./_components/generate-todos-form";
import { DonationButton } from "./_components/donation-button";

export default function Home() {
  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-8">
      <Authenticated>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">GoalGetter</h1>
          <UserButton />
      </div>  
        <div className="space-y-8">
          <h2 className="text-xl font-bold">To-Do List</h2>
          <ToDoList />
          <GenerateTodosForm />
          <NewToDoForm />
          <DonationButton />
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-blue-600">Turn Goals into Reality with GoalGetter</h1>
          <p className="text-xl">Feeling overwhelmed by your goals? GoalGetter is your personal AI-powered goal-achievement assistant.</p>
          <ul className="text-left list-disc pl-6 space-y-2">
            <li>Set any goal, big or small</li>
            <li>Get instant, AI-generated tasks to guide you</li>
            <li>Add your own custom tasks for a personalized plan</li>
            <li>Track your progress and stay motivated</li>
            <li>Achieve more, faster, and with less stress</li>
          </ul>
          <p className="text-lg font-semibold">Start achieving your dreams today!</p>
          <SignInButton>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Sign In
            </button>
          </SignInButton>
          <span className="text-sm text-gray-600">
              No account yet? 
              <SignUpButton>
                <button className="text-blue-500 hover:underline ml-1">
                  Sign up here
                </button>
              </SignUpButton>
            </span>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <p>Loading...</p>
      </AuthLoading>
    </div>
  )
}