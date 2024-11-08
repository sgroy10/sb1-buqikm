import { Link } from 'react-router-dom';

const features = [
  {
    title: "Real-time STL Visualization",
    description: "Upload and instantly view your STL files with professional-grade rendering capabilities. Rotate, zoom, and inspect your designs from any angle.",
    icon: "🔍"
  },
  {
    title: "Material Preview System",
    description: "Preview your designs in various materials including Gold, White Gold, Rose Gold, and Platinum with realistic material properties and reflections.",
    icon: "💎"
  },
  {
    title: "Split Screen Comparison",
    description: "Compare technical view with rendered files side by side for accurate design validation and quality control.",
    icon: "⚡"
  }
];

const faqs = [
  {
    question: "How do I get started with JewelryViz?",
    answer: "Simply navigate to the viewer page and click 'Choose File' to upload your first STL file. You can immediately start viewing and rendering your design in different materials."
  },
  {
    question: "What file formats are supported?",
    answer: "Currently, we support STL files for 3D models. We're working on adding support for additional formats in future updates."
  },
  {
    question: "Can I customize material properties?",
    answer: "Yes, you can select from preset materials (Gold, White Gold, Rose Gold, Platinum) with professionally calibrated properties. Each material accurately simulates real-world characteristics."
  }
];

const tutorials = [
  {
    title: "Getting Started",
    steps: [
      "Navigate to the JewelryViz Viewer",
      "Upload your STL file",
      "Try different material previews",
      "Use split-screen view for comparison"
    ]
  },
  {
    title: "Using Materials",
    steps: [
      "Select your uploaded model",
      "Choose a material from the dropdown",
      "Adjust the view angle",
      "Compare different materials"
    ]
  },
  {
    title: "Split Screen Mode",
    steps: [
      "Upload your STL file",
      "Click the render button",
      "Enable split screen mode",
      "Compare technical and rendered views"
    ]
  }
];

const developerInfo = {
  name: "Sandeep Roy",
  role: "Lead Developer",
  description: "Sandeep Roy is a skilled software developer specializing in 3D visualization and jewelry design software. With extensive experience in WebGL, Three.js, and real-time rendering technologies, he created JewelryViz to revolutionize how jewelry designers visualize and present their work. His expertise in both jewelry design workflows and modern web technologies has resulted in this powerful yet user-friendly visualization tool.",
  expertise: [
    "3D Visualization",
    "Real-time Rendering",
    "WebGL & Three.js",
    "Jewelry Design Software",
    "User Experience Design"
  ]
};

export function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">JewelryViz</Link>
            </div>
            <div className="flex items-center">
              <Link to="/viewer" className="text-gray-600 hover:text-gray-900">Back to Viewer</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Developer Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Developer</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{developerInfo.name}</h3>
                  <p className="text-gray-600 mt-1">{developerInfo.role}</p>
                  <p className="text-gray-700 mt-4">{developerInfo.description}</p>
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Areas of Expertise:</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {developerInfo.expertise.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <span className="mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tutorials Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">{tutorial.title}</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {tutorial.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Support Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Our support team is available to help you with any questions or technical issues.
                Contact us through any of the following channels:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>Email: support@jewelryviz.com</li>
                <li>Live Chat: Available through the viewer</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">© 2024 JewelryViz. All rights reserved.</p>
            <p className="text-gray-400 mt-2">Developed by Sandeep Roy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}