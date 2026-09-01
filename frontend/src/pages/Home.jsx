import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const modules = [
    {
      number: "01",
      title: "Sales",
      description:
        "Manage sales and keep your business activity organized in one connected workspace.",
    },
    {
      number: "02",
      title: "Customers",
      description:
        "Keep customer relationships, balances and activity connected to the wider business.",
    },
    {
      number: "03",
      title: "Inventory",
      description:
        "Understand products, stock movement and inventory activity with greater visibility.",
    },
    {
      number: "04",
      title: "Suppliers",
      description:
        "Organize purchasing relationships, payments and supplier records in one system.",
    },
    {
      number: "05",
      title: "Payments",
      description:
        "Track customer and supplier payments with clear financial visibility.",
    },
    {
      number: "06",
      title: "Reports",
      description:
        "Turn operational activity into useful business-level information and insight.",
    },
  ];

  const intelligenceSteps = [
    {
      number: "01",
      title: "CONNECT",
      description:
        "Bring core business operations into one connected system.",
    },
    {
      number: "02",
      title: "UNDERSTAND",
      description:
        "Turn business activity into clear, structured information.",
    },
    {
      number: "03",
      title: "INTELLIGENCE",
      description:
        "Build toward smarter insights, automation and AI-assisted decisions.",
    },
  ];

  return (
    <div className="home-page">
      {/* =========================
          BACKGROUND
      ========================== */}
      <div className="home-grid" />
      <div className="home-noise" />

      <div className="home-glow home-glow-one" />
      <div className="home-glow home-glow-two" />
      <div className="home-glow home-glow-three" />

      {/* =========================
          NAVIGATION
      ========================== */}
      <header className="home-nav">
        <Link to="/" className="brand" aria-label="RRAW BusinessOS Home">
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
              <span className="hero-title-main">BUSINESS</span>

              <span className="hero-title-accent">
                OPERATING SYSTEM
              </span>
            </h1>

            <p className="hero-description">
              One intelligent system for the business behind your
              business.
            </p>

            <p className="hero-supporting-text">
              BusinessOS brings your sales, customers, inventory,
              suppliers, payments and reports together in one
              connected workspace — built to become smarter with AI.
            </p>

            <div className="hero-actions">
              <Link to="/login" className="hero-primary-button">
                <span>Enter BusinessOS</span>
                <span className="button-arrow">→</span>
              </Link>

              <a
                href="#intelligence"
                className="hero-secondary-button"
              >
                Explore the system
                <span className="secondary-arrow">↓</span>
              </a>
            </div>

            {/* =========================
                SYSTEM STATUS
            ========================== */}
            <div className="hero-status">
              <div className="status-item">
                <span className="status-dot" />
                <span>SYSTEM FOUNDATION</span>
              </div>

              <span className="status-divider" />

              <div className="status-item">
                <span>CONNECTED OPERATIONS</span>
              </div>

              <span className="status-divider" />

              <div className="status-item">
                <span>AI-READY ARCHITECTURE</span>
              </div>
            </div>
          </div>

          {/* =========================
              BUSINESS CORE
          ========================== */}
          <div className="business-core" aria-label="BusinessOS connected business modules">
            <div className="core-ambient-glow" />

            <div className="core-orbit core-orbit-one" />
            <div className="core-orbit core-orbit-two" />
            <div className="core-orbit core-orbit-three" />

            {/* Connection lines */}
            <div className="core-line core-line-top" />
            <div className="core-line core-line-right" />
            <div className="core-line core-line-bottom" />
            <div className="core-line core-line-left" />

            <div className="core-diagonal core-diagonal-one" />
            <div className="core-diagonal core-diagonal-two" />

            {/* Moving signal lights */}
            <span className="core-signal signal-top" />
            <span className="core-signal signal-right" />
            <span className="core-signal signal-bottom" />
            <span className="core-signal signal-left" />

            {/* Module nodes */}
            <div className="core-node node-sales">
              <span className="node-indicator" />
              <span>SALES</span>
            </div>

            <div className="core-node node-customers">
              <span className="node-indicator" />
              <span>CUSTOMERS</span>
            </div>

            <div className="core-node node-inventory">
              <span className="node-indicator" />
              <span>INVENTORY</span>
            </div>

            <div className="core-node node-suppliers">
              <span className="node-indicator" />
              <span>SUPPLIERS</span>
            </div>

            <div className="core-node node-reports">
              <span className="node-indicator" />
              <span>REPORTS</span>
            </div>

            <div className="core-node node-payments">
              <span className="node-indicator" />
              <span>PAYMENTS</span>
            </div>

            {/* Center core */}
            <div className="core-center">
              <div className="core-center-glow" />

              <div className="core-ring">
                <div className="core-ring-light" />

                <div className="core-inner">
                  <span className="core-label">BUSINESSOS</span>
                  <strong>CORE</strong>
                  <span className="core-state">
                    <span />
                    CONNECTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            SYSTEM PHILOSOPHY
        ========================== */}
        <section className="philosophy-section">
          <div className="philosophy-copy">
            <div className="section-eyebrow">
              <span className="eyebrow-line" />
              THE BUSINESSOS APPROACH
            </div>

            <h2>
              Your business is not a collection of tools.
              <span> So why should it operate like one?</span>
            </h2>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-item">
              <span className="philosophy-number">01</span>
              <h3>ONE FOUNDATION</h3>
              <p>
                Your operational information belongs to one connected
                business environment.
              </p>
            </div>

            <div className="philosophy-item">
              <span className="philosophy-number">02</span>
              <h3>ONE CONTEXT</h3>
              <p>
                Business activity becomes more meaningful when its
                relationships are visible together.
              </p>
            </div>

            <div className="philosophy-item">
              <span className="philosophy-number">03</span>
              <h3>ONE DIRECTION</h3>
              <p>
                Build today's operations on a foundation ready for
                tomorrow's intelligent tools.
              </p>
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
              A connected foundation for understanding what is
              happening across your business and creating a stronger
              path toward AI-powered decision making.
            </p>
          </div>

          <div className="intelligence-flow">
            {intelligenceSteps.map((step, index) => (
              <div className="intelligence-flow-group" key={step.number}>
                <div className="intelligence-step">
                  <div className="step-number">
                    {step.number}
                  </div>

                  <div className="step-content">
                    <div className="step-top-line">
                      <span className="step-mini-dot" />
                      SYSTEM LAYER
                    </div>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>
                  </div>
                </div>

                {index < intelligenceSteps.length - 1 && (
                  <div className="flow-arrow">
                    <span>→</span>
                  </div>
                )}
              </div>
            ))}
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

            <p>
              Core business operations, brought together in a system
              designed around the way your business actually works.
            </p>
          </div>

          <div className="modules-grid">
            {modules.map((module) => (
              <article className="module-card" key={module.number}>
                <div className="module-card-top">
                  <span className="module-number">
                    {module.number}
                  </span>

                  <span className="module-arrow">↗</span>
                </div>

                <div className="module-card-line" />

                <h3>{module.title}</h3>

                <p>{module.description}</p>

                <span className="module-status">
                  <span />
                  CONNECTED MODULE
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* =========================
            CONNECTION ARCHITECTURE
        ========================== */}
        <section className="architecture-section">
          <div className="architecture-header">
            <div>
              <div className="section-eyebrow">
                <span className="eyebrow-line" />
                CONNECTED ARCHITECTURE
              </div>

              <h2>
                Information becomes more powerful
                <span> when everything can speak to everything.</span>
              </h2>
            </div>

            <p>
              BusinessOS creates a connected operational foundation
              where business activity can be understood as a whole,
              rather than isolated pieces.
            </p>
          </div>

          <div className="architecture-map">
            <div className="architecture-line architecture-line-one" />
            <div className="architecture-line architecture-line-two" />
            <div className="architecture-line architecture-line-three" />
            <div className="architecture-line architecture-line-four" />

            <div className="architecture-node architecture-node-one">
              SALES
            </div>

            <div className="architecture-node architecture-node-two">
              CUSTOMERS
            </div>

            <div className="architecture-node architecture-node-three">
              INVENTORY
            </div>

            <div className="architecture-node architecture-node-four">
              PAYMENTS
            </div>

            <div className="architecture-center">
              <span>BUSINESSOS</span>
              <strong>CORE</strong>
            </div>

            <div className="architecture-caption">
              <span className="caption-dot" />
              ONE CONNECTED BUSINESS CONTEXT
            </div>
          </div>
        </section>

        {/* =========================
            AI SECTION
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
                BusinessOS is designed around a connected business
                foundation so intelligent tools, automation and AI can
                work with the information that actually matters to
                your business.
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
              <div className="ai-visual-grid" />

              <div className="ai-circle ai-circle-one" />
              <div className="ai-circle ai-circle-two" />
              <div className="ai-circle ai-circle-three" />

              <div className="ai-orbit-dot ai-orbit-dot-one" />
              <div className="ai-orbit-dot ai-orbit-dot-two" />

              <div className="ai-core">
                <span>AI</span>
                <strong>INTELLIGENCE</strong>

                <div className="ai-core-line" />
                <small>EVOLUTION LAYER</small>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FINAL STATEMENT
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

          <p className="statement-description">
            A connected foundation for businesses that want to
            operate with more clarity today — and build toward
            intelligent operations tomorrow.
          </p>

          <Link
            to="/login"
            className="statement-button"
          >
            Enter BusinessOS
            <span>→</span>
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
            ONE CONNECTED CORE
          </div>

          <div className="trust-item">
            <span className="trust-dot" />
            BUILT FOR INTELLIGENCE
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