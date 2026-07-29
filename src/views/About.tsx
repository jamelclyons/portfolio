import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingComponent, ContentComponent, RepoContentQuery, Organizations } from '@the7ofdiamonds/ui-ux';
import { User, Section, Skills, Portfolio } from '@the7ofdiamonds/ui-ux';
import { StatsComponent, StatsBarComponent, StatsUserComponent, StatsProjectsButton, StatsSkillsButton, UserStoryButton, UserResumeButton } from '@the7ofdiamonds/communications';
import { SkillsComponent, OrganizationsComponent } from '@the7ofdiamonds/portfolio';
import { getRepoFile } from '@the7ofdiamonds/portfolio';
import { Locations } from '@the7ofdiamonds/locations';
import { OfficeHoursComponent } from '@the7ofdiamonds/schedule';

import { useAppDispatch } from '@/model/hooks';

import styles from './About.module.scss';

interface AboutProps {
  user: User;
  skills: Skills | null;
  portfolio: Portfolio | null;
}

const About: React.FC<AboutProps> = ({ user, skills, portfolio }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [documentTitle, setDocumentTitle] = useState<string | null>(null);
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [hasStory, setHasStory] = useState<boolean>(true);
  const [repoContentQuery, setRepoContentQuery] = useState<RepoContentQuery | null>(null);
  const [organizations, setOrganizations] = useState<Organizations | null>(null);

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
    if (user?.avatarURL) {
      setAvatarURL(user.avatarURL)
    }
  }, [user]);

  useEffect(() => {
    if (user?.title) {
      setTitle(user.title)
    }
  }, [user]);

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
      <StatsComponent>
        <StatsUserComponent user={user} />

        <StatsBarComponent>
          {hasStory && <UserStoryButton user={user} handleClick={handleStory} />}

          <StatsProjectsButton portfolio={portfolio} handleClick={handleProjects} />

          <StatsSkillsButton skills={skills} handleClick={handleSkills} />


          <UserResumeButton user={user} handleClick={handleResume} />
        </StatsBarComponent>
      </StatsComponent>

      {skills && <SkillsComponent skills={skills} />}

      {/* {officeHours && <OfficeHoursComponent officeHours={officeHours} title={null} />} */}

      <Locations />

      {repoContentQuery ?
        <ContentComponent id={'story'} title={'story'} query={repoContentQuery} dispatch={dispatch} getFile={getRepoFile} />
        : <LoadingComponent page='Story' />}

      {organizations && <OrganizationsComponent organizations={organizations} />}
    </Section>
  );
};

export default About;
