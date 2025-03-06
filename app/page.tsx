import Link from "next/link"
import { Ship, Cloud, Navigation, Anchor } from "lucide-react"
import DashboardCard from "@/components/DashboardCard"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Smart Voyage Optimization</h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Optimize sea routes for navigation, fuel efficiency, weather conditions, and safety.
              </p>
              <Link href="/route-planner">
                <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Start Planning Your Route
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50 dark:bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <DashboardCard
                title="Route Planner"
                description="Plan and optimize your sea routes based on different parameters like fuel efficiency, speed, and safety."
                icon={<Navigation className="h-8 w-8" />}
                href="/route-planner"
              />

              <DashboardCard
                title="Ship Information"
                description="Monitor your vessel's vital stats including fuel level, cargo details, and maintenance status."
                icon={<Ship className="h-8 w-8" />}
                href="/ship-info"
              />

              <DashboardCard
                title="Weather Forecasts"
                description="Access real-time weather information and 10-day forecasts for your planned routes."
                icon={<Cloud className="h-8 w-8" />}
                href="/weather-info"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Select Ports</h3>
                <p className="text-muted-foreground">
                  Choose your departure and destination ports from our comprehensive database.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Preferences</h3>
                <p className="text-muted-foreground">
                  Configure your route optimization preferences based on fuel efficiency, speed, or safety.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Optimized Route</h3>
                <p className="text-muted-foreground">
                  Receive your optimized route with detailed navigation information and weather forecasts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Smart Voyage Optimization. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

