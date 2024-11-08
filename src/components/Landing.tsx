import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    title: "Real-time STL Preview",
    description: "View your STL files instantly with professional-grade visualization",
    icon: "🔍"
  },
  {
    title: "Multiple Material Previews",
    description: "Preview your designs in different metals and finishes",
    icon: "💎"
  },
  {
    title: "Advanced Rendering",
    description: "Generate photorealistic renders with accurate material properties",
    icon: "✨"
  },
  {
    title: "Split Screen Comparison",
    description: "Compare technical STL view with rendered output side by side",
    icon: "⚡"
  },
  {
    title: "Professional Tools",
    description: "Access industry-standard tools for visualization",
    icon: "🛠️"
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface designed for all skill levels",
    icon: "👌"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Designer",
    company: "Design Studio",
    text: "This tool has revolutionized how I present designs. The real-time rendering is incredible!"
  },
  {
    name: "Michael Chen",
    role: "Engineer",
    company: "Tech Solutions",
    text: "Being able to see both the technical STL and rendered version side by side has improved our workflow significantly."
  },
  {
    name: "Emma Williams",
    role: "Studio Owner",
    company: "Creative Works",
    text: "An essential tool for modern design. The rendering quality is outstanding."
  }
];

export function Landing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  const handleAuthAction = () => {
    if (user) {
      navigate('/viewer');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-violet-600">JewelryViz</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-gray-600 hover:text-gray-900">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Transform Your Design Process
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Professional-grade STL visualization and rendering
            </p>
            <div className="mt-8">
              <button
                onClick={handleAuthAction}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700"
              >
                {user ? 'Go to Viewer' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Powerful Features
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What Our Users Say
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <div className="font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.company}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">© 2024 JewelryViz. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Developed by Sandeep Roy</p>
            <div className="mt-4">
              <Link to="/help" className="text-gray-300 hover:text-white">
                Help & Documentation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}