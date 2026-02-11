"use client";
import React, { useEffect, useState } from "react";
import { useMedusaProducts } from "@src/lib/use-medusa-products";

import { brandData, priceData, sizeData, vendorData } from "@src/common/shop/filterData";
import AddToCardModal from "@src/commonsections/AddToCardModal";
import Link from "next/link";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import ProductModal from "./ProductModal";

type CardProduct = {
  id: string;
  title: string;
  imageUrl: string;
  hoverImageUrl?: string;
  price: string;
  del?: string;
  label?: string;
  labelClass?: string;
  colors?: any;
  color?: any;
};

const ProductCard = ({
  product,
  handleShow,
  handleAddToCardModalShow,
}: {
  product: CardProduct;
  handleShow: () => void;
  handleAddToCardModalShow: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const shownImage = product.hoverImageUrl ? (isHovered ? product.hoverImageUrl : imageUrl) : imageUrl;

  return (
    <div
      className="topbar-product-card pb-3 w-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative overflow-hidden">
        {product.label ? (
          <span className={`new-label ${product.labelClass ?? ""} text-white rounded-circle`}>{product.label}</span>
        ) : null}

        {/* ✅ Usar <img> para evitar problemas con next/image y URLs remotas */}
        {shownImage ? (
          <img src={shownImage} alt={product.title} className="img-fluid w-100" />
        ) : (
          <div className="bg-light w-100" style={{ aspectRatio: "1/1" }} />
        )}

        <Link
          href="#"
          className="d-lg-none position-absolute"
          style={{ zIndex: 1, top: 10, left: 10 }}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Add to Wishlist"
        >
          <i className="facl facl-heart-o text-white"></i>
        </Link>

        <Link
          href="#"
          className="wishlistadd d-none d-lg-flex position-absolute"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Add to Wishlist"
        >
          <i className="facl facl-heart-o text-white"></i>
        </Link>

        <div className="product-button d-none d-lg-flex flex-column gap-2">
          <Link href="#exampleModal" data-bs-toggle="modal" className="btn rounded-pill fs-14" onClick={handleShow}>
            <span>Quick View</span>
            <i className="iccl iccl-eye"></i>
          </Link>
          <button
            type="button"
            className="btn rounded-pill fs-14"
            data-bs-toggle="modal"
            data-bs-target="#cardModal"
            onClick={handleAddToCardModalShow}
          >
            <span>Quick Shop</span>
            <i className="iccl iccl-cart"></i>
          </button>
        </div>

        <div
          className="position-absolute d-lg-none bottom-0 end-0 d-flex flex-column bg-white rounded-pill m-2"
          style={{ zIndex: 1 }}
        >
          <Link
            href="#exampleModal"
            data-bs-toggle="modal"
            className="btn responsive-cart rounded-pill fs-14 p-2"
            style={{ width: 36, height: 36 }}
            onClick={handleShow}
          >
            <i className="iccl iccl-eye fw-semibold"></i>
          </Link>
          <button
            type="button"
            className="btn responsive-cart rounded-pill fs-14 p-2"
            style={{ width: 36, height: 36 }}
            data-bs-toggle="modal"
            data-bs-target="#cardModal"
            onClick={handleAddToCardModalShow}
          >
            <i className="iccl iccl-cart fw-semibold"></i>
          </button>
        </div>
      </div>

      <div className="mt-3">
        <h6 className="mb-1 fw-medium">
          <Link href="/product-detail-layout-01" className="main_link_acid_green">
            {product.title}
          </Link>
        </h6>

        {product.del ? (
          <p className="mb-0 fs-14 text-muted">
            <del>{product.del}</del>&nbsp;<span className="text-danger">{product.price}</span>
          </p>
        ) : (
          <p className="mb-0 fs-14 text-muted">
            <span>{product.price}</span>
          </p>
        )}

        {/* Por ahora sin colores (Medusa no trae ese formato en este template) */}
      </div>
    </div>
  );
};

function mapMedusaToCardProduct(p: any): CardProduct {
  const imageUrl = p.thumbnail || p?.images?.[0]?.url || "";

  // Nota: dependiendo tu backend, calculated_price puede no venir.
  const priceAmount =
    p?.variants?.[0]?.calculated_price?.calculated_amount ??
    p?.variants?.[0]?.prices?.[0]?.amount ??
    null;

  return {
    id: p.id,
    title: p.title,
    imageUrl,
    hoverImageUrl: "",
    price: priceAmount != null ? `$${(priceAmount / 100).toFixed(2)}` : "",
    del: "",
    label: "",
    labelClass: "bg-success",
    colors: null,
    color: null,
  };
}

const FilterTab = () => {
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [cardShow, setCardShow] = useState(false);
  const [display, setDisplay] = useState<number | null>(3);

  const { products: medusaProducts, loading, error } = useMedusaProducts(24);
  const products: CardProduct[] = medusaProducts.map(mapMedusaToCardProduct);

  // ✅ mejor control de modales
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleAddToCardModalShow = () => setCardShow(true);
  const handleAddToCardModalClose = () => setCardShow(false);

  const handleOpen = () => setOpen(!open);
  const handleClick = (id: number) => setDisplay(display === id ? null : id);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setDisplay(1);
      else setDisplay(3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <React.Fragment>
      <Container>
        {/* ✅ feedback al usuario */}
        {loading && <div className="py-4 text-center text-muted">Cargando productos...</div>}
        {error && <div className="py-3 text-center text-danger">{error}</div>}

        <div className="mt-5 d-flex justify-content-between align-items-center">
          <Link
            href="#!"
            className="text-muted fs-16 align-items-center d-none d-lg-flex"
            id="filter-icon"
            onClick={handleOpen}
          >
            <i className={`iccl fwb iccl-filter fwb me-2 fw-medium ${open === false ? "d-none" : ""}`} id="icon-filter"></i>
            <i
              className={`pe-7s-close pegk ${open === false ? "" : "d-none"} me-2 fw-medium fw-semibold`}
              id="icon-close"
              style={{ fontSize: "24px" }}
            ></i>
            <p className="mb-0">Filter</p>
          </Link>

          <div className="d-flex align-items-center d-lg-none fs-16 text-muted" data-bs-toggle="offcanvas">
            <i className="iccl fwb iccl-filter fwb me-2 fw-medium" id="icon-filter"></i>
            <i className="pe-7s-close pegk d-none me-2 fw-medium fw-semibold" id="icon-close" style={{ fontSize: "24px" }}></i>
            <p className="mb-0">Filter</p>
          </div>

          {/* ... aquí deja tu tab header y dropdown tal cual ... */}
        </div>

        {/* ... deja tu filter-box tal cual ... */}

        {/* ✅ Solo cambio: ProductData -> products */}
        <div className="tab-content my-3 my-md-4" id="pills-tabContent">
          <div className={`tab-pane fade ${display === 6 ? "active show" : ""}`} id="best-pan1" role="tabpanel" tabIndex={0}>
            <Row className="g-lg-4 g-3">
              {products.map((product) => (
                <div className="col-12" key={product.id}>
                  <ProductCard product={product} handleShow={handleShow} handleAddToCardModalShow={handleAddToCardModalShow} />
                </div>
              ))}
            </Row>
          </div>
        </div>

        {/* Repite igual para los otros displays, solo cambiando el col-* como ya lo tienes */}
      </Container>

      <ProductModal show={show} handleClose={handleClose} />
      <AddToCardModal cardShow={cardShow} handleAddToCardModalClose={handleAddToCardModalClose} />
    </React.Fragment>
  );
};

export default FilterTab;
