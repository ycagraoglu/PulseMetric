
import { create } from 'zustand'

interface PaginationState {
    pageSize: number
    setPageSize: (size: number) => void
}

export const usePaginationStore = create<PaginationState>((set) => ({
    pageSize: 10,
    setPageSize: (size) => set({ pageSize: size }),
}))
