import { useState } from 'react';
import heroImage from '../assets/student.svg';

export default function HeroSection() {
  return (
    <section className="w-full px-4 font-sans">
      <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-8">
        <div className="block w-full lg:hidden">
          <img src={heroImage} alt="Hero visual" className="w-full max-w-lg h-auto mx-auto" />
        </div>
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
            Donate to those who need.
          </h1>
          <p className="text-lg md:text-xl text-primary-100 leading-relaxed">
            reGive is a simple and smart platform that connects college students to share, donate,
            and find useful items within their campus. Whether it’s books, gadgets, or accessories,
            reGive makes giving and receiving effortless while building a culture of sustainability
            and collaboration among students.
          </p>

          <p className="text-lg md:text-2xl text-primary-500 font-semibold">
            Join us and make a difference.
          </p>
        </div>

        <div className="hidden lg:block w-xl">
          <img src={heroImage} alt="Hero visual" className="w-120 h-96 mx-auto" />
        </div>
      </div>
    </section>
  );
}
