import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const NewsSection = () => {
  const news = [
    {
      date: "04-23",
      title: "Folangsi Co., Ltd. participated in the 137th Canton Fair",
      excerpt: "On April 15, 2025, the 137th China Import and Export Fair (Canton Fair) opened grandly in Guangzhou. As an important window for China's opening up and a key platform for foreign trade, this Canton Fair attracted global attention with its innovative and vigorous momentum.",
      link: "/news/23096.html",
      category: "Company News"
    },
    {
      date: "03-22", 
      title: "Charming Phuket,Encountering a Tropical Paradise--2025 Folangsi International Business Center Phuket Tour",
      excerpt: "One person can walk fast,two people can walk leisurely,but a group of people can go further.With the concerted efforts of all departments, the Folangsi International Business Center exceeded the group's targets again.Therefore,the team traveled together to Phuket,Thailand to experience different customs and cultures and breathe the air of freedom.",
      link: "/news/23095.html",
      category: "Company Trip"
    },
    {
      date: "01-14",
      title: "Striving for the forefront and taking advantage of the momentum - Folangsi 2024 summary,commendation and 2025 New Years",
      excerpt: "On January 11, 2025, the 2024 Summary and Commendation Meeting of Folangsi Co., Ltd. and the 2025 New Year Party with the theme of \"Striving for the Forefront and Taking Advantage of the Trend\" were successfully held in Hefei,Anhui Province.",
      link: "/news/23094.html",
      category: "Company Events"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            LATEST NEWS
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-red-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{article.date}</span>
                    </div>
                    <Badge variant="outline" className="border-red-200 text-red-600">
                      {article.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                      onClick={() => window.open(article.link, '_blank')}
                    >
                      Read more <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-1 bg-gradient-to-r from-red-600 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8"
          >
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;