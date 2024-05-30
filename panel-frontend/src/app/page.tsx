"use client";

import React from 'react';
import ProductTable from '../components/ProductTable';
import Link from "next/link";

export default function HomePage() {
  return (
      <>
          <ul>
              <li>
                  <Link href="/">Home</Link>
              </li>
              <li>
                  <Link href="/panel-frontend/src/pages/Dashboard"> Dashboard acess </Link>
              </li>
          </ul>
          <div>
              <h1>Product List</h1>
              <ProductTable/>
          </div>
      </>
  );
}