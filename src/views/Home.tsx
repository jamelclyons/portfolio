import React, { useEffect, useState } from 'react';

import type { Visibility, MessageType } from '@the7ofdiamonds/ui-ux';

import type { Portfolio, User, Skills } from '@the7ofdiamonds/ui-ux';
import { Modal, StatusBar, Section } from '@the7ofdiamonds/ui-ux';
import { UserIntroductionComponent, UserKnowledgeComponent } from '@the7ofdiamonds/communications';
import { PortfolioComponent } from '@the7ofdiamonds/portfolio';

import { useAppSelector } from '@/model/hooks';

interface HomeProps {
  user: User;
  portfolio: Portfolio | null;
  skills: Skills | null;
}

const Home: React.FC<HomeProps> = ({ user, portfolio, skills }) => {
  const { githubLoading, githubLoadingMessage, githubErrorMessage } = useAppSelector((state) => state.github);
  const { gitLabLoading, gitLabLoadingMessage, gitLabErrorMessage } = useAppSelector((state) => state.gitLab);
  const { userLoading, userLoadingMessage, userErrorMessage } = useAppSelector((state) => state.user);

  const [showStatusBar, setShowStatusBar] = useState<Visibility>('show');
  const [messageType, setMessageType] = useState<MessageType>('info');
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
      setMessageType('info');
    }
  }, [userLoading, githubLoading, gitLabLoading]);

  useEffect(() => {
    if (userLoadingMessage || githubLoadingMessage || gitLabLoadingMessage) {
      setShowStatusBar('show')
      if (userLoadingMessage) setMessage(userLoadingMessage);
      if (githubLoadingMessage) setMessage(githubLoadingMessage);
      if (gitLabLoadingMessage) setMessage(gitLabLoadingMessage);
    } else {
      setMessage(null);
      setShowStatusBar('hide')
    }
  }, [userLoadingMessage, githubLoadingMessage, gitLabLoadingMessage]);

  useEffect(() => {
    if (userErrorMessage || githubErrorMessage || gitLabErrorMessage) {
      setShowStatusBar('show')
      if (userErrorMessage) setMessage(userErrorMessage);
      if (githubErrorMessage) setMessage(githubErrorMessage);
      if (gitLabErrorMessage) setMessage(gitLabErrorMessage);
    } else {
      setMessage(null);
      setShowStatusBar('hide')
    }
  }, [userErrorMessage, githubErrorMessage, gitLabErrorMessage]);

  return (
    <Section>
      <UserIntroductionComponent user={user} />

      <UserKnowledgeComponent skills={skills} />

      <PortfolioComponent portfolio={portfolio} />

      <Modal show={showStatusBar} messageType={messageType}>
        <StatusBar show={showStatusBar} messageType={messageType} message={message} />
      </Modal>
    </Section>
  );
}

export default Home;
