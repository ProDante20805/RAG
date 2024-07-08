import { create } from 'zustand';
const useGlobalStore = create((set) => ({
  all_answers: [],
  _setAnswers: (val) => {
    set({ all_answers: val });
  },

  search_query: '',
  _setSearchQuery: (val) => {
    set({ search_query: val });
  },

  active_tab: 0,
  _setActiveTab: (val) => {
    set({ active_tab: val });
  },

  //userID for Comment pages
  item_userID: '',
  _setItemUserId: (val) => {
    set({ item_userID: val });
  },
}));

export default useGlobalStore;
