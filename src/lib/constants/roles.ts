import { UserIcon, Store, UserStar } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type RoleValue = "user" | "vendor" | "admin";

export interface RoleConfig {
  label: string;
  value: RoleValue;
  icon: LucideIcon;
  description?: string;
}

export const ROLES: RoleConfig[] = [
  {
    label: "User",
    value: "user",
    icon: UserIcon,
    description: "Regular user with shopping privileges",
  },
  {
    label: "Vendor",
    value: "vendor",
    icon: Store,
    description: "Seller with product management access",
  },
  {
    label: "Admin",
    value: "admin",
    icon: UserStar,
    description: "Administrator with full system access",
  },
];

// Utility function to get role config by value
export const getRoleByValue = (value: RoleValue): RoleConfig | undefined => {
  return ROLES.find((role) => role.value === value);
};

// Utility function to get role label by value
export const getRoleLabel = (value: RoleValue): string => {
  return getRoleByValue(value)?.label || value;
};

// Utility function to get role icon by value
export const getRoleIcon = (value: RoleValue): LucideIcon | undefined => {
  return getRoleByValue(value)?.icon;
};
