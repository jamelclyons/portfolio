import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { FooterComponent, LoadingComponent, HeaderComponent, User, Skills, ContactMethods, Portfolio, Organization } from '@the7ofdiamonds/ui-ux';
import { ContactBar, ContactPage, ResumePage, UserPage } from '@the7ofdiamonds/communications';
import { DashboardPage, OrganizationPage, PortfolioPage, ProjectPage, PortfolioEditPage, ProjectEditPage, SkillAddPage, SearchPage, getAuthenticatedUserAccount, getPortfolioFromUser } from '@the7ofdiamonds/portfolio';

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

  const { authenticatedUserObject } = useAppSelector((state) => state.user);
  const { portfolioObject, hasDetails } = useAppSelector((state) => state.portfolio);

  const [user, setUser] = useState<User>(new User());
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [portfolio, setPortfolio] = useState(null);
  const [skills, setSkills] = useState<Skills>(new Skills);
  const [contactMethods, setContactMethods] = useState<ContactMethods | null>(null);

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirect);
    }
  }, []);

  useEffect(() => {
    if (!authenticatedUserObject) {
      dispatch(getAuthenticatedUserAccount(
        { user: userJson, skills: skillsJson }
      ));
    }
  }, [authenticatedUserObject]);

  useEffect(() => {
    if (authenticatedUserObject) {
      setUser(new User(authenticatedUserObject));
    }
  }, [authenticatedUserObject]);

  useEffect(() => {
    if (user?.avatarURL) {
      let favicon = document.getElementById("favicon");

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.setAttribute("rel", "icon");
        favicon.setAttribute("type", "image/png");
        favicon.setAttribute("id", "favicon");
        document.head.appendChild(favicon);
        favicon.setAttribute("href", user.avatarURL);
      }
    }
  }, [user?.avatarURL]);

  useEffect(() => {
    if (authenticatedUserObject) {
      dispatch(getPortfolioFromUser(authenticatedUserObject))
    }
  }, [authenticatedUserObject]);

  useEffect(() => {
    if (portfolioObject) {
      setPortfolio(new Portfolio(portfolioObject))
    }
  }, [portfolioObject]);

  useEffect(() => {
    if (portfolioObject && hasDetails) {
      setPortfolio(new Portfolio(portfolioObject))
    }
  }, [hasDetails, portfolioObject]);

  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills);
    }
  }, [user?.skills]);

    useEffect(() => {
    if (user?.organizations) {
      setOrganization(user.organizations)
    }
  }, [user?.organizations]);

  useEffect(() => {
    if (user?.contactMethods) {
      setContactMethods(user.contactMethods)
    }
  }, [user?.contactMethods]);

  return (
    <BrowserRouter>
      <HeaderComponent branding={'Jamel C. Lyons'} leftMenu={leftMenu} centerMenu={centerMenu} rightMenu={rightMenu} />
      <Suspense fallback={<LoadingComponent page='' />}>
        <Routes>
          <Route path="/" element={<Home user={user} portfolio={portfolio} skills={skills} />} />
          <Route path="/about" element={<About user={user} skills={skills} portfolio={portfolio} />} />
          <Route path={`/user/${user?.username}`} element={<About user={user} skills={skills} portfolio={portfolio} />} />
          <Route path="/organization/:login" element={<OrganizationPage skills={skills} organization={organization} />} />
          <Route path="/user/:login" element={<UserPage useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/portfolio" element={<PortfolioPage account={user} portfolio={portfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/portfolio/:owner/:projectID" element={<ProjectPage account={user} portfolio={portfolio} setPortfolio={setPortfolio} skills={skills} useAppSelector={useAppSelector} useAppDispatch={useAppDispatch} />} />
          <Route path="/:taxonomy/:type/:term" element={<SearchPage account={user} portfolio={portfolio} skills={skills} />} />
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
