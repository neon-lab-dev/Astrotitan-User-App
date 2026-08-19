import { IconName } from "../assets/svg";


type Intent = {
  id: string;
  title: string;
  icon: IconName;
};

export const INTENTS: Intent[] = [
  {
    id: "career",
    title: "Career Growth",
    icon: "BriefcaseIcon",
  },
  {
    id: "love",
    title: "Love & Relationship",
    icon: "HeartIcon",
  },
  {
    id: "marriage",
    title: "Marriage",
    icon: "MarriageIcon",
  },
  {
    id: "finance",
    title: "Wealth & Finance",
    icon: "StarIcon",
  },
  {
    id: "health",
    title: "Health & Wellness",
    icon: "WellnessIcon",
  },
  {
    id: "education",
    title: "Education",
    icon: "BookIcon",
  },
];
