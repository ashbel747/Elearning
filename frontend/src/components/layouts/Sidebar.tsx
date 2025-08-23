import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import clsx from "clsx";
import DirectEdLogo from "../../assets/image.webp"

const studentLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Browse Courses", path: "/courses" },
  { name: "My Courses", path: "/my-courses" },
  { name: "Take Quiz", path: "/quiz/:lessonId" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
  { name: "AI Assistant", path: "/assistant" },
];

const instructorLinks = [
  { name: "Dashboard", path: "/instructor/dashboard" },
  { name: "My Courses", path: "/instructor/courses" },
  { name: "Create Course", path: "/instructor/courses/new" },
  { name: "Notifications", path: "/notifications" },
  { name: "Student Analytics", path: "/analytics" },
  { name: "Create Quiz", path: "/quiz" }, 
  { name: "View Quizzes", path: "/view-quiz/:lessonId" },
  { name: "Profile", path: "/profile" },
  { name: "AI Assistant", path: "/assistant" },
];

export const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const links = user?.role === "instructor" ? instructorLinks : studentLinks;

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full w-64 bg-amber-200 dark:bg-gray-900 shadow-lg transform transition-transform z-50",
        { "-translate-x-full": !isOpen, "translate-x-0": isOpen }
      )}
      role="navigation"
    >
      {/* Close button (visible only on mobile) */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="p-2 rounded-lg text-gray-800 dark:text-gray-100"
        >
          <X size={24}/>
        </button>
      </div>

      <nav className="p-4 space-y-2">
        <div className="bg-black/5 p-1 rounded inline-block">
          <img 
            src={DirectEdLogo}
            alt="DirectEd Logo"
            className="w-32 mb-4"
            />
        </div>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-50"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};