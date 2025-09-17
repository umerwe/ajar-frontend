import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
  Smartphone,
  CreditCard,
  Settings,
  Lock,
  Headphones,
} from "lucide-react";

export interface HelpCategory {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const helpCategories: HelpCategory[] = [
  {
    icon: HelpCircle,
    title: "Getting started",
    description:
      "Learn how to set up and use the platform for the first time with ease.",
  },
  {
    icon: Smartphone,
    title: "Desktop and mobile apps",
    description:
      "Explore how to use our apps across devices for maximum productivity.",
  },
  {
    icon: CreditCard,
    title: "Payments and billing",
    description:
      "Understand billing cycles, manage subscriptions, and payment methods.",
  },
  {
    icon: Settings,
    title: "Troubleshooting",
    description:
      "Fix common issues and find helpful resources for technical problems.",
  },
  {
    icon: Lock,
    title: "Login & Password",
    description:
      "Get help with logging in, resetting your password, and account security.",
  },
  {
    icon: Headphones,
    title: "Support",
    description:
      "Need help? Contact support or explore answers to frequently asked questions.",
  },
];
