// utils/breadcrumbs.js
import { useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
  '/': 'Home',
  '/graphboard': 'Graphboard',
  '/ListBoard': 'ListBoard',
  '/about': 'About',
  '/contact': 'Contact',
};

const useBreadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = [];
  const pathnames = location.pathname.split('/').filter((x) => x);

  pathnames.reduce((prev, curr) => {
    const path = `${prev}/${curr}`;
    const breadcrumb = {
      label: breadcrumbNameMap[path] || curr,
      href: path
    };
    breadcrumbs.push(breadcrumb);
    return path;
  }, '');

  // Add the home route
  breadcrumbs.unshift({
    label: breadcrumbNameMap['/'],
    href: '/'
  });

  return breadcrumbs;
};

export default useBreadcrumbs;