import React from "react";
import { Package, Award, Clock } from "lucide-react";

const CompanyHighlights = () => {
  const highlights = [
    {
      icon: <Package className="w-12 h-12 text-red-600" />,
      title: "More than 3000000 forklift parts in stock",
      description: "Our large inventory can ensure a short delivery time for each part or accessory you need."
    },
    {
      icon: <Award className="w-12 h-12 text-red-600" />,
      title: "21 years of experience in forklift industry", 
      description: "Our strong technical research and development team can guarantee the continuous updating of parts."
    },
    {
      icon: <Clock className="w-12 h-12 text-red-600" />,
      title: "Easily search for parts online 24 hours a day",
      description: "All our products carefully selected from the best manufacturers with a second-quality inspection before shipment."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            FORKLIFT PASRTS & SERVICE SUPPLIER IN CHINA
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                  {highlight.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {highlight.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyHighlights;