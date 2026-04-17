import React, { useEffect } from 'react';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto z-10 flex flex-col justify-center">
        <div className="liquid-glass p-8 md:p-16 rounded-[40px] border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          {/* Background element for aesthetic */}
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 relative z-10">Terms of Service</h1>
          <div className="space-y-6 text-white/60 font-sans leading-relaxed text-sm md:text-base relative z-10">
            <p>
              Welcome to Deedox Agency! These terms and conditions outline the rules and regulations for the use of Deedox Agency's Website.
            </p>
            <p>
              By accessing this website we assume you accept these terms and conditions. Do not continue to use Deedox Agency if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Cookies</h2>
            <p>
              We employ the use of cookies. By accessing Deedox Agency, you agreed to use cookies in agreement with the Deedox Agency's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
            </p>
            
            <h2 className="text-2xl font-serif text-white mt-10 mb-4">License</h2>
            <p>
              Unless otherwise stated, Deedox Agency and/or its licensors own the intellectual property rights for all material on Deedox Agency. All intellectual property rights are reserved. You may access this from Deedox Agency for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="mt-4 font-bold text-white/80">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-white/50 mb-6">
              <li>Republish material from Deedox Agency</li>
              <li>Sell, rent or sub-license material from Deedox Agency</li>
              <li>Reproduce, duplicate or copy material from Deedox Agency</li>
              <li>Redistribute content from Deedox Agency</li>
            </ul>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Content Liability</h2>
            <p>
              We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>

            <h2 className="text-2xl font-serif text-white mt-10 mb-4">Reservation of Rights</h2>
            <p>
              We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
