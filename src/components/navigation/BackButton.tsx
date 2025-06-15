
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed left-4 top-24 z-50 rounded-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-lg transition-all duration-300 hover:scale-105"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
};
