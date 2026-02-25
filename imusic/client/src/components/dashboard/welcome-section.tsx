import { useAuth } from '@/hooks/use-auth';

export default function WelcomeSection() {
  const { user } = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Hey, {user?.name}
          </h1>
          <p className="text-gray-400 mt-1">Ready to craft your next masterpiece?</p>
        </div>
        <div className="flex items-center">
          <div className="hidden sm:flex items-center mr-4">
            <span className="text-gray-400 mr-2">Free Plan</span>
            <span className="inline-block h-4 w-4 rounded-full bg-[#F472B6] animate-pulse"></span>
          </div>
          <div className="relative">
            {user?.profileImage ? (
              <img 
                src={user.profileImage}
                alt="User profile" 
                className="h-10 w-10 rounded-full border-2 border-primary"
              />
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-primary bg-[#2D2D2D] flex items-center justify-center text-white">
                {user?.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
