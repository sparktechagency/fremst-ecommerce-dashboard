import { useParams } from "react-router-dom";
import { useGetEmployeesByCompanyQuery } from "../../redux/apiSlices/userSlice";
import { Button, Spin, Table } from "antd";
import OrderCreationModal from "./OrderCreationModal";
import React, { useState } from "react";
import Currency from "../../utils/Currency";

const EmployeesByCompany = ({ companyId }) => {
  const { id: routeId } = useParams();
  const id = companyId ?? routeId;

  const { data: getEmployeesByCompany, isLoading } =
    useGetEmployeesByCompanyQuery(id);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  const employees = getEmployeesByCompany?.data?.data || [];
  const meta = getEmployeesByCompany?.data?.meta || {
    page: 1,
    limit: employees.length || 10,
    total: employees.length || 0,
    totalPage: 1,
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: ["user", "contact"],
      key: "contact",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (budget) => (
        <p>
          {budget?.toFixed(2)} <Currency />
        </p>
      ),
    },
    {
      title: "Budget Left",
      dataIndex: "budgetLeft",
      key: "budgetLeft",
      render: (budgetLeft) => (
        <p>
          {budgetLeft?.toFixed(2)} <Currency />
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            className="bg-primary"
            onClick={() => {
              setSelectedEmployee(record);
              setOrderModalOpen(true);
            }}
          >
            Create Order
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl heading mb-4">Employees</h1>
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="_id"
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
        }}
      />

      <OrderCreationModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        companyId={id}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesByCompany;
