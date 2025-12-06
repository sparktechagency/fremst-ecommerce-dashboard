import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Card,
  Image,
  Spin,
  Empty,
  Typography,
  Space,
  Badge,
  Button,
  Tag,
} from "antd";
import { useGetProductByCompanyQuery } from "../../redux/apiSlices/productSlice";
import ProductConfigModal from "./ProductConfigModal";
import { imageUrl } from "../../redux/api/baseApi";
import CartDrawer from "./CartDrawer";
import { readCart, writeCart } from "../../utils/orderCart";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Currency from "../../utils/Currency";

const { Text, Title } = Typography;

// cart utilities are imported from ../../utils/orderCart

function getEmployeeName(employee) {
  const user = employee?.user || {};
  if (user.name) return user.name;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || "";
}

function normalizeAddress(address) {
  if (!address || typeof address !== "object") {
    return { city: "", postalCode: "", streetAddress: "" };
  }
  return {
    city: address.city || "",
    postalCode: address.postalCode || address.postCode || "",
    streetAddress:
      address.streetAddress || address.street || address.address || "",
  };
}

// using readCart and writeCart from utils

export default function OrderCreationModal({
  open,
  onClose,
  companyId,
  employee,
}) {
  const { data, isLoading } = useGetProductByCompanyQuery(companyId, {
    skip: !companyId || !open,
  });
  const products = useMemo(() => data?.data || [], [data]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const cart = readCart();
      setCartCount(Array.isArray(cart?.item) ? cart.item.length : 0);
      // Initialize cart skeleton if absent
      const name = getEmployeeName(employee);
      const address = normalizeAddress(employee?.user?.address);
      if (!cart) {
        writeCart({
          name,
          additionalInfo: "",
          item: [],
          address,
          employeeId: employee?._id,
        });
      }
    }
  }, [open, employee]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setConfigOpen(true);
  };

  const handleAddToCart = ({ productId, quantity, size }) => {
    // Persist according to requested shape; additionalInfo is manual only
    const cart = readCart() || {
      name: getEmployeeName(employee),
      item: [],
      address: normalizeAddress(employee?.user?.address),
      employeeId: employee?._id,
    };
    const next = {
      ...cart,
      employeeId: cart.employeeId || employee?._id,
      item: [
        ...(Array.isArray(cart.item) ? cart.item : []),
        { product: productId, quantity, size },
      ],
    };
    writeCart(next);
    setCartCount(next.item.length);
    setConfigOpen(false);
    setSelectedProduct(null);
  };

  const handleClose = () => {
    setConfigOpen(false);
    setSelectedProduct(null);
    onClose?.();
  };

  return (
    <Modal
      title="Create Order: Select Products"
      open={open}
      onCancel={handleClose}
      onOk={handleClose}
      width={1000}
      footer={null}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space
          align="center"
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          <div>
            <Title level={5} style={{ margin: 0 }}>
              Employee: {getEmployeeName(employee) || "Unknown"}
            </Title>
            <Text type="secondary">Company Products</Text>
          </div>
          <Badge count={cartCount} showZero>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              onClick={() => setCartOpen(true)}
            >
              Cart
            </Button>
          </Badge>
        </Space>

        {null}

        {isLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 24 }}
          >
            <Spin />
          </div>
        ) : products?.length ? (
          <Row gutter={[16, 16]}>
            {products.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
                <Card
                  hoverable
                  onClick={() => handleProductClick(p)}
                  cover={
                    <div style={{ padding: 12 }}>
                      <Image
                        src={p.image ? `${imageUrl}/${p.image}` : undefined}
                        alt={p.name}
                        fallback="https://via.placeholder.com/300x200?text=No+Image"
                        style={{ height: 160, objectFit: "contain" }}
                        preview={false}
                      />
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Text strong>{p.name}</Text>
                    <Space>
                      {p.updatedPrice ? (
                        <Text type="success">${p.updatedPrice}</Text>
                      ) : p.price ? (
                        <Text>
                          {p.price} <Currency />
                        </Text>
                      ) : (
                        <Text type="secondary">Price N/A</Text>
                      )}
                    </Space>
                    <Text type="secondary" ellipsis>
                      {Array.isArray(p.sizes)
                        ? `Sizes: ${p.sizes.join(", ")}`
                        : "Sizes: N/A"}
                    </Text>
                    <Tag
                      color={
                        typeof p.quantity === "number" && p.quantity === 0
                          ? "red"
                          : "green"
                      }
                    >
                      Available:{" "}
                      {typeof p.quantity === "number" ? p.quantity : 0}
                    </Tag>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No products found for this company" />
        )}

        <ProductConfigModal
          open={configOpen}
          product={selectedProduct}
          onClose={() => {
            setConfigOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          products={products}
          companyId={companyId}
          employee={employee}
        />
      </Space>
    </Modal>
  );
}
