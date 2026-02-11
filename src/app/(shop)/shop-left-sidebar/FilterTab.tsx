"use client";
import React, { useEffect, useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { useMedusaProducts } from "@src/lib/use-medusa-products";

import { brandData, priceData, sizeData, vendorData } from "@src/common/shop/filterData";
import AddToCardModal from "@src/commonsections/AddToCardModal";
import ProductModal from "@src/commonsections/ProductModal";
import Image from "next/image";
import Link from "next/link";
import ProductCategories from "./ProductCategories";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import SizeFilter from "./SizeFilter";

type CardProduct = {
  id: string;
  title: string;
  imageUrl: any; // puede ser string (Medusa) o StaticImageData (template)
  hoverImageUrl?: any;
  price: string;
  del?: string;
  label?: string;
  labelClass?: string;
  colors?: any;
  color?: any;
};

const ProductCard = ({ product, handleShow, handleAddToCardModalShow }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  return (
    <div
      className="topbar-product-card pb-3 w-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative overflow-hidden">
        {product.label && (
          <span className={`new-label ${product.labelClass} text-white rounded-circle`}>
            {product.label}
          </span>
        )}

        {product.hoverImageUrl ? (
          <Image
            src={isHovered ? product.hoverImageUrl : imageUrl}
            alt="image"
            className="img-fluid w-100"
          />
        ) : (
          <Image src={imageUrl} alt="ImageUrlImg" className="img-fluid w-100" />
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
          <Link
            href="#exampleModal"
            data-bs-toggle="modal"
            className="btn rounded-pill fs-14"
            onClick={handleShow}
          >
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

        {product.colors ? (
          <div className="product-color-list mt-2 gap-2 d-flex align-items-center">
            {product.colors.map((color: any, index: number) => (
              <Link
                key={index}
                href="#!"
                onMouseOver={() => setImageUrl(color.imageUrl)}
                onClick={(e) => {
                  e.preventDefault();
                  setImageUrl(color.imageUrl);
                }}
                className={`d-inline-block ${color.color} rounded-circle`}
              ></Link>
            ))}
          </div>
        ) : (
          <div className="product-color-list mt-2 gap-2 d-flex align-items-center">
            {product.color &&
              product.color.map((color: any, index: number) => (
                <Link
                  href="#!"
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setImageUrl(color.imageUrl);
                    setIsHovered(false);
                  }}
                  style={{
                    background: `url('${color.imageUrl.src}')`,
                    backgroundSize: "cover",
                  }}
                  className="d-inline-block bg-body-tertiary rounded-circle"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

function mapMedusaToCardProduct(p: any): CardProduct {
  const imageUrl = p.thumbnail || p?.images?.[0]?.url || "";
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

  // ✅ AQUI se define products (esto era lo que faltaba)
  const { products: medusaProducts, loading, error } = useMedusaProducts(24);
  const products: CardProduct[] = medusaProducts.map(mapMedusaToCardProduct);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setDisplay(1);
      else setDisplay(3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShow = () => setShow(!show);
  const handleAddToCardModalShow = () => setCardShow(true);
  const handleAddToCardModalClose = () => setCardShow(false);
  const handleOpen = () => setOpen(!open);

  const handleClick = (id: number) => {
    setDisplay(display === id ? null : id);
  };

  return (
    <React.Fragment>
      <Container>
        {loading && <div className="py-3 text-center text-muted">Cargando productos...</div>}
        {error && <div className="py-2 text-center text-danger">{error}</div>}

        <div className=" mt-5 d-flex justify-content-between align-items-center">
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

          <ul className="nav tab_header tab_filter gap-2 justify-content-end justify-content-sm-center" id="pills-tab" role="tablist">
            <li className="nav-item d-sm-none" role="presentation">
              <button className={`nav-link ${display === 6 ? "active" : ""}`} type="button" onClick={() => handleClick(6)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link ${display === 1 ? "active" : ""}`} type="button" onClick={() => handleClick(1)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
            <li className="nav-item d-none d-sm-block" role="presentation">
              <button className={`nav-link ${display === 2 ? "active" : ""}`} type="button" onClick={() => handleClick(2)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
            <li className="nav-item d-none d-md-block" role="presentation">
              <button className={`nav-link ${display === 3 ? "active" : ""}`} type="button" onClick={() => handleClick(3)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
            <li className="nav-item d-none d-lg-block" role="presentation">
              <button className={`nav-link ${display === 4 ? "active" : ""}`} type="button" onClick={() => handleClick(4)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
            <li className="nav-item d-none d-xl-block" role="presentation">
              <button className={`nav-link ${display === 5 ? "active" : ""}`} type="button" onClick={() => handleClick(5)}>
                <div className="filter-option d-flex">
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                  <div className="grid1"></div>
                </div>
              </button>
            </li>
          </ul>

          <Dropdown>
            <Dropdown.Toggle className="btn d-flex align-items-center justify-content-between featurnBtn rounded-pill dropdown-toggle" type="button">
              Feature
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu filter-dropdown">
              <Dropdown.Item as="div"><Link href="#">Feature</Link></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* filtros (dejados igual) */}
        <div className={`p-4 filter-box ${open === false ? "" : "d-none"} mt-4`}>
          <Row className="m-sm-2 g-4 g-sm-2">
            <Col sm={6} lg={3}>
              <h5 className="mb-1 fw-medium"> By Vendor </h5>
              <div className="filter-title"></div>
              <div className="mt-3 filter-category">
                {vendorData.map((item: any, index: number) => (
                  <div key={index} className="round d-flex align-items-center pt-2 mb-2 gap-1">
                    <input className={item.color} type="checkbox" value="" id="colo1" />
                    <label className="form-check-label ms-1" style={{ cursor: "pointer" }} htmlFor="color ">
                      {item.colorName}
                    </label>
                  </div>
                ))}
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <h5 className="mb-1 fw-medium"> By Price </h5>
              <div className="filter-title"></div>
              <div className="mt-3">
                {priceData.map((item: any, index: number) => (
                  <div key={index} className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheck1" />
                    <label className="form-check-label" htmlFor="flexCheck1">
                      {item.price}
                    </label>
                  </div>
                ))}
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <h5 className="mb-1 fw-medium"> By Size </h5>
              <div className="filter-title"></div>
              <div className="mt-3">
                {sizeData.map((item: any, index: number) => (
                  <div key={index} className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked11" />
                    <label className="form-check-label" htmlFor="flexCheckChecked11" style={{ cursor: "pointer" }}>
                      {item.size}
                    </label>
                  </div>
                ))}
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <h5 className="mb-1 fw-medium"> By Brand </h5>
              <div className="filter-title"></div>
              <div className="mt-3">
                {brandData.map((item: any, index: number) => (
                  <div key={index} className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" value="" id="flex23" />
                    <label className="form-check-label" htmlFor="flex23">
                      {item.brand}
                    </label>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        <Row>
          <Col lg={3} className="d-none d-lg-block filter-box border-0" style={{ boxShadow: "none" }}>
            <ProductCategories />
            <PriceFilter />
            <ColorFilter />
            <SizeFilter />
          </Col>

          <Col lg={9}>
            {/* ✅ Aquí ya NO debe quedar ProductData.slice(...) */}
            <div className="tab-content my-3 my-md-4">
              <div className={`tab-pane fade ${display === 6 ? "active show" : ""}`} role="tabpanel" tabIndex={0}>
                <Row className="g-lg-4 g-3">
                  {products.map((product: any) => (
                    <div className="col-12" key={product.id}>
                      <ProductCard product={product} handleShow={handleShow} handleAddToCardModalShow={handleAddToCardModalShow} />
                    </div>
                  ))}
                </Row>
              </div>
            </div>

            {/* Repite tus 5 layouts, pero SIEMPRE con products.map */}
            {/* (si quieres, luego lo refactorizamos a una sola función para no duplicar) */}
          </Col>
        </Row>
      </Container>

      <ProductModal show={show} handleClose={handleShow} />
      <AddToCardModal cardShow={cardShow} handleAddToCardModalClose={handleAddToCardModalClose} />
    </React.Fragment>
  );
};

export default FilterTab;
