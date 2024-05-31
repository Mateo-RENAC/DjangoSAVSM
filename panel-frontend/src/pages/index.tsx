import ProductTable from "@/components/ProductTable";
import List from "@/components/List";

const productColumns = [
  { field: 'name', label: 'Name' },
  { field: 'reference', label: 'Reference' },
  { field: 'user_name', label: 'User Name' },
  { field: 'stock_count', label: 'Count' }
];

export default function Home() {

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
        <List dataUrl="http://localhost:8000/panel/api/products/" columns={productColumns} />
    </div>
  );
}