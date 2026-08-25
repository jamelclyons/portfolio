import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Visibility, MessageType } from '@the7ofdiamonds/ui-ux';
import { Modal, StatusBar, Section } from '@the7ofdiamonds/ui-ux';

import { LoadingComponent, ContentComponent, RepoContentQuery, Organizations } from '@the7ofdiamonds/ui-ux';
import { User, Skills, Portfolio } from '@the7ofdiamonds/ui-ux';
import { UserComponent, StatsComponent, StatsBarComponent, StatsProjectsButton, StatsSkillsButton, UserStoryButton, UserResumeButton } from '@the7ofdiamonds/communications';
import { SkillsComponent, OrganizationsComponent } from '@the7ofdiamonds/portfolio';
import { getRepoFile } from '@the7ofdiamonds/portfolio';
import { Locations } from '@the7ofdiamonds/locations';
import { OfficeHoursComponent } from '@the7ofdiamonds/schedule';

import { useAppDispatch, useAppSelector } from '@/model/hooks';

interface AboutProps {
  user: User;
  skills: Skills | null;
  portfolio: Portfolio | null;
}

const About: React.FC<AboutProps> = ({ user, skills, portfolio }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

const { githubLoading, githubLoadingMessage, githubErrorMessage } = useAppSelector((state) => state.github);
  const { gitLabLoading, gitLabLoadingMessage, gitLabErrorMessage } = useAppSelector((state) => state.gitLab);
  const { userLoading, userLoadingMessage, userErrorMessage } = useAppSelector((state) => state.user);

  const [documentTitle, setDocumentTitle] = useState<string | null>('About');
  const [hasStory, setHasStory] = useState<boolean>(true);
  const [repoContentQuery, setRepoContentQuery] = useState<RepoContentQuery | null>(null);
  const [organizations, setOrganizations] = useState<Organizations | null>(null);

  const [showStatusBar, setShowStatusBar] = useState<Visibility>('show');
  const [messageType, setMessageType] = useState<MessageType>('info');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  useEffect(() => {
    if (user && user?.name) {
      setDocumentTitle(`About - ${user.name}`);
    }
  }, [user?.name]);

  useEffect(() => {
    const storyElement = document.getElementById('story');
    if (user?.story || storyElement || repoContentQuery) {
      setHasStory(storyElement)
    }
  }, [user?.story]);

  useEffect(() => {
    if (user?.login) {
      setRepoContentQuery(new RepoContentQuery(user.login, user.login, 'story.md', ''))
    }
  }, [user?.login]);

  useEffect(() => {
    if (user?.organizations) {
      setOrganizations(user.organizations)
    }
  }, [user]);

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

  const handleProjects = () => {
    navigate('/portfolio')
  };

  const handleSkills = () => {
    const skillsElement = document.getElementById('skills');

    if (skillsElement) {
      skillsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStory = () => {
    const storyElement = document.getElementById('story');

    if (storyElement) {
      storyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResume = () => {
    navigate('/resume');
  };

  return (
    <Section>
      <UserComponent user={user} />

      <StatsComponent>
        <StatsBarComponent>
          {hasStory && <UserStoryButton user={user} handleClick={handleStory} />}

          <StatsProjectsButton portfolio={portfolio} handleClick={handleProjects} />

          <StatsSkillsButton skills={skills} handleClick={handleSkills} />

          <UserResumeButton user={user} handleClick={handleResume} />
        </StatsBarComponent>
      </StatsComponent>

      {repoContentQuery ?
        <ContentComponent id={'story'} title={'story'} query={repoContentQuery} dispatch={dispatch} getFile={getRepoFile} />
        : <LoadingComponent page='Story' />}

      {skills && <SkillsComponent skills={skills} />}

      {/* {officeHours && <OfficeHoursComponent officeHours={officeHours} title={null} />} */}

      <Locations />

      {organizations && <OrganizationsComponent organizations={organizations} />}

      <Modal show={showStatusBar} messageType={messageType}>
        <StatusBar show={showStatusBar} messageType={messageType} message={message} />
      </Modal>
    </Section>
  );
};

export default About;
