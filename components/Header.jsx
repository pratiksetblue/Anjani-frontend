"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const products = [
  {
    title: "PLC Based Low Liquor Ratio ECO+ Soft Flow Dyeing Machine.",
    href: "/plc-based-low-liquor-ratio-eco-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine.",
    href: "/plc-based-low-liquor-ratio-sample-eco-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based U Type Rapid Jet Dyeing Machine",
    href: "/plc-based-u-type-rapid-jet-dyeing-machine",
  },
  {
    title: "PLC Based U Type Soft Flow Dyeing Machine",
    href: "/plc-based-u-type-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based U Type Sample Jet Dyeing Machine",
    href: "/plc-based-u-type-sample-jet-dyeing-machine",
  },
  {
    title: "PLC Based Long Tube Rapid Jet Dyeing Machine",
    href: "/plc-based-long-tube-rapid-jet-dyeing-machine",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - One Autoclave Two Tubes",
    href: "/plc-based-long-tube-double-tube-rapid-jet-dyeing-machine",
  },
  {
    title: "PLC Based Long Tube Soft Flow Dyeing Machine",
    href: "/plc-based-long-tube-soft-flow-dyeing-machine",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - Two Autoclave Two Tubes",
    href: "/plc-based-long-tube-with-double-tube-rapid-jet",
  },
  {
    title: "PLC Based Long Tube Sample Jet Dyeing Machine",
    href: "/plc-based-long-tube-sample-jet-dyeing-machine",
  },
  {
    title: "PLC Based Weight Reduction Machine with Caustic Recovery Unit",
    href: "/plc-based-weight-reduction-machine-with-caustic-recovery-unit",
  },
  {
    title: "Fully Automatic Caustic Recovery Plant",
    href: "/fully-automatic-caustic-recovery-plant",
  },
];

const whoWeAre = [
  {
    title: "About Us",
    href: "/about-us",
  },
  {
    title: "Our Story",
    href: "/our-story",
  },
  {
    title: "Values & Ethics",
    href: "/values-ethics",
  },
];

