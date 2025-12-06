import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetProductByCompanyQuery,
  useGetProductsQuery,
  useUpdateProductAvailabilityMutation,
  useUpdateProductPriceMutation,
} from "../../redux/apiSlices/productSlice";
import logo from "../../assets/logo.png";
import { Table, Input, Checkbox, Button, Tabs, Spin } from "antd";
import { useGetCompanyByIdQuery } from "../../redux/apiSlices/userSlice";
import toast from "react-hot-toast";

const ManageSingleCompanyPrices = () => {
  const { id } = useParams();
  const { data: products, isLoading } = useGetProductsQuery();
  const { data: getCompanyProducts, isLoading: isCompanyProductLoading } =
    useGetProductByCompanyQuery(id);
  const { data: singleCompany, isLoading: isSingleCompanyLoading } =
    useGetCompanyByIdQuery(id);
  const [assignAvailability, { isLoading: isAssignAvailabilityLoading }] =
    useUpdateProductAvailabilityMutation();
  const [updateProductPrice, { isLoading: isUpdateProductPriceLoading }] =
    useUpdateProductPriceMutation();

  const [selectedProducts, setSelectedProducts] = useState({});
  const [updatedPrices, setUpdatedPrices] = useState({});
  const [activeTab, setActiveTab] = useState("assignProducts");

  const productList = products?.data || [];
  const company = singleCompany?.data;
  const availableProducts = company?.availableProducts || [];
  const companyProducts = getCompanyProducts?.data || [];

  useEffect(() => {
    if (availableProducts.length) {
      const selectedMap = availableProducts.reduce((acc, productId) => {
        acc[productId] = true;
        return acc;
      }, {});
      setSelectedProducts(selectedMap);
    }
  }, [availableProducts]);

  const handleCheckboxChange = useCallback((productId) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  const handlePriceChange = useCallback((productId, value) => {
    setUpdatedPrices((prev) => ({
      ...prev,
      [productId]: value === "" ? undefined : value,
    }));
  }, []);

  const handleSubmit = async () => {
    const selectedProductIds = Object.keys(selectedProducts).filter(
      (productId) => selectedProducts[productId]
    );

    if (selectedProductIds.length === 0) {
      return toast.error("No products selected.");
    }

    try {
      if (activeTab === "assignProducts") {
        // Call the assign availability API
        const response = await assignAvailability({
          id,
          data: { products: selectedProductIds },
        }).unwrap();

        response?.success
          ? toast.success(response?.message)
          : toast.error(response?.message);
      } else if (activeTab === "assignPrices") {
        // Prepare data for price update
        const priceUpdateData = selectedProductIds.map((productId) => {
          const updatedPrice =
            updatedPrices[productId] !== undefined
              ? Number(updatedPrices[productId])
              : companyProducts.find((product) => product._id === productId)
                  ?.updatedPrice ||
                companyProducts.find((product) => product._id === productId)
                  ?.salePrice;

          return {
            product: productId,
            price: updatedPrice,
          };
        });
        const data = {
          products: priceUpdateData,
        };
        // Call the update price API
        const response = await updateProductPrice({
          id,
          data,
        }).unwrap();

        response?.success
          ? toast.success(response?.message)
          : toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update prices");
    }
  };

  if (isLoading || isSingleCompanyLoading || isCompanyProductLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  const columns = [
    activeTab === "assignProducts" && {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={!!selectedProducts[record._id]}
          onChange={() => handleCheckboxChange(record._id)}
        />
      ),
    },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: ["category", "title"],
      key: "category",
    },
    {
      title: "Regular Price",
      dataIndex: "price",
      key: "regularPrice",
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (price, record) => (
        <span>{record?.updatedPrice ? record?.updatedPrice : salePrice}</span>
      ),
    },
    activeTab === "assignPrices" && {
      title: "Assign Price",
      dataIndex: "assignPrice",
      key: "assignPrice",
      render: (_, record) => (
        <Input
          type="number"
          value={
            updatedPrices[record._id] !== undefined
              ? updatedPrices[record._id]
              : record.updatedPrice || record.salePrice || ""
          }
          onChange={(e) => handlePriceChange(record._id, e.target.value)}
          placeholder="Enter price"
        />
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl text-center">
        Manage Product Prices for <br />
        <span className="font-bold text-primary">{company?.user?.name}</span>
      </h1>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "assignProducts", label: "Assign Products" },
          { key: "assignPrices", label: "Assign Prices" },
        ]}
      />
      <div className="my-5">
        <Table
          dataSource={
            activeTab === "assignPrices"
              ? companyProducts.filter(
                  (product) => selectedProducts[product._id]
                )
              : [...companyProducts].sort(
                  (a, b) =>
                    (selectedProducts[b._id] ? 1 : 0) -
                    (selectedProducts[a._id] ? 1 : 0)
                )
          }
          pagination={false}
          columns={columns}
          rowKey="_id"
          scroll={{ y: 500 }}
        />
        <div className="text-right mt-4">
          <Button
            onClick={handleSubmit}
            className="bg-primary text-white px-5 py-2"
            loading={isAssignAvailabilityLoading}
          >
            Submit Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageSingleCompanyPrices;
