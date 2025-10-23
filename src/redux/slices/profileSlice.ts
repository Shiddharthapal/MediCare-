import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserDetails } from "@/types/userDetails";

interface ProfileState {
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  lastUpdated: string | null;
  profileCreated: boolean;
  successMessage: string | null;
}

const initialState: ProfileState = {
  isEditing: false,
  isSaving: false,
  error: null,
  lastUpdated: null,
  profileCreated: false,
  successMessage: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileStart: (state) => {
      state.isSaving = true;
      state.error = null;
      state.successMessage = null;
    },

    updateProfileSuccess: (
      state,
      action: PayloadAction<{
        userData: Partial<UserDetails>;
        isNewProfile?: boolean;
      }>
    ) => {
      const { isNewProfile } = action.payload;

      state.isSaving = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();

      // Set appropriate success message
      if (isNewProfile) {
        state.profileCreated = true;
        state.successMessage = "Profile created successfully!";
      } else {
        state.successMessage = "Profile updated successfully!";
      }

      // Exit edit mode after successful save
      state.isEditing = false;
    },

    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
      if (!action.payload) {
        state.error = null;
        state.successMessage = null;
      }
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    resetProfileState: () => initialState,
  },
});

export const {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  setEditMode,
  clearMessages,
  resetProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;
