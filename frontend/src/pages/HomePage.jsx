import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import ImasonsLogo from '../components/ImasonsLogo';

export default function HomePage() {
  const { isAuthenticated, role, linkedProfileId } = useRole();

  // If already logged in, show quick-nav links instead of login prompts
  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <ImasonsLogo className="h-14 mb-6" />
        <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
          Welcome back! Choose where you'd like to go.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <Link
            to="/jobs"
            className="bg-white border-2 border-gray-200 hover:border-brand-purple rounded-xl p-6 text-center transition-all hover:shadow-lg"
          >
            <img src="/images/search-icon.png" alt="" className="h-8 w-8 object-contain mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Browse Jobs</h2>
            <p className="text-gray-500 text-sm">Search and filter job postings</p>
          </Link>
          <Link
            to="/students"
            className="bg-white border-2 border-gray-200 hover:border-brand-purple rounded-xl p-6 text-center transition-all hover:shadow-lg"
          >
            <img src="/images/group-icon.png" alt="" className="h-8 w-8 object-contain mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Browse Students</h2>
            <p className="text-gray-500 text-sm">Search the student directory</p>
          </Link>
          {role === 'student' && (
            <Link
              to={linkedProfileId ? `/student/dashboard/${linkedProfileId}` : '/student/dashboard'}
              className="bg-white border-2 border-gray-200 hover:border-brand-purple rounded-xl p-6 text-center transition-all hover:shadow-lg"
            >
              <img src="/images/graduation-cap-icon.png" alt="" className="h-8 w-8 object-contain mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">My Dashboard</h2>
              <p className="text-gray-500 text-sm">Saved jobs and analytics</p>
            </Link>
          )}
          {role === 'employer' && (
            <Link
              to={linkedProfileId ? `/employer/dashboard/${linkedProfileId}` : '/employer/dashboard'}
              className="bg-white border-2 border-gray-200 hover:border-brand-purple rounded-xl p-6 text-center transition-all hover:shadow-lg"
            >
              <img src="/images/desktop-icon.png" alt="" className="h-8 w-8 object-contain mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">My Dashboard</h2>
              <p className="text-gray-500 text-sm">Manage postings and analytics</p>
            </Link>
          )}
          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="bg-white border-2 border-gray-200 hover:border-brand-purple rounded-xl p-6 text-center transition-all hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Admin Panel</h2>
              <p className="text-gray-500 text-sm">Manage users and content</p>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Unauthenticated landing page
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <ImasonsLogo className="h-16 mb-6" />
      <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
        Connecting students and employers through the iMasons network for
        internships, mentorships, and employment opportunities.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-brand-purple text-white px-8 py-3 rounded-lg hover:bg-brand-purple-dark transition-colors font-medium text-lg"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-white border-2 border-brand-purple/30 text-brand-purple px-8 py-3 rounded-lg hover:border-brand-purple transition-colors font-medium text-lg"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
