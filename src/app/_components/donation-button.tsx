"use client";
import { useState, useEffect } from 'react';
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from "@clerk/nextjs";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function DonationButton() {
  const [amount, setAmount] = useState(5);
  const [siteUrl, setSiteUrl] = useState('');
  const createDonationSession = useAction(api.functions.createDonationSession);
  const { userId } = useAuth();

  useEffect(() => {
    // Determine the correct URL
    const url = process.env.NEXT_PUBLIC_SITE_URL || 
                (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    setSiteUrl(url);
  }, []);


  const handleDonation = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    const stripe = await stripePromise;
    try {
        const { sessionId } = await createDonationSession({ amount, userId, siteUrl });
        
        const result = await stripe!.redirectToCheckout({
          sessionId: sessionId,
        });
        
        if (result.error) {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error creating donation session:", error);
      }
    };
  
    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold">Support GoalGetter</h3>
        <p>Help us keep GoalGetter running by making a donation!</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded p-2 w-24 text-center"
          min="1"
        />
        <button
          onClick={handleDonation}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Donate ${amount}
        </button>
      </div>
    );
  }