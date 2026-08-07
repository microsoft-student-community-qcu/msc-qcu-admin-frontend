import { create } from "zustand";
import { persist } from "zustand/middleware";


interface FilterState {
  // Applications page filters
  applicantsSearch: string;
  applicantsSubmittedSearch: string;
  applicantsTab: string; // FilterTab
  applicantsOffices: string[];

  // Members page filters
  membersSearch: string;
  membersSubmittedSearch: string;
  membersDept: string;

  // Actions
  setApplicantsSearch: (search: string) => void;
  setApplicantsSubmittedSearch: (search: string) => void;
  setApplicantsTab: (tab: string) => void;
  setApplicantsOffices: (offices: string[]) => void;

  setMembersSearch: (search: string) => void;
  setMembersSubmittedSearch: (search: string) => void;
  setMembersDept: (dept: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // Initial states
      applicantsSearch: "",
      applicantsSubmittedSearch: "",
      applicantsTab: "ALL",
      applicantsOffices: [],

      membersSearch: "",
      membersSubmittedSearch: "",
      membersDept: "ALL",

      // Setters
      setApplicantsSearch: (search) => set({ applicantsSearch: search }),
      setApplicantsSubmittedSearch: (search) => set({ applicantsSubmittedSearch: search }),
      setApplicantsTab: (tab) => set({ applicantsTab: tab }),
      setApplicantsOffices: (offices) => set({ applicantsOffices: offices }),

      setMembersSearch: (search) => set({ membersSearch: search }),
      setMembersSubmittedSearch: (search) => set({ membersSubmittedSearch: search }),
      setMembersDept: (dept) => set({ membersDept: dept }),
    }),
    {
      name: "msc-qcu-filters", // unique name for localStorage key
    }
  )
);
