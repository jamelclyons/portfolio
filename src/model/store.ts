import { configureStore } from '@reduxjs/toolkit';

import { contentSlice } from '@the7ofdiamonds/ui-ux';

import { aboutSlice, contactSlice } from '@the7ofdiamonds/communications';

import {
  addSlice,
  portfolioSlice,
  projectSlice,
  githubSlice,
  gitLabSlice,
  userSlice,
  accountSlice,
  updateSlice,
  organizationSlice,
  databaseSlice,
  skillsSlice,
} from '@the7ofdiamonds/portfolio';

import { authSlice, loginSlice } from '@the7ofdiamonds/gateway';

export const store = configureStore({
  reducer: {
    about: aboutSlice.reducer,
    add: addSlice.reducer,
    contact: contactSlice.reducer,
    content: contentSlice.reducer,
    portfolio: portfolioSlice.reducer,
    project: projectSlice.reducer,
    github: githubSlice.reducer,
    gitLab: gitLabSlice.reducer,
    update: updateSlice.reducer,
    user: userSlice.reducer,
    auth: authSlice.reducer,
    login: loginSlice.reducer,
    database: databaseSlice.reducer,
    organization: organizationSlice.reducer,
    account: accountSlice.reducer,
    skills: skillsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
