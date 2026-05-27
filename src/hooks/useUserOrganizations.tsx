import { useMemo } from 'react';

interface Organization {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  events: number;
  followers: number;
  location?: string;
  role?: string;
}

export const useUserOrganizations = () => {
  const organizations = useMemo<Organization[]>(() => [], []);
  return { organizations, loading: false };
};
