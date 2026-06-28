import { Link, SiteMap, Menu } from '@the7ofdiamonds/ui-ux';

export const aboutPage = new Link();
aboutPage.setHref('/about');
aboutPage.setText('About');

export const portfolioPage = new Link();
portfolioPage.setHref('/portfolio');
portfolioPage.setText('Portfolio');

// export const researchArchivePage = new Link();
// researchArchivePage.setHref('/research');
// researchArchivePage.setText('Research');

// export const faqPage = new Link();
// faqPage.setHref('/faq');
// faqPage.setText('FAQ');

// export const productsPage = new Link();
// productsPage.setHref('/products');
// productsPage.setText('Products');

// export const servicesPage = new Link();
// servicesPage.setHref('/services');
// servicesPage.setText('Services');

// export const contactPage = new Link();
// contactPage.setHref('/contact');
// contactPage.setText('Contact');

// export const schedulePage = new Link();
// schedulePage.setHref('/schedule');
// schedulePage.setText('Schedule');

// export const supportPage = new Link();
// supportPage.setHref('/support');
// supportPage.setText('Support');

// export const loginPage = new Link();
// loginPage.setHref('/login');
// loginPage.setText('Login');

// export const logoutPage = new Link();
// logoutPage.setHref('/logout');
// logoutPage.setText('Logout');

// export const signupPage = new Link();
// signupPage.setHref('/signup');
// signupPage.setText('Signup');

// export const forgotPage = new Link();
// forgotPage.setHref('/forgot');
// forgotPage.setText('forgot');

// export const dashboardPage = new Link();
// dashboardPage.setHref('/dashboard');
// dashboardPage.setText('Dashboard');

const resumePage = new Link();
resumePage.setHref('/resume');
resumePage.setText('Resume');
const contactPage = new Link();
contactPage.setHref('/contact');
contactPage.setText('Contact');

export const leftMenuLinks: Array<Link> = [aboutPage, portfolioPage];
export const centerMenuLinks: Array<Link> = [
  aboutPage,
  portfolioPage,
  resumePage,
  contactPage,
];
export const rightMenuLinks: Array<Link> = [resumePage, contactPage];

export const leftMenu = new Menu();
leftMenu.setLinks(leftMenuLinks);

export const centerMenu = new Menu();
centerMenu.setLinks(centerMenuLinks);

export const rightMenu = new Menu();
rightMenu.setLinks(rightMenuLinks);

export const siteMap = new SiteMap();
siteMap.setInfo([aboutPage, portfolioPage]);
siteMap.setCommunication([contactPage]);
// siteMap.setAccount([
//   dashboardPage,
//   loginPage,
//   logoutPage,
//   signupPage,
//   forgotPage,
// ]);
// siteMap.setOffer([productsPage, servicesPage]);
