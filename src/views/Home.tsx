import React, { useEffect, useState } from 'react';

import type { Portfolio, User, Skills } from '@the7ofdiamonds/ui-ux';
import { StatusBar, Section } from '@the7ofdiamonds/ui-ux';
import { ContactComponent, UserIntroductionComponent, UserKnowledgeComponent } from '@the7ofdiamonds/communications';
import { PortfolioComponent } from '@the7ofdiamonds/portfolio';

import { useAppDispatch, useAppSelector } from '@/model/hooks';

interface HomeProps {
  user: User;
  portfolio: Portfolio | null;
  skills: Skills | null;
}

const Home: React.FC<HomeProps> = ({ user, portfolio, skills }) => {
  const dispatch = useAppDispatch();

  const { githubLoading, githubLoadingMessage } = useAppSelector((state) => state.github);
  const { gitLabLoading, gitLabLoadingMessage } = useAppSelector((state) => state.gitLab);
  const { userLoading, userLoadingMessage } = useAppSelector((state) => state.user);

  const [showStatusBar, setShowStatusBar] = useState<'show' | 'hide'>('hide');
  const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user?.name) {
      document.title = user.name;
    }
  }, [user?.name]);

  useEffect(() => {
    if (userLoading || githubLoading || gitLabLoading) {
      setShowStatusBar('show')
      setMessageType('info');
    }
  }, [userLoading, githubLoading, gitLabLoading]);

  useEffect(() => {
    if (!userLoadingMessage || !githubLoadingMessage || !gitLabLoadingMessage) {
      setMessage(null);
    }
  }, [userLoadingMessage, githubLoadingMessage, gitLabLoadingMessage]);

  useEffect(() => {
    if (userLoadingMessage) {
      setMessage(userLoadingMessage);
    }

    if (githubLoadingMessage) {
      setMessage(githubLoadingMessage);
    }

    if (gitLabLoadingMessage) {
      setMessage(gitLabLoadingMessage);
    }
  }, [userLoadingMessage, githubLoadingMessage, gitLabLoadingMessage]);

  return (
    <Section>
      <UserIntroductionComponent user={user} />

      <UserKnowledgeComponent skills={skills} />

      <PortfolioComponent portfolio={portfolio} skills={skills} />

      <ContactComponent title={null} dispatch={dispatch} />

      {showStatusBar && message && <StatusBar show={showStatusBar} messageType={messageType} message={message} />}
    </Section>
  );
}

export default Home;
