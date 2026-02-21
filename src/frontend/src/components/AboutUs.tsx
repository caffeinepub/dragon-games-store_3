import { Gamepad2, Users, Clock, Shield, DollarSign, BookOpen } from 'lucide-react';

export default function AboutUs() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 border-b-2 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-black mb-4">Welcome to Dragon Games Store</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Dragon Games Store is a trusted digital gaming marketplace committed to delivering high-quality games at competitive and affordable prices 💼🎮
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-2">
              With over <span className="font-bold text-blue-600">3 years</span> of industry experience, we have proudly built a community of <span className="font-bold text-blue-600">5,600+</span> satisfied customers who rely on us for secure, smooth, and reliable purchases 🤝
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">Available Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-semibold text-black">🖥️ PC</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-semibold text-black">🎮 PlayStation 5</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-semibold text-black">🎮 PlayStation 4</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-semibold text-black">🎮 Xbox</p>
              </div>
            </div>
            <p className="text-center text-gray-700 mt-6">
              From the latest AAA releases to popular and classic titles, our catalog is designed to meet the needs of every gamer 🎯
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">✅ Why Choose Dragon Games Store?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black">Trusted by 5,600+ gamers worldwide 🌍</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black">Competitive and affordable pricing 💰</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black">Wide availability of game titles 📚</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black">Fast and secure service 🔒</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-black">24/7 Customer Support 🛎️</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 bg-blue-600 text-white rounded-lg p-6 border-2 border-blue-700">
            <p className="text-lg font-semibold">
              At Dragon Games Store, our mission is simple — to make premium gaming accessible, reliable, and affordable while maintaining professionalism and transparency ⭐
            </p>
            <p className="text-lg mt-4">
              Join thousands of satisfied gamers and experience hassle-free game purchases with us today 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
