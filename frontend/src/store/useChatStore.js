import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
  const { selectedUser } = get();
  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );

    set((state) => ({
      messages: [...state.messages, res.data.newMessage],
    }));
  } catch (error) {
    toast.error(error.response.data.message);
  }
},


  subscribeToMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const isConversationMessage =
      newMessage.senderId === selectedUser._id ||
      newMessage.receiverId === selectedUser._id;

    if (!isConversationMessage) return;

    set({
      messages: [...get().messages, newMessage],
    });
  });
},


  unsubscribeFromMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.off("newMessage");
},


  setSelectedUser: (selectedUser) => 
  set({ selectedUser, messages: [] }),

}));