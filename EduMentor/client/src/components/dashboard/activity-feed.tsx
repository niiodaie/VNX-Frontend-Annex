import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Video, ClipboardCheck } from "lucide-react";

interface ActivityItem {
  id: number;
  activityType: string;
  resourceId: number;
  resourceType: string;
  details: any;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  // Helper function to format activity time
  const formatTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Helper function to get activity icon
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "quiz_completed":
        return (
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary-600" />
          </div>
        );
      case "lesson_watched":
        return (
          <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
            <Video className="h-6 w-6 text-secondary-600" />
          </div>
        );
      case "homework_submitted":
        return (
          <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
            <ClipboardCheck className="h-6 w-6 text-accent-600" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-neutral-600" />
          </div>
        );
    }
  };

  // Helper function to get activity title
  const getActivityTitle = (activityType: string) => {
    switch (activityType) {
      case "quiz_completed":
        return "Quiz completed";
      case "lesson_watched":
        return "Lesson watched";
      case "homework_submitted":
        return "Homework submitted";
      case "progress_update":
        return "Progress updated";
      default:
        return "Activity completed";
    }
  };

  // Helper function to get activity description
  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.activityType) {
      case "quiz_completed":
        return `${activity.details?.resourceName || "Quiz"} - Score: ${activity.details?.score || 0}%`;
      case "lesson_watched":
        return activity.details?.resourceName || "Lesson video";
      case "homework_submitted":
        return activity.details?.name || "Homework assignment";
      case "progress_update":
        return `Course progress: ${activity.details?.percentComplete || 0}%`;
      default:
        return "Activity details";
    }
  };

  // If there are no activities, show a message
  if (!activities || activities.length === 0) {
    return (
      <div className="mt-5 text-center py-6">
        <p className="text-neutral-500 text-sm">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      {activities.map((activity) => (
        <div key={activity.id} className="relative">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.activityType)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-neutral-800">
                <span className="font-medium">{getActivityTitle(activity.activityType)}</span>
              </p>
              <p className="text-sm text-neutral-500">
                {getActivityDescription(activity)}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-6">
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          View full activity history <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default ActivityFeed;
