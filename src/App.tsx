import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { FooterComponent, LoadingComponent, HeaderComponent, User, Skills, ContactMethods, Portfolio, Organization, Project, Repo } from '@the7ofdiamonds/ui-ux';
import { ContactBar, ContactPage, ResumePage, UserPage } from '@the7ofdiamonds/communications';
import { DashboardPage, OrganizationPage, PortfolioPage, ProjectPage, PortfolioEditPage, ProjectEditPage, SkillAddPage, SearchPage, getAuthenticatedUserAccount, getGitLabRepos, getPortfolioDetails } from '@the7ofdiamonds/portfolio';

import About from './views/About';
import Home from './views/Home';
import NotFound from './views/NotFound';
import LoginPage from './views/LoginPage';

import ProtectedRoute from './ProtectedRoute';

import { useAppSelector, useAppDispatch } from './model/hooks';

import pkgJson from '../package.json';
const appVersion = pkgJson.version;

import userJson from '../user.json';
import skillsJson from '../skills.json';

import { leftMenu, centerMenu, rightMenu } from './Menus';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const portfolio = new Portfolio();

  const { gitLabRepos } = useAppSelector((state) => state.gitLab);
  const { portfolioObject } = useAppSelector((state) => state.portfolio);
  const { authenticatedUserObject } = useAppSelector((state) => state.user);
  const { skillsObject } = useAppSelector((state) => state.skill);

  const [user, setUser] = useState<User>(new User());
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [skills, setSkills] = useState<Skills>(new Skills);
  const [contactMethods, setContactMethods] = useState<ContactMethods | null>();

  const [hasDetails, setHasDetails] = useState<boolean>(false);

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
    }
  }, [authenticatedUserObject]);

  // useEffect(() => {
  //   if (!gitLabRepos || gitLabRepos.length === 0) {
  //     dispatch(getGitLabRepos());
  //   }
  // }, [gitLabRepos]);

  // useEffect(() => {
  //   if (gitLabRepos && gitLabRepos.length > 0) {
  //     gitLabRepos.map(r => {
  //       const repo = new Repo();
  //       repo.fromGitLab(r);
  //       const pj = new Project();
  //       pj.fromRepo(repo);
  //       setPortfolio(portfolio => {
  //         portfolio.projects.add(pj);
  //         return portfolio;
  //       });
  //     });

  //   }
  // }, [gitLabRepos]);

  useEffect(() => {
    if (user?.portfolio || user?.organizations) {

      if (user?.portfolio?.projects && user.portfolio.projects.size > 0) {
        portfolio.projects = new Set([...(portfolio.projects.size > 0 ? portfolio.projects : []), ...user?.portfolio?.projects]);
      }

      if (user?.organizations?.list && user.organizations.list.length > 0) {
        user.organizations.list.forEach((org: Organization) => {
          if (org?.portfolio?.projects && org.portfolio.projects.size > 0) {
            portfolio.projects = new Set([...(portfolio.projects.size > 0 ? portfolio.projects : []), ...org.portfolio.projects]);
          }
        })
      }

      user.setPortfolio(portfolio)
    }
  }, [user]);

  useEffect(() => {
    if (user?.portfolio?.projects && user.portfolio.projects.size > 0 && !hasDetails) {
      dispatch(getPortfolioDetails(user.portfolio))
      setHasDetails(true)
    }
  }, [user?.portfolio?.projects.size]);

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

  useEffect(() => {
    if (portfolioObject) {
      user.setPortfolio(new Portfolio(portfolioObject))
    }
  }, [portfolioObject]);

  return (
    <BrowserRouter>
      <HeaderComponent branding={'Jamel C. Lyons'} leftMenu={leftMenu} centerMenu={centerMenu} rightMenu={rightMenu} />
      <Suspense fallback={<LoadingComponent page='' />}>
        <Routes>
          <Route path="/" element={<Home user={user} portfolio={user.portfolio} skills={skills} />} />
          <Route path="/about" element={<About user={user} skills={skills} portfolio={portfolio} />} />
          <Route path={`/user/${user.username}`} element={<About user={user} skills={skills} portfolio={portfolio} />} />
          <Route path="/organization/:login" element={<OrganizationPage skills={skills} organization={organization} />} />
          <Route path="/user/:login" element={<UserPage useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/portfolio" element={<PortfolioPage account={user} portfolio={portfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/portfolio/:owner/:projectID" element={<ProjectPage account={user} portfolio={portfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/:taxonomy/:type/:term" element={<SearchPage skills={skills} account={user} />} />
          <Route path="/resume" element={<ResumePage user={user} />} />
          <Route path="/contact" element={<ContactPage account={user} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/update/portfolio" element={
            <ProtectedRoute>
              <PortfolioEditPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/admin/update/project/:login/:projectID" element={
            <ProtectedRoute>
              <ProjectEditPage user={user} />
            </ProtectedRoute>
          } />

          <Route path="/admin/add/skill" element={
            <ProtectedRoute>
              <SkillAddPage />
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
  );
}

export default App;
