import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Link, User, Skills, ContactMethods, Portfolio, Organization, Project, Repo } from '@the7ofdiamonds/ui-ux';
import { ContactBar } from '@the7ofdiamonds/communications';
import { getAuthenticatedUserAccount, getGitLabRepos } from '@the7ofdiamonds/portfolio';

const HeaderComponent = lazy(() => import('@the7ofdiamonds/ui-ux')
  .then(mod => ({ default: mod.HeaderComponent })));
const LoadingComponent = lazy(() => import('@the7ofdiamonds/ui-ux')
  .then(mod => ({ default: mod.LoadingComponent })));
const FooterComponent = lazy(() => import('@the7ofdiamonds/ui-ux')
  .then(mod => ({ default: mod.FooterComponent })));

const Contact = lazy(() => import('@the7ofdiamonds/communications')
  .then(mod => ({ default: mod.ContactPage })));
const Resume = lazy(() => import('@the7ofdiamonds/communications')
  .then(mod => ({ default: mod.ResumePage })));
const UserPage = lazy(() => import('@the7ofdiamonds/communications')
  .then(mod => ({ default: mod.UserPage })));

const Dashboard = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.DashboardPage })));
const OrganizationPage = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.OrganizationPage })));
const PortfolioPage = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.PortfolioPage })));
const ProjectPage = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.ProjectPage })));
const ProjectsEditPage = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.PortfolioEditPage })));
const ProjectUpdate = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.ProjectEditPage })));
const Search = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.SearchPage })));
const SkillAdd = lazy(() => import('@the7ofdiamonds/portfolio')
  .then(mod => ({ default: mod.SkillAddPage })));

const About = lazy(() => import('./views/About'));
const Home = lazy(() => import('./views/Home'));
const NotFound = lazy(() => import('./views/NotFound'));
const LoginPage = lazy(() => import('./views/LoginPage'));

import ProtectedRoute from './ProtectedRoute';

import { useAppSelector, useAppDispatch } from './model/hooks';

import pkgJson from '../package.json';
const appVersion = pkgJson.version;

import userJson from '../user.json';
import skillsJson from '../skills.json';

import { leftMenu, centerMenu, rightMenu } from './Menus';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { gitLabRepos } = useAppSelector((state) => state.gitLab);
  const { authenticatedUserObject } = useAppSelector((state) => state.user);
  const { skillsObject } = useAppSelector((state) => state.skill);

  const [user, setUser] = useState<User>(new User());
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio>(new Portfolio());
  const [skills, setSkills] = useState<Skills>(new Skills);
  const [contactMethods, setContactMethods] = useState<ContactMethods | null>();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirect);
    }
  }, []);

  useEffect(() => {
    user.fromJSON(userJson);
    user.setSkills(new Skills({ list: skillsJson }));
    setUser(user)
  }, []);

  useEffect(() => {
    if (!authenticatedUserObject) {
      dispatch(getAuthenticatedUserAccount());
    }
  }, [authenticatedUserObject]);

  useEffect(() => {
    if (authenticatedUserObject) {
      const authenticatedUser = new User(authenticatedUserObject);
      authenticatedUser.fromJSON(userJson);
      authenticatedUser.setSkills(new Skills({ list: skillsJson }));
      setUser(authenticatedUser);

      if (authenticatedUser?.portfolio || authenticatedUser?.organizations) {
        if (authenticatedUser?.portfolio?.projects) {
          Array.from(authenticatedUser?.portfolio?.projects).forEach((project) => {
            setPortfolio(portfolio => {
              portfolio.projects.add(project);
              return portfolio;
            });
          })
        }

        authenticatedUser?.organizations?.list.forEach((org: Organization) => {
          if (org?.portfolio?.projects) {
            Array.from(org?.portfolio?.projects).forEach((project) => {
              setPortfolio(portfolio => {
                portfolio.projects.add(project);
                return portfolio;
              });
            })
          }
        })
      }
    }
  }, [authenticatedUserObject]);

  useEffect(() => {
    if (!gitLabRepos || gitLabRepos.length === 0) {
      dispatch(getGitLabRepos());
    }
  }, [gitLabRepos]);

  useEffect(() => {
    if (gitLabRepos && gitLabRepos.length > 0) {
      gitLabRepos.map(r => {
        const repo = new Repo();
        repo.fromGitLab(r);
        const pj = new Project();
        pj.fromRepo(repo);
        setPortfolio(portfolio => {
          portfolio.projects.add(pj);
          return portfolio;
        });
      });

    }
  }, [gitLabRepos]);
  useEffect(() => {
    if (user) {
      setAvatarURL(user.avatarURL)
    }
  }, [user]);

  useEffect(() => {
    if (avatarURL) {
      let favicon = document.getElementById("favicon");

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.setAttribute("rel", "icon");
        favicon.setAttribute("type", "image/png");
        favicon.setAttribute("id", "favicon");
        document.head.appendChild(favicon);
      }

      if (avatarURL) {
        favicon.setAttribute("href", avatarURL);
      }
    }
  }, [avatarURL]);

  useEffect(() => {
    if (skillsObject) {
      const skillsFromObject = new Skills(skillsObject)
      skills.list.push(...skillsFromObject.list)
      setSkills(skills);
    }
  }, [skillsObject]);

  useEffect(() => {
    if (user.skills) {
      setSkills(user.skills);
    }
  }, [user.skills]);

  useEffect(() => {
    if (user.contactMethods) {
      setContactMethods(user.contactMethods)
    }

    if (userJson && userJson.contact_methods) {
      const contacts = new ContactMethods(userJson.contact_methods);
      setContactMethods(contacts)
    }
  }, [user, userJson]);

  useEffect(() => {
    if (userJson && userJson.company) {
      const org = new Organization();
      org.fromJSON(userJson.company);
      setOrganization(org)
    }
  }, [userJson]);

  return (
    <>
      <BrowserRouter>
        <HeaderComponent branding={'Jamel C. Lyons'} leftMenu={leftMenu} centerMenu={centerMenu} rightMenu={rightMenu} />
        <Suspense fallback={<LoadingComponent page='' />}>
          <Routes>
            <Route path="/" element={<Home user={user} portfolio={portfolio} skills={skills} />} />
            <Route path="/about" element={<About user={user} skills={skills} portfolio={portfolio} />} />
            <Route path={`/user/${user.username}`} element={<About user={user} skills={skills} portfolio={portfolio} />} />
            <Route path="/organization/:login" element={<OrganizationPage skills={skills} organization={organization} />} />
            <Route path="/user/:login" element={<UserPage useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
            <Route path="/portfolio" element={<PortfolioPage account={user} portfolio={portfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
            <Route path="/portfolio/:owner/:projectID" element={<ProjectPage account={user} portfolio={portfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
            <Route path="/taxonomy/:taxonomy/:type/:term" element={<Search skills={skills} account={user} />} />
            <Route path="/resume" element={<Resume user={user} />} />
            <Route path="/contact" element={<Contact account={user} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/update/portfolio" element={
              <ProtectedRoute>
                <ProjectsEditPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/admin/update/project/:login/:projectID" element={
              <ProtectedRoute>
                <ProjectUpdate user={user} />
              </ProtectedRoute>
            } />

            <Route path="/admin/add/skill" element={
              <ProtectedRoute>
                <SkillAdd />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<LoginPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <FooterComponent name='Jamel C. Lyons' version={`v${appVersion}`}>
            {contactMethods && <ContactBar contactMethods={contactMethods} location={'footer'} />}
          </FooterComponent>
        </Suspense>
      </BrowserRouter >
    </>
  );
}

export default App;
