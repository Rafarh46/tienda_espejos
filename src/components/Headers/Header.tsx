"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import LoginModal from "@src/components/Headers/LoginModal";
import SearchModal from "@src/components/Headers/SearchModal";
import ShoppingCardModal from "@src/commonsections/ShoppingCardModal";
import MainModel from "@src/commonsections/MainModel";
import Image from "next/image";
import Link from "next/link";
import USD from "@assets/images/svg/usd.svg";
import logo from "@assets/images/svg/kalles.svg";

const PRODUCT_CATEGORIES = [
  "Espejos Antivaho",
  "Espejos Quatró Caras",
  "Espejo Manchado/Avejentado",
  "Espejos con Luz Led",
  "Espejos Para Camerino",
  "Muro glass",
  "Espejos Vestidor",
  "Espejos Modernos",
  "Espejos Decorativos",
  "Moldura para Tú Espejo",
  'Espejos Distorsión "La Casa de Risa"',
] as const;

const Header = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [searchShow, setSearchShow] = useState(false);
  const [shoppingShow, setShoppingShow] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const [isStickyActive, setIsStickyActive] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop < lastScrollTop && scrollTop > 250) {
        setIsStickyActive(true);
      } else {
        setIsStickyActive(false);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <MainModel />

      <div id="kalles-section-header_top" ref={headerRef}>
        <div className="h__top d-flex align-items-center">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center py-2 gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-3 small text-muted">
                <Link href="tel:+521000000000" className="text-muted">
                  <i className="pegk pe-7s-call fs-14 me-1 align-middle"></i> +52 1 000 000 0000
                </Link>
                <Link href="mailto:contacto@tiendaespejos.com" className="text-muted">
                  <i className="pe-7s-mail pegk fs-14 me-1 align-middle"></i> contacto@tiendaespejos.com
                </Link>
              </div>

              <div className="small text-muted text-center">Promociones especiales en espejos seleccionados.</div>

              <Dropdown>
                <Dropdown.Toggle variant="link" className="fs-12 text-reset currency-button p-0 border-0" id="dropdown-currency">
                  <Image src={USD} alt="USD" height={12} className="me-1" /> USD <i className="facl facl-angle-down ms-1"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-2 dropdown-currency">
                  <Dropdown.Item as="button" className="fs-13">USD</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
        </div>

        <div className={`header-wrap py-3 py-lg-0 ${isStickyActive ? "headerFixed" : ""}`}>
          <Container fluid>
            <nav className="navbar navbar-expand-lg navbar-custom p-0">
              <Link className="navbar-brand" href="/">
                <Image src={logo} alt="Logo" priority />
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                aria-expanded={menuOpen}
                aria-label="Toggle navigation"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
                <ul className="navbar-nav mx-auto align-items-lg-center">
                  <li className="nav-item">
                    <Link className="nav-link" href="/">
                      Inicio
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link text-decoration-none"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Categorías
                    </button>
                    <ul className="dropdown-menu">
                      {PRODUCT_CATEGORIES.map((category) => (
                        <li key={category}>
                          <Link href={`/shop?category=${encodeURIComponent(category)}`} className="dropdown-item">
                            {category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/shop">
                      Promociones
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" href="/contact-us">
                      Contacto
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-tool navbar-tool-right d-flex align-items-center gap-3 mb-0">
                  <li>
                    <Link href="#searchModal" data-bs-toggle="modal" onClick={() => setSearchShow(true)}>
                      <i className="iccl iccl-search"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#loginModal" data-bs-toggle="modal" onClick={() => setLoginShow(true)}>
                      <i className="iccl iccl-user"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-bs-toggle="offcanvas"
                      href="#shoppingCartOffcanvas"
                      aria-controls="shoppingCartOffcanvas"
                      onClick={() => setShoppingShow(true)}
                    >
                      <i className="iccl iccl-cart"></i>
                      <span className="tcount bg-dark text-white rounded-circle d-flex align-items-center justify-content-center">0</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </Container>
        </div>
      </div>

      <SearchModal searchShow={searchShow} handleClose={() => setSearchShow(false)} />
      <LoginModal loginShow={loginShow} handleClose={() => setLoginShow(false)} />
      <ShoppingCardModal shoppingShow={shoppingShow} handleShoppingClose={() => setShoppingShow(false)} />
    </>
  );
};

export default Header;
