import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute left-4 top-4 rounded-full hover:bg-primary/10 hover:text-primary"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
};