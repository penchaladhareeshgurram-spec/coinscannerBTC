import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto my-16 px-5 animate-in fade-in zoom-in duration-500">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-slate-500 mb-6">This page is coming soon. Please check back later.</p>
      <Link to="/">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go Home</Button>
      </Link>
    </div>
  );
}
