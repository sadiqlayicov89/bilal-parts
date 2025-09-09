import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Award, Users, Globe, Clock } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const CompanyPage = () => {
  const milestones = [
    { year: "2007", event: "Company established in Guangzhou, China" },
    { year: "2010", event: "Expanded to 50+ domestic outlets" },
    { year: "2015", event: "Reached international markets in 100+ countries" },
    { year: "2020", event: "Achieved 3,000,000+ parts inventory" },
    { year: "2025", event: "150+ countries and regions worldwide" }
  ];

  const achievements = [
    {
      icon: <Globe className="w-8 h-8 text-red-600" />,
      title: "Global Presence",
      description: "Business in 150+ countries and regions worldwide"
    },
    {
      icon: <Users className="w-8 h-8 text-red-600" />,
      title: "Domestic Network",
      description: "100+ domestic outlets across China"
    },
    {
      icon: <Clock className="w-8 h-8 text-red-600" />,
      title: "Experience",
      description: "21 years of expertise in forklift industry"
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: "Quality Assurance",
      description: "ISO certified manufacturing and quality control"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-red-600 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            ABOUT BILAL-PARTS CO.,LTD
          </h1>
          <p className="text-sm md:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto">
            Leading logistics equipment operation management company based on IoT innovation and digital driving
          </p>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Our Story</h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                Headquartered in Guangzhou, China, Folangsi Co., Ltd. was established in 2007 and has grown to become an industry leader in forklift parts and logistics equipment solutions. We are an in-plant logistics equipment operation management company based on IoT innovation and digital driving.
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                As a comprehensive service provider for forklift rentals, sales, repairs & parts, we specialize in forklift parts development and sales with a global one-stop service approach. Our commitment to quality and innovation has made us a trusted partner for businesses worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-3 md:mb-4">
                      {achievement.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">{achievement.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-8 md:py-16 bg-gray-50" id="companyhistory">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Company History</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-600"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center mb-6 md:mb-8">
                  <div className="w-full md:w-1/2 md:pr-8">
                    <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <h3 className="text-xl md:text-2xl font-bold text-red-600 mb-2">{milestone.year}</h3>
                        <p className="text-sm md:text-base text-gray-700">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:block w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chairman Message */}
      <section className="py-16" id="messagefromchairman">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Message from Chairman</h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <blockquote className="text-lg italic text-gray-700 mb-6">
                "At Folangsi, we believe in building lasting partnerships through quality products and exceptional service. Our 21 years of experience have taught us that success comes from understanding our customers' needs and delivering solutions that exceed expectations."
              </blockquote>
              <cite className="text-gray-600 font-medium">Chairman, Folangsi Co., Ltd.</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Company Honor */}
      <section className="py-16 bg-gray-50" id="companyhonor">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Company Honor</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "ISO 9001:2015 Quality Management System",
              "Outstanding Enterprise Award 2024",
              "Excellence in Customer Service 2023",
              "Innovation Leadership Award 2022",
              "Best Supplier Award 2021",
              "Environmental Responsibility Certificate"
            ].map((honor, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800">{honor}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyPage;