import { SubscriptionPlan } from "../screens/tabs/profile/subscription/SubscriptionScreen";


export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",

    name: "Basic Plan",

    description: "Perfect for beginners exploring astrology",

    price: 0,

    duration: "Forever",

    status: "Free Plan",

    isCurrent: true,

    features: [
      "Daily Horoscope Analysis",
      "Basic Kundli Analysis",
      "Unlimited Blog Reading",
      "Basic Remedy Recommendations",
      "Astrologer Recommendations",
    ],
  },

  {
    id: "premium",

    name: "Premium Plus",

    description: "For those seeking deep personal guidance",

    price: 250,

    duration: "Per Month",

    status: "Upgrade Now",

    highlight: true,

    isCurrent: false,

    features: [
      "Unlimited Calls & Chats",
      "Direct Consultation Booking",
      "Priority Access to Experts",
      "No Session Time Limits",
      "Advance Kundli Analysis",
      "Exclusive Advanced Remedies",
    ],
  },
];