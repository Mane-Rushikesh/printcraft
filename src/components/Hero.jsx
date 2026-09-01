import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-content">

        <div className="hero-badge">
          <Sparkles size={16} />
          Premium Custom Printing
        </div>

        <h1>
          Your Ideas.
          <br />
          <span>Made to Print.</span>
        </h1>

        <p className="hero-description">
          Turn your ideas into beautiful printed products. From custom mugs
          and visiting cards to wedding invitations, we make every print
          special.
        </p>

        <div className="hero-buttons">

          <a href="#products" className="primary-button">
            Explore Products
            <ArrowRight size={18} />
          </a>

          <a href="#categories" className="secondary-button">
            View Categories
          </a>

        </div>

        <div className="hero-features">

          <div>
            <span>✓</span>
            Premium Quality
          </div>

          <div>
            <span>✓</span>
            Fast Delivery
          </div>

          <div>
            <span>✓</span>
            Custom Designs
          </div>

        </div>

      </div>


      <div className="hero-image">

        <div className="hero-main-card">

          <div className="hero-card-top">
            <span>PRINTCRAFT</span>
            <span>CREATE.</span>
          </div>

          <div className="orange-circle"></div>

          <div className="print-mug">

            <div className="mug-body">
              <span>YOUR</span>
              <strong>IDEA</strong>
            </div>

            <div className="mug-handle"></div>

          </div>

          <div className="hero-bottom-text">
            Custom Printing
          </div>

        </div>


        <div className="floating-card floating-one">
          <div className="floating-number">01</div>

          <div>
            <strong>Custom Mugs</strong>
            <small>Personalized prints</small>
          </div>
        </div>


        <div className="floating-card floating-two">
          <div className="floating-number">02</div>

          <div>
            <strong>Business Prints</strong>
            <small>Professional quality</small>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Hero;