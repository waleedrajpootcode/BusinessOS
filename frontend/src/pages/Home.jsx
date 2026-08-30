import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          BACKGROUND
      ========================== */}
      <div className="home-grid" />
      <div className="home-glow home-glow-one" />
      <div className="home-glow home-glow-two" />

      {/* =========================
          NAVIGATION
      ========================== */}
      <header className="home-nav">

        <Link to="/" className="brand">
          <span className="brand-rraw">RRAW</span>
          <span className="brand-divider">/</span>
          <span className="brand-product">BusinessOS</span>
        </Link>

        <div className="nav-right">

          <span className="nav-company">
            INTELLIGENT BUSINESS SYSTEMS
          </span>

          <Link to="/login" className="nav-login">
            Sign in
          </Link>

        </div>

      </header>

      {/* =========================
          MAIN
      ========================== */}
      <main className="home-main">

        {/* =========================
            HERO
        ========================== */}
        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              <span>AI-POWERED BUSINESS INFRASTRUCTURE</span>
            </div>

            <h1 className="hero-title">
              <span>BUSINESS</span>

              <span className="hero-title-accent">
                OPERATING SYSTEM
              </span>
            </h1>

            <p className="hero-description">
              One intelligent system for the business
              behind your business.
            </p>

            <p className="hero-supporting-text">
              BusinessOS brings your sales, customers,
              inventory, suppliers, payments and reports
              together in one connected workspace —
              built to become smarter with AI.
            </p>

            <div className="hero-actions">

              <Link
                to="/login"
                className="hero-primary-button"
              >
                <span>Enter BusinessOS</span>
                <span className="button-arrow">→</span>
              </Link>

              <a
                href="#intelligence"
                className="hero-secondary-button"
              >
                Explore the system
              </a>

            </div>

          </div>

          {/* =========================
              BUSINESS CORE
          ========================== */}
          <div className="business-core">

            <div className="core-orbit core-orbit-one" />
            <div className="core-orbit core-orbit-two" />

            <div className="core-line core-line-top" />
            <div className="core-line core-line-right" />
            <div className="core-line core-line-bottom" />
            <div className="core-line core-line-left" />

            <div className="core-node node-sales">
              <span>SALES</span>
            </div>

            <div className="core-node node-customers">
              <span>CUSTOMERS</span>
            </div>

            <div className="core-node node-inventory">
              <span>INVENTORY</span>
            </div>

            <div className="core-node node-suppliers">
              <span>SUPPLIERS</span>
            </div>

            <div className="core-node node-reports">
              <span>REPORTS</span>
            </div>

            <div className="core-node node-payments">
              <span>PAYMENTS</span>
            </div>

            <div className="core-center">

              <div className="core-ring">

                <div className="core-inner">

                  <span className="core-label">
                    BUSINESSOS
                  </span>

                  <strong>CORE</strong>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            INTELLIGENCE SECTION
        ========================== */}
        <section
          id="intelligence"
          className="intelligence-section"
        >

          <div className="section-heading">

            <div className="section-eyebrow">
              <span className="eyebrow-line" />
              INTELLIGENCE LAYER
            </div>

            <h2>
              Your business generates data.
              <span> BusinessOS turns it into insight.</span>
            </h2>

            <p>
              A connected foundation for understanding
              what is happening across your business and
              creating a stronger path toward AI-powered
              decision making.
            </p>

          </div>

          <div className="intelligence-flow">

            <div className="intelligence-step">

              <div className="step-number">
                01
              </div>

              <div>
                <h3>CONNECT</h3>
                <p>
                  Bring your core business operations
                  into one connected system.
                </p>
              </div>

            </div>

            <div className="flow-arrow">
              →
            </div>

            <div className="intelligence-step">

              <div className="step-number">
                02
              </div>

              <div>
                <h3>UNDERSTAND</h3>
                <p>
                  Turn business activity into clear,
                  structured information.
                </p>
              </div>

            </div>

            <div className="flow-arrow">
              →
            </div>

            <div className="intelligence-step">

              <div className="step-number">
                03
              </div>

              <div>
                <h3>INTELLIGENCE</h3>
                <p>
                  Build toward smarter insights,
                  automation and AI-assisted decisions.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            BUSINESS MODULES
        ========================== */}
        <section className="modules-section">

          <div className="section-heading modules-heading">

            <div className="section-eyebrow">
              <span className="eyebrow-line" />
              ONE SYSTEM / EVERY OPERATION
            </div>

            <h2>
              Everything your business needs.
              <span> Connected.</span>
            </h2>

          </div>

          <div className="modules-grid">

            <div className="module-card">
              <span className="module-number">01</span>
              <h3>Sales</h3>
              <p>
                Manage sales and keep your business
                activity organized in one place.
              </p>
            </div>

            <div className="module-card">
              <span className="module-number">02</span>
              <h3>Customers</h3>
              <p>
                Keep customer relationships,
                balances and activity connected.
              </p>
            </div>

            <div className="module-card">
              <span className="module-number">03</span>
              <h3>Inventory</h3>
              <p>
                Understand products, stock movement
                and inventory activity.
              </p>
            </div>

            <div className="module-card">
              <span className="module-number">04</span>
              <h3>Suppliers</h3>
              <p>
                Organize purchasing relationships,
                payments and supplier records.
              </p>
            </div>

            <div className="module-card">
              <span className="module-number">05</span>
              <h3>Payments</h3>
              <p>
                Track customer and supplier payments
                with clear financial visibility.
              </p>
            </div>

            <div className="module-card">
              <span className="module-number">06</span>
              <h3>Reports</h3>
              <p>
                Turn your operational data into
                useful business-level information.
              </p>
            </div>

          </div>

        </section>

        {/* =========================
            AI POSITIONING
        ========================== */}
        <section className="ai-section">

          <div className="ai-panel">

            <div className="ai-panel-content">

              <div className="section-eyebrow">
                <span className="eyebrow-line" />
                THE INTELLIGENCE DIRECTION
              </div>

              <h2>
                Built for the
                <span> AI-powered business.</span>
              </h2>

              <p>
                BusinessOS is designed around a connected
                business foundation so intelligent tools,
                automation and AI can work with the
                information that actually matters to your
                business.
              </p>

              <div className="ai-points">

                <div>
                  <span>✓</span>
                  Connected business data
                </div>

                <div>
                  <span>✓</span>
                  Centralized operations
                </div>

                <div>
                  <span>✓</span>
                  Intelligent reporting foundation
                </div>

                <div>
                  <span>✓</span>
                  Built to evolve with AI
                </div>

              </div>

            </div>

            <div className="ai-visual">

              <div className="ai-circle ai-circle-one" />
              <div className="ai-circle ai-circle-two" />

              <div className="ai-core">

                <span>AI</span>
                <strong>INTELLIGENCE</strong>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            PRODUCT STATEMENT
        ========================== */}
        <section className="statement-section">

          <div className="statement-line" />

          <p className="statement-label">
            RRAW / BUSINESSOS
          </p>

          <h2>
            Run the business.
            <span> Understand the business.</span>
            <strong> Build the future.</strong>
          </h2>

          <Link
            to="/login"
            className="statement-button"
          >
            Enter BusinessOS →
          </Link>

        </section>

        {/* =========================
            TRUST STRIP
        ========================== */}
        <section className="trust-strip">

          <div className="trust-item">
            <span className="trust-dot" />
            ONE BUSINESS
          </div>

          <div className="trust-item">
            <span className="trust-dot" />
            ONE SYSTEM
          </div>

          <div className="trust-item">
            <span className="trust-dot" />
            ONE INTELLIGENT CORE
          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="home-footer">

        <span>
          A product by <strong>RRAW</strong>
        </span>

        <span>
          BusinessOS © {new Date().getFullYear()}
        </span>

      </footer>

    </div>
  );
}

export default Home;