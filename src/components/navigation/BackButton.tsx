
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed left-4 top-20 z-50 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-lg transition-all duration-300"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
};
