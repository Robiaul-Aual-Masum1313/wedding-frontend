import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="size-7 fill-primary text-primary" />
              <span className="font-heading text-2xl font-semibold text-foreground">
                WedPlan
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Making your dream wedding a beautiful reality. Discover trusted
              vendors and plan your special day with confidence.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <FaFacebookF size={20} />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <FaInstagram size={20} />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <FaXTwitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-semibold text-foreground">Quick Links</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-primary"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="transition-colors hover:text-primary"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 font-semibold text-foreground">Our Services</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Photography & Videography</li>
              <li>Wedding Venues</li>
              <li>Decoration & Florist</li>
              <li>Catering Services</li>
              <li>Makeup & Styling</li>
              <li>Wedding Fashion</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-semibold text-foreground">Contact Us</h3>

            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href="mailto:support@wedplan.com"
                  className="hover:text-primary"
                >
                  support@wedplan.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary">
                  +1 234 567 890
                </a>
              </li>

              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>Available worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} WedPlan. All rights reserved. Made with{" "}
            <Heart className="mx-1 inline size-4 fill-primary text-primary" />{" "}
            for your special day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
