import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">

      {/* =========================
          LEFT SIDE
      ========================= */}

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


      {/* =========================
          RIGHT SIDE - PRINT SHOWCASE
      ========================= */}

      <div className="hero-image">

        <div className="hero-main-card">

          {/* Brand */}

          <div className="hero-card-top">
            <strong>PRINTCRAFT</strong>
            <span>DESIGN. PRINT. DELIVER.</span>
          </div>


          {/* Decorative circle */}

          <div className="orange-circle"></div>


          {/* Printing Showcase */}

          <div className="printing-showcase">

            {/* Visiting Card */}

            <div className="showcase-card visiting-card">

              <div className="showcase-logo">
                PC
              </div>

              <div className="showcase-card-text">
                <strong>PrintCraft</strong>
                <small>Premium Printing</small>
              </div>

            </div>


            {/* Wedding Card */}

            <div className="showcase-card wedding-card">

              <small>YOU'RE INVITED</small>

              <h3>
                Wedding
              </h3>

              <span>
                SAVE THE DATE
              </span>

              <div className="wedding-line"></div>

            </div>


            {/* Flyer */}

            <div className="showcase-card flyer-card">

              <small>BRING YOUR</small>

              <h3>
                IDEA
                <br />
                TO LIFE
              </h3>

              <strong>
                WE PRINT
                <br />
                YOUR DREAMS
              </strong>

            </div>


            {/* Business Print */}

            <div className="showcase-card business-card">

              <div className="business-pattern"></div>

              <strong>
                PROFESSIONAL
              </strong>

              <span>
                BUSINESS PRINTS
              </span>

            </div>

          </div>


          {/* Bottom text */}

          <div className="hero-bottom-text">

            <span className="hero-bottom-number">
              01
            </span>

            <div>
              <strong>
                Custom Printing
              </strong>

              <small>
                Made Just For You
              </small>
            </div>

          </div>

        </div>


        {/* Floating card 1 */}

        <div className="floating-card floating-one">

          <div className="floating-number">
            01
          </div>

          <div>
            <strong>
              Custom Prints
            </strong>

            <small>
              Personalized designs
            </small>
          </div>

        </div>


        {/* Floating card 2 */}

        <div className="floating-card floating-two">

          <div className="floating-number">
            02
          </div>

          <div>
            <strong>
              Business Prints
            </strong>

            <small>
              Professional quality
            </small>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;