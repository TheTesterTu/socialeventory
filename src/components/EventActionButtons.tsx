import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { EventSocialActions } from "./EventSocialActions";

interface EventActionButtonsProps {
  eventId: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export const EventActionButtons = ({ eventId, likes, comments, isLiked }: EventActionButtonsProps) => {
  return (
    <div className="flex justify-between items-center">
      <EventSocialActions 
        eventId={eventId} 
        likes={likes} 
        comments={comments}
        isLiked={isLiked}
      />
      <Link to={`/event/${eventId}`}>
        <Button variant="secondary">
          View Details
        </Button>
      </Link>
    </div>
  );
};