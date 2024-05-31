import ProductTable from "@/components/ProductTable";
import List from "@/components/List";

const productColumns = [
  { field: 'count', label: 'Count' },
  { field: 'pending_count', label: 'Pending count' },
  { field: 'product', label: 'Product' }
];

export default function Home() {

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
        <List dataUrl="http://localhost:8000/panel/api/stock/" columns={productColumns} />
    </div>
  );
}