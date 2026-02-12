import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="heading-display text-sm mb-4">Ligne Rouge Tours</h4>
            <p className="body-text text-muted-foreground text-sm">
              We organize expeditions in territories others avoid.
            </p>
          </div>
          <div>
            <h4 className="heading-display text-sm mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground body-text">
              <p>7 rue des Archives</p>
              <p>75004 Paris, France</p>
              <p className="pt-2">
                <a href="https://wa.me/33767135458" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp: +33 7 67 13 54 58
                </a>
              </p>
              <p>
                <a href="mailto:contact@lignerougetours.com" className="hover:text-foreground transition-colors">
                  contact@lignerougetours.com
                </a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="heading-display text-sm mb-4">Navigation</h4>
            <div className="space-y-2 text-sm text-muted-foreground body-text">
              <p>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  Who We Are
                </Link>
              </p>
              <p>
                <Link to="/about#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </p>
              <p>
                <a href="/#expeditions" className="hover:text-foreground transition-colors">
                  Expeditions
                </a>
              </p>
            </div>
          </div>
          <div>
            <h4 className="heading-display text-sm mb-4">Legal</h4>
            <div className="space-y-2 text-sm text-muted-foreground body-text">
              <p>
                <Link to="/legal" className="hover:text-foreground transition-colors">
                  Legal Notice & Terms
                </Link>
              </p>
              <p className="pt-2">
                © {new Date().getFullYear()} Ligne Rouge Tours.<br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <div className="h-px w-12 bg-accent mx-auto" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
