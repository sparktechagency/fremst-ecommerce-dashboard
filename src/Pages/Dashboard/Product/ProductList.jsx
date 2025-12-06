import React, { useState } from "react";
import { Table, Input, Button, Space, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { MdAdd, MdDelete, MdEditSquare } from "react-icons/md";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../redux/apiSlices/productSlice";
import moment from "moment/moment";
import toast from "react-hot-toast";
import Currency from "../../../utils/Currency";

const { Option } = Select;

const ProductList = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { data, isLoading, refetch } = useGetProductsQuery();

  const products = data?.data || [];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteProduct(id).unwrap();
      // refetch();
      toast.success(response?.data?.message || "Product deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product!");
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (statusFilter === "All" || statusFilter === ""
        ? true
        : product.availability === statusFilter)
    );
  });

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "serialNo",
      key: "serialNo",
      render: (_, record, index) => <p>{index + 1}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: ["category", "title"],
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <p>
          {text} <Currency />
        </p>
      ),
    },
    {
      title: "Stock Left",
      dataIndex: "stockLeft",
      key: "stockLeft",
      render: (text, record) => <p>{record?.quantity || "-"}</p>,
    },
    {
      title: "Status",
      dataIndex: "availability",
      key: "availability",
      render: (text, record) => (
        <span
          className={`${
            record.availability === true ? "text-green-600" : "text-red-600"
          } px-2 py-1 rounded`}
        >
          {record.availability == true ? "Available" : "Unavailable"}
        </span>
      ),
    },
    {
      title: "Published Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Link to={`/product/${record._id}`}>
            <MdEditSquare size={24} className="text-green-600" />
          </Link>
          <Button onClick={() => handleDelete(record._id)}>
            <MdDelete size={24} className="text-red-600" />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-4xl heading text-primary font-semibold my-5">
        Product List <span className="text-sm">({products?.length})</span>
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Search by product name"
            value={searchText}
            onChange={handleSearch}
            style={{ width: 200, height: 40 }}
          />
          <Select
            placeholder="Filter by status"
            onChange={handleStatusFilter}
            style={{ width: 200, height: 40 }}
            allowClear
          >
            <Option value="All">All</Option>
            <Option value="Available">Available</Option>
            <Option value="Unavailable">Unavailable</Option>
          </Select>
        </div>
        <Link to="/addProduct">
          <Button className="bg-primary text-white" style={{ height: 45 }}>
            <MdAdd size={24} /> Add Product
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        rowKey="_id"
        dataSource={filteredProducts}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default ProductList;