const ChevronIcon = () => (
  <svg
    height="10"
    viewBox="0 0 10 10"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 0.0495054L10 10.0001L8.13725 10.0001L-8.22301e-08 1.8812L1.86275 -3.55691e-07L7.35294 5.5446L7.30392 0.0495053L10 0.0495054Z" />
    <path d="M-9.6438e-05 10.0002L6.27441 10.0002L3.62736 7.32687L-9.63211e-05 7.32687L-9.6438e-05 10.0002Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    height="22"
    viewBox="0 0 22 22"
    width="22"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21.4233 16.9723L16.9701 14.0025C16.4049 13.6286 15.6474 13.7516 15.2296 14.2851L13.9324 15.953C13.8518 16.0593 13.7355 16.133 13.6049 16.1605C13.4743 16.1879 13.3382 16.1674 13.2215 16.1026L12.9748 15.9666C12.1568 15.5207 11.139 14.9656 9.08843 12.9143C7.03782 10.863 6.48163 9.84441 6.03578 9.02794L5.90048 8.78119C5.8348 8.66457 5.81347 8.52814 5.84042 8.39704C5.86736 8.26593 5.94077 8.14897 6.04712 8.06771L7.71384 6.77093C8.24713 6.35309 8.37031 5.59578 7.9969 5.03048L5.02713 0.577286C4.64443 0.00163523 3.87664 -0.171172 3.28419 0.184969L1.42202 1.30357C0.836918 1.64754 0.407665 2.20464 0.224235 2.85811C-0.446327 5.30138 0.0581298 9.51809 6.26973 15.7304C11.2109 20.6712 14.8894 21.9999 17.4178 21.9999C17.9997 22.0024 18.5792 21.9267 19.141 21.7748C19.7946 21.5916 20.3517 21.1623 20.6955 20.5771L21.8152 18.716C22.1719 18.1234 21.9992 17.3552 21.4233 16.9723ZM21.1835 18.3398L20.0663 20.202C19.8194 20.6244 19.4187 20.935 18.9481 21.0687C16.6925 21.688 12.7519 21.175 6.78849 15.2117C0.825106 9.24827 0.312228 5.308 0.931488 3.05209C1.06539 2.58083 1.37635 2.17961 1.7993 1.93237L3.66147 0.815229C3.91853 0.660553 4.25177 0.735528 4.41783 0.985329L6.03106 3.40733L7.38507 5.43814C7.54722 5.68334 7.49394 6.01198 7.26262 6.19343L5.59552 7.49021C5.08818 7.87814 4.9433 8.58007 5.25566 9.13716L5.38804 9.37768C5.85662 10.2371 6.43918 11.3062 8.56606 13.4327C10.6929 15.5592 11.7617 16.1418 12.6207 16.6104L12.8616 16.7431C13.4186 17.0554 14.1206 16.9106 14.5085 16.4032L15.8053 14.7361C15.9868 14.5049 16.3153 14.4517 16.5606 14.6137L21.0134 17.5834C21.2634 17.7494 21.3384 18.0828 21.1835 18.3398ZM12.4659 3.66805C15.9066 3.67187 18.6949 6.4602 18.6988 9.90091C18.6988 10.1034 18.8629 10.2675 19.0654 10.2675C19.2679 10.2675 19.432 10.1034 19.432 9.90091C19.4278 6.05538 16.3114 2.93901 12.4659 2.9348C12.2634 2.9348 12.0993 3.09893 12.0993 3.30142C12.0993 3.50392 12.2634 3.66805 12.4659 3.66805Z" />
    <path d="M12.4653 5.86759C14.6916 5.87021 16.4957 7.67433 16.4983 9.90062C16.4983 9.99786 16.5369 10.0911 16.6057 10.1599C16.6744 10.2286 16.7677 10.2672 16.8649 10.2672C16.9622 10.2672 17.0554 10.2286 17.1242 10.1599C17.1929 10.0911 17.2315 9.99786 17.2315 9.90062C17.2285 7.26951 15.0963 5.13735 12.4653 5.13434C12.2628 5.13434 12.0986 5.29847 12.0986 5.50096C12.0986 5.70346 12.2628 5.86759 12.4653 5.86759Z" />
    <path d="M12.4653 8.06735C13.4772 8.06856 14.2972 8.8886 14.2985 9.90056C14.2985 9.9978 14.3371 10.091 14.4058 10.1598C14.4746 10.2286 14.5679 10.2672 14.6651 10.2672C14.7623 10.2672 14.8556 10.2286 14.9243 10.1598C14.9931 10.091 15.0317 9.9978 15.0317 9.90056C15.0301 8.48382 13.882 7.3357 12.4653 7.33411C12.2628 7.33411 12.0986 7.49823 12.0986 7.70073C12.0986 7.90323 12.2628 8.06735 12.4653 8.06735Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    fill="none"
    height="23"
    viewBox="0 0 100 100"
    width="23"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M61.9375 55.8457C60.0449 56.6191 58.8359 59.582 57.6094 61.0957C56.9805 61.8711 56.2305 61.9922 55.2637 61.6035C48.1602 58.7734 42.7148 54.0332 38.7949 47.4961C38.1309 46.4824 38.25 45.6816 39.0508 44.7402C40.2344 43.3457 41.7227 41.7617 42.043 39.8828C42.7539 35.7266 37.3203 22.834 30.1445 28.6758C9.4961 45.502 64.5898 90.1289 74.5332 65.9922C77.3457 59.1504 65.0742 54.5605 61.9375 55.8457ZM50 91.2656C42.6973 91.2656 35.5117 89.3242 29.2207 85.6484C28.2109 85.0566 26.9902 84.9004 25.8613 85.207L12.1914 88.959L16.9531 78.4688C17.6016 77.041 17.4356 75.3789 16.5195 74.1094C11.4258 67.0488 8.73243 58.7129 8.73243 50C8.73243 27.2441 27.2441 8.73242 50 8.73242C72.7559 8.73242 91.2656 27.2441 91.2656 50C91.2656 72.7539 72.7539 91.2656 50 91.2656ZM50 0C22.4297 0 3.9212e-06 22.4297 3.9212e-06 50C3.9212e-06 59.6992 2.75391 69.0137 7.98633 77.0977L0.390629 93.8262C-0.310543 95.3711 -0.0546835 97.1797 1.04297 98.4668C1.88672 99.4531 3.10743 100 4.36719 100C7.1836 100 22.541 95.1738 26.4492 94.1016C33.6738 97.9668 41.7773 100 50 100C77.5684 100 100 77.5684 100 50C100 22.4297 77.5684 0 50 0Z"
      fill="#39AE41"
      fillRule="evenodd"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    fill="none"
    height="31"
    viewBox="0 0 47 31"
    width="47"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="#CB0000" height="3" width="47" />
    <rect fill="#CB0000" height="3" width="47" y="14" />
    <rect fill="#CB0000" height="3" width="47" y="28" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isWhoActive = whoWeAre.some((item) => isActive(item.href));

  const isProductActive =
    pathname === "/products" || products.some((item) => isActive(item.href));

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setWhoOpen(false);
    setProductsOpen(false);
  };

  return (
    <header className="header-area style-1">
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between">
        {/* Logo */}
        <div className="company-logo">
          <Link href="/" onClick={closeMobileMenu}>
            <img
              alt="Company Logo"
              className="img-fluid"
              src="/assets/img/logo.png"
            />
          </Link>
        </div>

        {/* Main Menu */}
        <div className={`main-menu ${mobileMenuOpen ? "show-menu" : ""}`}>
          {/* Mobile Logo */}
          <div className="mobile-logo-area d-lg-none d-flex align-items-center justify-content-between">
            <Link
              className="mobile-logo-wrap"
              href="/"
              onClick={closeMobileMenu}
            >
              <img
                alt="Company Logo"
                className="img-fluid"
                src="/assets/img/logo.png"
              />
            </Link>

            <button
              type="button"
              className="menu-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <i className="bi bi-x" />
            </button>
          </div>

          <ul className="menu-list">
            {/* Home */}
            <li
              className={`menu-item-has-children position-inherit ${
                isActive("/") ? "active" : ""
              }`}
            >
              <Link href="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            {/* Who We Are */}
            <li
              className={`menu-item-has-children ${
                isWhoActive ? "active" : ""
              } ${activeDropdown === "who" ? "desktop-dropdown-open" : ""}`}
              onMouseEnter={() => {
                if (window.innerWidth >= 992) {
                  setActiveDropdown("who");
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 992) {
                  setActiveDropdown(null);
                }
              }}
            >
              <Link
                className="drop-down"
                href="/about-us"
                onClick={() => {
                  if (window.innerWidth < 992) {
                    setWhoOpen((prev) => !prev);
                  } else {
                    closeMobileMenu();
                  }
                }}
              >
                Who We Are
                <ChevronIcon />
              </Link>

              <button
                type="button"
                className="dropdown-icon d-lg-none"
                onClick={() => setWhoOpen((prev) => !prev)}
                aria-label="Toggle Who We Are menu"
              >
                <i className={`bi ${whoOpen ? "bi-dash" : "bi-plus"}`} />
              </button>

              <ul
                className={`sub-menu ${whoOpen ? "show-submenu" : ""} ${
                  activeDropdown === "who" ? "desktop-submenu-open" : ""
                }`}
              >
                {whoWeAre.map((item) => (
                  <li
                    key={item.href}
                    className={isActive(item.href) ? "active" : ""}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Mobile + Desktop dono par dropdown close
                        setActiveDropdown(null);
                        setWhoOpen(false);
                        setProductsOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Products */}
            <li
              className={`menu-item-has-children ${
                isProductActive ? "active" : ""
              } ${
                activeDropdown === "products" ? "desktop-dropdown-open" : ""
              }`}
              onMouseEnter={() => {
                if (window.innerWidth >= 992) {
                  setActiveDropdown("products");
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 992) {
                  setActiveDropdown(null);
                }
              }}
            >
              <Link
                className="drop-down"
                href="/products"
                onClick={(e) => {
                  if (window.innerWidth < 992) {
                    e.preventDefault();
                    setProductsOpen((prev) => !prev);
                    setWhoOpen(false);
                  } else {
                    setProductsHover(false);
                    setProductsOpen(false);
                    setWhoOpen(false);
                    setMobileMenuOpen(false);
                  }
                }}
              >
                Products
                <ChevronIcon />
              </Link>

              <button
                type="button"
                className="dropdown-icon d-lg-none"
                onClick={() => {
                  setProductsOpen((prev) => !prev);
                  setWhoOpen(false);
                }}
                aria-label="Toggle Products menu"
              >
                <i className={`bi ${productsOpen ? "bi-dash" : "bi-plus"}`} />
              </button>

              <ul
                className={`sub-menu menu-big ${
                  productsOpen ? "show-submenu" : ""
                } ${
                  activeDropdown === "products" ? "desktop-submenu-open" : ""
                }`}
              >
                {products.map((product) => (
                  <li
                    key={product.href}
                    className={isActive(product.href) ? "active" : ""}
                  >
                    <Link
                      href={product.href}
                      onClick={() => {
                        // Mobile + Desktop dono par dropdown close
                        setProductsOpen(false);
                        setProductsHover(false);
                        setWhoOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span>{product.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Contact */}
            <li className={isActive("/contact-us") ? "active" : ""}>
              <Link href="/contact-us" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Contact */}
          <div className="contact-area d-lg-none d-flex">
            <div className="icon">
              <PhoneIcon />
            </div>

            <div className="content">
              <span>Any Question</span>
              <a href="tel:+918154888370">+91 8154 888 370</a>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="nav-right">
          {/* Desktop Contact */}
          <div className="contact-area d-lg-flex d-none">
            <div className="icon">
              <PhoneIcon />
            </div>

            <div className="content">
              <span>Any Question</span>
              <a href="tel:+918154888370">+91 8154 888 370</a>
            </div>
          </div>

          {/* WhatsApp */}
          <a
            className="right-sidebar-button"
            href="https://wa.me/917096007670"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
          >
            <WhatsAppIcon />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="sidebar-button mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
