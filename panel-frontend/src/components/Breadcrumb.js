// components/Breadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from '@/utils/breadcrumbs';

const Breadcrumb = ({ separator }) => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index} className="breadcrumb-item">
          <Link to={breadcrumb.href} className="breadcrumb-link">
            {breadcrumb.label}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <span className="breadcrumb-separator">{separator}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;