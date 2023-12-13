import { create } from 'zustand'

type State = {}
type Action = {}

export const useStore = create<State & Action>((set) => ({
    bears: 0,
    
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
  }))