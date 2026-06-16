import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="text-center px-5 py-20 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <h1 className="text-7xl font-extrabold text-blue-600 m-0">404</h1>
      <h2 className="text-2xl mt-3 mb-2 font-semibold">Page Not Found</h2>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Go Home</Button>
      </Link>
    </div>
  );
}
