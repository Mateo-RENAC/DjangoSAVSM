import BarGraph from "@/components/BarGraph";

export default function Home() {
  const sampleData = [
    { name: 'January', value: 65 },
    { name: 'February', value: 59 },
    { name: 'March', value: 80 },
    { name: 'April', value: 81 },
    { name: 'May', value: 56 },
    { name: 'June', value: 55 },
    { name: 'July', value: 40 },
  ];

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
      <BarGraph data={sampleData} width="30%"/>
      <BarGraph data={sampleData} width="30%"/>
    </div>
  );
}