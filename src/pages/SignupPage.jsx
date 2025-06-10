import React, { useState } from "react";
import SignupForm from "../components/SignupForm";
import { Link } from "react-router-dom";
import googleLight from "../assets/google_light.png";
import googleBold from "../assets/google_bold.png";
import githubLight from "../assets/github_light.png";
import githubBold from "../assets/github_bold.png";
import dropboxLight from "../assets/dropbox_light.png";
import dropboxBold from "../assets/dropbox_bold.png";
import "../transition.css";
import { ToastContainer } from "react-toastify";

const icons = [
  { id: "google", light: googleLight, bold: googleBold, alt: "Sign up with Google", href: "http://localhost:3000/auth/google" },
  { id: "github", light: githubLight, bold: githubBold, alt: "Sign up with GitHub", href: "http://localhost:3000/auth/github" },
  { id: "dropbox", light: dropboxLight, bold: dropboxBold, alt: "Sign up with Dropbox", href: "http://localhost:3000/auth/dropbox" },
];

const SignupPage = () => {
  const [hovered, setHovered] = useState(null);
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-white to-blue-100">
        <div className="w-full max-w-4xl bg-white rounded-[30px] shadow-2xl overflow-hidden flex h-[500px] animate-pop-in">
          <div className="w-1/2 gap-3 flex flex-col items-center justify-start p-10 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 animate-fade-in-up">Sign Up</h2>
            <div className="flex space-x-4 mb-6 justify-center items-center">
              {icons.map(({ id, light, bold, alt, href }) => (
                <button
                  type="button"
                  onClick={() => window.open(href, "_self")}
                  key={id}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`border border-gray-300 rounded-xl p-2 hover:border-gray-500 transition-colors duration-300 h-10 w-10 flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md
                    ${id === "github" && hovered === id ? "bg-black" : ""}
                    animate-bounce-in
                  `}
                  aria-label={alt}
                >
                  <img
                    src={light}
                    alt={alt}
                    className={`object-contain inset-0 w-8 h-8 transition-opacity duration-250 ${hovered === id ? "hidden" : "opacity-100"}`}
                    draggable={false}
                  />
                  <img
                    src={bold}
                    alt={alt}
                    className={`object-contain inset-0 w-8 h-8 transition-opacity duration-300 ${hovered === id ? "opacity-100" : "hidden"}`}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-gray-500 mb-4 animate-fade-in-up">
              or use your email for registration
            </p>
            <SignupForm />
          </div>
          <div className="w-1/2 bg-[#5A55B1] text-white flex flex-col items-center justify-center p-8 rounded-l-[100px] h-full relative">
            <h1 className="text-5xl font-bold animate-fade-in-left">Hello, Friends!</h1>
            <p className="mt-4 text-center animate-fade-in-left">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="underline hover:text-blue-200 transition"
              >
                Sign In
              </Link>
            </p>
            <img
              src="/signup-illustration.svg"
              alt=""
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 opacity-20 pointer-events-none select-none hidden md:block"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} theme="colored" />
      <style>{`
        .animate-pop-in {
          animation: popIn 0.7s cubic-bezier(.47,1.64,.41,.8);
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95);}
          70% { opacity: 1; transform: scale(1.05);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s;
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s;
        }
        @keyframes fadeIn {
          from { opacity: 0;}
          to { opacity: 1;}
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8);}
          70% { opacity: 1; transform: scale(1.08);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </>
  );
};

export default SignupPage;