import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const CompanyProfile = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            COMPANY PROFILE
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <div className="relative">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative aspect-video bg-gray-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop)` 
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={handleVideoToggle}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {isPlaying && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-lg mb-4">Company Introduction Video</div>
                      <Button
                        variant="outline"
                        onClick={handleVideoToggle}
                        className="border-white text-white hover:bg-white hover:text-black"
                      >
                        Close Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Company Description */}
          <div className="space-y-6">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Headquartered in Guangzhou, China, Bilal-parts Co., Ltd. is an in-plant logistics equipment operation management company based on IoT innovation and digital driving. comprehensive service provider for forklift rentals, sales, repairs & parts, as well as a global one-stop service provider specializing in forklift parts development and sales.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Headquartered in Guangzhou, China, Bilal-Parts Co., Ltd. is an in-plant logistics equipment operation management company based on IoT innovation and digital driving. sales, repairs & parts, as well as a global one-stop service provider specializing in forklift parts development and sales.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 border-red-200 hover:border-red-600 transition-colors">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-red-600 mb-2">3,000,000+</div>
                  <div className="text-gray-600">Parts in Stock</div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-red-200 hover:border-red-600 transition-colors">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-red-600 mb-2">150+</div>
                  <div className="text-gray-600">Countries Served</div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-red-200 hover:border-red-600 transition-colors">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-red-600 mb-2">21</div>
                  <div className="text-gray-600">Years Experience</div>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 border-red-200 hover:border-red-600 transition-colors">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-red-600 mb-2">100+</div>
                  <div className="text-gray-600">Domestic Outlets</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                Read more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;