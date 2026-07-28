import React, { useEffect, useState } from 'react';

import { LoadingComponent, ContentComponent, RepoContentQuery, Organizations } from '@the7ofdiamonds/ui-ux';
import { User, Skills, Portfolio } from '@the7ofdiamonds/ui-ux';
import { UserPic } from '@the7ofdiamonds/communications';
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

  const [documentTitle, setDocumentTitle] = useState<string>('About');
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [repoContentQuery, setRepoContentQuery] = useState<RepoContentQuery | null>(null);
  const [organizations, setOrganizations] = useState<Organizations | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  useEffect(() => {
    if (user?.name) {
      setDocumentTitle(`About - ${user.name}`);
    }
  }, [user]);

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
    window.location.href = '/portfolio';
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
    window.location.href = '/resume';
  };

  return (
    <section className={styles.about} id='top'>
      <div className={styles.stats}>
        {(avatarURL || title) &&
          <div className={styles['stats-user']}>
            {avatarURL && <UserPic url={avatarURL} />}

            {title && <h2 className={styles.title}>{title}</h2>}
          </div>}

        <div className={styles['stats-bar']}>
          {portfolio && portfolio?.projects.size > 0 &&
            <div className={styles.badge}>
              <div className={styles['badge-number']}>
                <h5>{portfolio.projects.size}</h5>
              </div>

              <button onClick={handleProjects}>
                <h3 className="title">projects</h3>
              </button>
            </div>}

          {skills && skills?.count > 0 && <div className={styles.badge}>
            <div className={styles['badge-number']}>
              <h5>{skills.count}</h5>
            </div>

            <button onClick={handleSkills}>
              <h3 className="title">skills</h3>
            </button>
          </div>}

          {user &&
            <>
              {user?.story && <button onClick={handleStory}>
                <h3 className="title">story</h3>
              </button>}

              {user?.resume && <button onClick={handleResume}>
                <h3 className="title">resume</h3>
              </button>}
            </>}
        </div>
      </div>

      {skills && <SkillsComponent skills={skills} />}

      {/* {officeHours && <OfficeHoursComponent officeHours={officeHours} title={null} />} */}

      <Locations />

      {repoContentQuery ?
        <ContentComponent title={'story'} query={repoContentQuery} dispatch={dispatch} getFile={getRepoFile} />
        : <LoadingComponent page='Story' />}

      {organizations && <OrganizationsComponent organizations={organizations} />}
    </section>
  );
};

export default About;
