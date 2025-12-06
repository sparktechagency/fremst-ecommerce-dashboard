import { Menu } from "antd";
import { useEffect, useState } from "react";
import {
  MdAddShoppingCart,
  MdCategory,
  MdFeaturedPlayList,
  MdOutlineAddBox,
  MdOutlineCreateNewFolder,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TbUserScreen } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import logo from "../../assets/logoTransBg.png";
import { FaBorderStyle, FaThList } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { BsBorderStyle } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("role");
    Cookies.remove("refreshToken");
    navigate("/auth/login");
  };

  // Get user role from local/session storage
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken?.role;

  // Define menu items for different roles
  const adminMenuItems = [
    {
      key: "/users",
      icon: <TbUserScreen size={24} />,
      label: <Link to="/users">Customers</Link>,
    },

    {
      key: "productMenu",
      icon: <AiFillProduct size={24} />,
      label: "Product",
      children: [
        {
          key: "/productList",
          icon: <FaThList size={24} />,
          label: (
            <Link to="/productList" className="text-white hover:text-white">
              Product List
            </Link>
          ),
        },
        {
          key: "/addProduct",
          icon: <MdAddShoppingCart size={24} />,
          label: (
            <Link to="/addProduct" className="text-white hover:text-white">
              Add Product
            </Link>
          ),
        },
      ],
    },
    {
      key: "/orders",
      icon: <FaBorderStyle size={24} />,
      label: <Link to="/orders">Orders</Link>,
    },
    {
      key: "/create-order",
      icon: <MdOutlineCreateNewFolder size={24} />,
      label: <Link to="/create-order">Create Order</Link>,
    },
    {
      key: "categoryMenu",
      icon: <MdCategory size={24} />,
      label: "Category",
      children: [
        {
          key: "/addCategory",
          icon: <MdOutlineAddBox size={24} />,
          label: (
            <Link to="/addCategory" className="text-white hover:text-white">
              Add Category
            </Link>
          ),
        },
      ],
    },
    {
      key: "subMenuSetting",
      icon: <IoSettingsOutline size={24} />,
      label: "Settings",
      children: [
        {
          key: "/personal-information",
          label: (
            <Link
              to="/personal-information"
              className="text-white hover:text-white"
            >
              Personal Information
            </Link>
          ),
        },
        {
          key: "/addAdmin",
          label: (
            <Link to="/addAdmin" className="text-white hover:text-white">
              Admin Management
            </Link>
          ),
        },
        {
          key: "/change-password",
          label: (
            <Link to="/change-password" className="text-white hover:text-white">
              Change Password
            </Link>
          ),
        },
        {
          key: "/terms-and-condition",
          label: (
            <Link
              to="/terms-and-condition"
              className="text-white hover:text-white"
            >
              Terms And Condition
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
        {
          key: "/f-a-q",
          label: (
            <Link to="/f-a-q" className="text-white hover:text-white">
              FAQ
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  const companyMenuItems = [
    {
      key: "/overview",
      icon: <MdFeaturedPlayList size={24} />,
      label: <Link to="/overview">Overview</Link>,
    },
    {
      key: "/company-products",
      icon: <MdOutlineProductionQuantityLimits size={24} />,
      label: <Link to="/company-products">Products</Link>,
    },

    {
      key: "/company-orders",
      icon: <BsBorderStyle size={24} />,
      label: <Link to="/company-orders">Orders</Link>,
    },
    {
      key: "/create-order",
      icon: <MdOutlineCreateNewFolder size={24} />,
      label: <Link to="/create-order">Create Order</Link>,
    },
    {
      key: "subMenuSetting",
      icon: <IoSettingsOutline size={24} />,
      label: "Settings",
      children: [
        // {
        //   key: "/personal-information",
        //   label: (
        //     <Link
        //       to="/personal-information"
        //       className="text-white hover:text-white"
        //     >
        //       Personal Information
        //     </Link>
        //   ),
        // },

        {
          key: "/change-password",
          label: (
            <Link to="/change-password" className="text-white hover:text-white">
              Change Password
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  // Combine all menu items based on role
  const getMenuItemsByRole = () => {
    if (userRole === "company") {
      return companyMenuItems;
    }
    return adminMenuItems;
  };

  const filteredMenuItems = getMenuItemsByRole();

  useEffect(() => {
    const selectedItem = filteredMenuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = filteredMenuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="mt-5 overflow-y-scroll">
      <div className="px-10 mb-10 flex items-center flex-col gap-2 justify-center py-4">
        <img src={logo} alt="" />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ borderRightColor: "transparent", background: "transparent" }}
        items={filteredMenuItems}
      />
    </div>
  );
};

export default Sidebar;
