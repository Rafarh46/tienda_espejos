"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Row } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AddToCardModal from "@src/commonsections/AddToCardModal";
import ProductModal from "./ProductModal";
import { useMedusaProducts } from "@src/lib/use-medusa-products";

type CardProduct = {
  id: string;
  title: string;
  imageUrl: string;
  hoverImageUrl?: string;
  price: string;
  rawProduct: any;
};

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

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

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
  const shownImage = product.hoverImageUrl && isHovered ? product.hoverImageUrl : product.imageUrl;

  return (
    <div
      className="topbar-product-card pb-3 w-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative overflow-hidden">
        {shownImage ? (
          <img src={shownImage} alt={product.title} className="img-fluid w-100" />
        ) : (
          <div className="bg-light w-100" style={{ aspectRatio: "1/1" }} />
        )}

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
      </div>

      <div className="mt-3">
        <h6 className="mb-1 fw-medium">
          <Link href="/product-detail-layout-01" className="main_link_acid_green">
            {product.title}
          </Link>
        </h6>

        <p className="mb-0 fs-14 text-muted">
          <span>{product.price || "Sin precio"}</span>
        </p>
      </div>
    </div>
  );
};

function mapMedusaToCardProduct(p: any): CardProduct {
  const imageUrl = p.thumbnail || p?.images?.[0]?.url || "";
  const priceAmount =
    p?.variants?.[0]?.calculated_price?.calculated_amount ?? p?.variants?.[0]?.prices?.[0]?.amount ?? null;

  return {
    id: p.id,
    title: p.title,
    imageUrl,
    hoverImageUrl: "",
    price: priceAmount != null ? `$${(priceAmount / 100).toFixed(2)}` : "",
    rawProduct: p,
  };
}

const FilterTab = () => {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState<(typeof PRODUCT_CATEGORIES)[number]>(PRODUCT_CATEGORIES[0]);
  const [show, setShow] = useState(false);
  const [cardShow, setCardShow] = useState(false);

  useEffect(() => {
    if (!categoryFromQuery) return;

    const normalizedQuery = normalize(categoryFromQuery);
    const match = PRODUCT_CATEGORIES.find((category) => normalize(category) === normalizedQuery);
    if (match) {
      setActiveCategory(match);
    }
  }, [categoryFromQuery]);

  const { products: medusaProducts, loading, error } = useMedusaProducts(48);
  const products = useMemo(() => medusaProducts.map(mapMedusaToCardProduct), [medusaProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedCategory = normalize(activeCategory);

    return products.filter((product) => {
      const medusaProduct = product.rawProduct;
      const searchParts = [
        product.title,
        medusaProduct?.handle,
        medusaProduct?.subtitle,
        medusaProduct?.collection?.title,
        medusaProduct?.type?.value,
        ...(medusaProduct?.tags?.map((tag: any) => tag?.value || tag?.title).filter(Boolean) ?? []),
      ]
        .filter(Boolean)
        .map((value) => normalize(String(value)));

      return searchParts.some((part) => part.includes(normalizedCategory));
    });
  }, [activeCategory, products]);

  return (
    <>
      <Container>
        <div className="mt-5">
          <h5 className="mb-3 text-center">Categorías</h5>
          <div className="d-flex gap-2 overflow-auto pb-2 justify-content-lg-center">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`btn rounded-pill px-3 py-2 text-nowrap ${
                  activeCategory === category ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="py-4 text-center text-muted">Cargando productos...</div>}
        {error && <div className="py-3 text-center text-danger">{error}</div>}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-4 text-center text-muted">
            No hay productos asignados a <strong>{activeCategory}</strong> todavía.
          </div>
        )}

        <div className="my-4">
          <Row className="g-lg-4 g-3">
            {filteredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
                <ProductCard
                  product={product}
                  handleShow={() => setShow(true)}
                  handleAddToCardModalShow={() => setCardShow(true)}
                />
              </div>
            ))}
          </Row>
        </div>
      </Container>

      <ProductModal show={show} handleClose={() => setShow(false)} />
      <AddToCardModal cardShow={cardShow} handleAddToCardModalClose={() => setCardShow(false)} />
    </>
  );
};

export default FilterTab;
