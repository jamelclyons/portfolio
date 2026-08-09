import { Link, SiteMap, Menu } from '@the7ofdiamonds/ui-ux';

export const aboutPage = new Link();
aboutPage.setHref('/about');
aboutPage.setText('About');

export const portfolioPage = new Link();
portfolioPage.setHref('/portfolio');
portfolioPage.setText('Portfolio');

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
siteMap.setInfo([aboutPage, portfolioPage, resumePage]);
siteMap.setCommunication([contactPage]);