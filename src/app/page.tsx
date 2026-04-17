'use client';

import Link from 'next/link';
import { useState } from 'react';

const charities = [
  {
    id: '1',
    name: 'Golf Foundation for Youth',
    description: 'Dedicated to introducing golf to underprivileged youth through education, equipment donations, and mentorship programs.',
    image: 'https://images.unsplash.com/photo-1559829269-a783e8e5c756?w=800&h=600&fit=crop',
    raised: '₹45,000'
  },
  {
    id: '2',
    name: 'Green Earth Golf Initiative',
    description: 'Environmental organization focused on making golf more sustainable.',
    image: 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop',
    raised: '₹38,000'
  },
  {
    id: '3',
    name: 'Veterans Golf Rehabilitation Program',
    description: 'Supporting military veterans through golf therapy and rehabilitation programs.',
    image: 'https://images.unsplash.com/photo-1517120191895-7313b4a8c8a6?w=800&h=600&fit=crop',
    raised: '₹67,000'
  }
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DigitalHeroes
            </Link>
            <Link 
              href="/subscribe" 
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-semibold text-indigo-800">₹150,000+ raised for charity</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Turn your passion
              </span>
              <br />
              <span className="text-gray-900">
                into real change
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Join thousands of golfers who are making a difference. Play, compete, and automatically donate a portion of your winnings to charities you care about.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/subscribe" 
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Your Journey →
              </Link>
              <Link 
                href="#how-it-works" 
                className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-full border-2 border-gray-200 hover:border-indigo-300 hover:bg-gray-50 transition-all duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              It's simple to make an impact
            </h2>
            <p className="text-xl text-gray-600">
              Three easy steps to turn your golf game into positive change
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Join & Subscribe</h3>
              <p className="text-gray-600">
                Sign up and choose your subscription plan. You're now part of a community that cares.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Play & Win</h3>
              <p className="text-gray-600">
                Enter your scores, participate in draws, and win amazing prizes. The more you play, the more you give.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-pink-50 to-indigo-50 rounded-3xl border border-pink-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Make an Impact</h3>
              <p className="text-gray-600">
                A portion of your winnings automatically goes to the charities you choose. Watch your impact grow!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-16 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">1,247</div>
                <div className="text-indigo-100">Active Members</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">₹150,000</div>
                <div className="text-indigo-100">Total Raised</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">3</div>
                <div className="text-indigo-100">Charities Supported</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">892</div>
                <div className="text-indigo-100">Subscriptions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How our prize draws work
            </h2>
            <p className="text-xl text-gray-600">
              Fair, transparent, and designed to maximize your impact
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Your Scores</h3>
                    <p className="text-gray-600">
                      Submit up to 5 of your latest golf scores. Each score becomes your entry in the draw.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Algorithmic Draw</h3>
                    <p className="text-gray-600">
                      Our fair algorithm selects winners with weighted probabilities based on score frequency.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Win & Donate</h3>
                    <p className="text-gray-600">
                      Win amazing prizes and automatically donate a percentage to your chosen charities!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border border-indigo-100">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-gray-700 font-semibold">3-Match Prize</span>
                  <span className="text-indigo-600 font-bold">25% of Pool</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-gray-700 font-semibold">4-Match Prize</span>
                  <span className="text-purple-600 font-bold">35% of Pool</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-gray-700 font-semibold">5-Match Jackpot</span>
                  <span className="text-pink-600 font-bold">40% of Pool</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                  <p className="text-indigo-800 font-semibold">
                    Plus, 10% of every subscription goes directly to charity!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Charities we support
            </h2>
            <p className="text-xl text-gray-600">
              Choose where your impact goes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <div key={charity.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={charity.image} 
                    alt={charity.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{charity.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{charity.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Raised so far</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {charity.raised}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-16 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to make a difference?
            </h2>
            <p className="text-xl text-indigo-100 mb-10">
              Join thousands of golfers who are turning their passion into real change.
            </p>
            <Link 
              href="/subscribe" 
              className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold text-lg rounded-full hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get Started Today →
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                DigitalHeroes
              </h3>
              <p className="text-gray-500">
                Turning passion into purpose, one swing at a time.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/subscribe" className="hover:text-white transition-colors">Subscribe</Link></li>
                <li><Link href="/charities" className="hover:text-white transition-colors">Charities</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-500">support@digitalheroes.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2024 DigitalHeroes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
