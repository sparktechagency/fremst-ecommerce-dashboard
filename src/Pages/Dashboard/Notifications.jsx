import React, { useState } from "react";
import { ConfigProvider, Pagination, Empty, Spin } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Title from "../../components/common/Title";
import {
  useNotificationQuery,
  useReadNotificationMutation,
} from "../../redux/apiSlices/notificationSlice";
import moment from "moment";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: notifications, isLoading } = useNotificationQuery();
  const [readNotification] = useReadNotificationMutation();

  const notificationData = notifications?.data || [];

  const paginatedData = notificationData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleReadNotification = async (id) => {
    try {
      await readNotification(id).unwrap();
    } catch (error) {
      console.error("Error reading notification:", error);
    }
  };

  const getNotificationIcon = (title) => {
    if (title?.toLowerCase().includes("order")) {
      return <ShoppingCartOutlined className="text-xl" />;
    }
    return <BellOutlined className="text-xl" />;
  };

  const unreadCount = notificationData.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#464baf] rounded-xl flex items-center justify-center shadow-lg">
              <BellOutlined className="text-white text-2xl" />
            </div>
          </div>
          <div>
            <Title className="text-2xl font-bold text-gray-800 mb-0">
              Notifications
            </Title>
            <p className="text-gray-500 text-sm">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "All caught up!"}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
          </div>
        ) : paginatedData?.length === 0 ? (
          <div className="py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400">No notifications yet</span>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginatedData?.map((notification, index) => (
              <div
                key={notification._id}
                onClick={() => handleReadNotification(notification._id)}
                className={`
                  group relative flex items-start gap-4 p-5 cursor-pointer
                  transition-all duration-300 ease-out
                  hover:bg-gradient-to-r hover:from-secondary/30 hover:to-transparent
                  ${!notification.isRead ? "bg-secondary/20" : "bg-white"}
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-[#464baf] rounded-r" />
                )}

                {/* Icon */}
                <div
                  className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  transition-all duration-300
                  ${
                    !notification.isRead
                      ? "bg-gradient-to-br from-primary to-[#464baf] text-white shadow-md"
                      : "bg-gray-100 text-gray-500 group-hover:bg-secondary group-hover:text-primary"
                  }
                `}
                >
                  {getNotificationIcon(notification.title)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`
                        text-sm font-semibold mb-1 truncate
                        ${
                          !notification.isRead
                            ? "text-gray-900"
                            : "text-gray-700"
                        }
                      `}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {notification.isRead ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircleOutlined className="text-xs" />
                          Read
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-primary bg-secondary px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 mt-3">
                    <ClockCircleOutlined className="text-xs text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {moment(notification.createdAt).fromNow()}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">
                      {moment(notification.createdAt).format(
                        "MMM DD, YYYY • h:mm A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {notificationData.length > 0 && (
          <div className="flex items-center justify-center py-6 px-4 border-t border-gray-100 bg-gray-50/50">
            <ConfigProvider
              theme={{
                components: {
                  Pagination: {
                    itemActiveBg: "#292c61",
                    colorPrimary: "#ffffff",
                    colorPrimaryHover: "#292c61",
                    borderRadius: 8,
                  },
                },
              }}
            >
              <Pagination
                current={page}
                total={notificationData.length}
                pageSize={pageSize}
                onChange={(newPage) => setPage(newPage)}
                showQuickJumper={false}
                showSizeChanger={true}
                pageSizeOptions={["5", "10", "15", "20"]}
                onShowSizeChange={(_, size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                showTotal={(total, range) => (
                  <span className="text-gray-500 text-sm">
                    Showing {range[0]}-{range[1]} of {total} notifications
                  </span>
                )}
              />
            </ConfigProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
