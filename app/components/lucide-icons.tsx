// Centralized Lucide icons for program types
import {
  Home,
  Stethoscope,
  Sun,
  Accessibility,
  Building2,
  Baby,
  HomeIcon,
  Hospital,
  HeartPulse,
  HeartHandshake
} from "lucide-react";

export const programTypeIcons: { [key: string]: React.ReactNode } = {
  "Group Home For Children": <Home className="w-5 h-5" />,
  "Non-Medical Home Care Agency": <Stethoscope className="w-5 h-5" />,
  "Adult Day Care Program": <Sun className="w-5 h-5" />,
  "Adult Developmental Home": <Accessibility className="w-5 h-5" />,
  "Assisted Living Facility": <Building2 className="w-5 h-5" />,
  "Child Care Facility": <Baby className="w-5 h-5" />,
  "Group Home For Developmental Disabilities": <HomeIcon className="w-5 h-5" />,
  "Nursing Care Institution": <Hospital className="w-5 h-5" />,
  "Home Health Agency": <HeartPulse className="w-5 h-5" />,
  "Hospice Program": <HeartHandshake className="w-5 h-5" />
};
