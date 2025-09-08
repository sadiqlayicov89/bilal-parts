import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: "Address",
      details: [
        "No. 999, Asian Games Avenue",
        "Shiqi Town, Panyu District",
        "Guangzhou, China"
      ]
    },
    {
      icon: <Phone className="w-6 h-6 text-red-600" />,
      title: "Phone & Fax",
      details: [
        "Tel: 0086-18520438258",
        "Fax: 0086-20-3999 3597"
      ]
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      title: "Email",
      details: [
        "admin@folangsiforklift.com"
      ]
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const offices = [
    {
      city: "Guangzhou (Headquarters)",
      address: "No. 999, Asian Games Avenue, Shiqi Town, Panyu District",
      phone: "0086-18520438258",
      email: "admin@folangsiforklift.com"
    },
    {
      city: "Shanghai Branch",
      address: "Shanghai International Trade Center",
      phone: "0086-21-5588-9900",
      email: "shanghai@folangsiforklift.com"
    },
    {
      city: "Beijing Office",
      address: "Beijing Business District",
      phone: "0086-10-8888-6666",
      email: "beijing@folangsiforklift.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CONTACT US
          </h1>
          <p className="text-xl opacity-90">
            Get in touch with our team for expert assistance
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-50 rounded-full">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Office Locations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="font-bold text-gray-800">{office.city}</h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{office.address}</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{office.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{office.email}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Find Us on Map
          </h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">Interactive Map</p>
              <p className="text-sm">No. 999, Asian Games Avenue, Guangzhou, China</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;