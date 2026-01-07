import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    admin: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user?role=ADMIN",
        };
      },
    }),
    getAllCompanies: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/admin/companies",
        };
      },
      providesTags: ["Company"],
    }),
    getCompanyById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/admin/company/${id}`,
        };
      },
      providesTags: ["Company"],
    }),
    getEmployeesByCompany: builder.query({
      query: (arg) => {
        const companyId = typeof arg === "object" ? arg.id : arg;
        const params = { companyId };
        if (typeof arg === "object") {
          if (arg.page) params.page = arg.page;
          if (arg.limit) params.limit = arg.limit;
        }
        return {
          method: "GET",
          url: `/admin/employees/`,
          params: params,
        };
      },
      providesTags: ["Employee"],
    }),
    getSingleEmployeeById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/admin/employee/${id}`,
        };
      },
      providesTags: ["Employee"],
    }),
    createCompany: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/user/create-account",
          body: data,
        };
      },
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/admin/company/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Company"],
    }),
    getAllAdmins: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/admin/admins",
        };
      },
      providesTags: ["Admin"],
    }),
    createAdmin: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/user/create-account",
          body: data,
        };
      },
      invalidatesTags: ["Admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/user/admin/${id}`,
        };
      },
      invalidatesTags: ["Admin"],
    }),
    getCompanyProfile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/user/profile`,
        };
      },
      providesTags: ["Company"],
    }),
    getEmployeesForCompany: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/admin/employees`,
        };
      },
      providesTags: ["Employee"],
    }),

    createEmployee: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/user/create-account",
          body: data,
        };
      },
      invalidatesTags: ["Employee"],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/admin/employee/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Employee"],
    }),

    deleteUser: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/user/${id}`,
        };
      },
      invalidatesTags: ["Employee", "Company"],
    }),
  }),
});

export const {
  useAdminQuery,
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetEmployeesByCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetAllAdminsQuery,
  useGetSingleEmployeeByIdQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetCompanyProfileQuery,
  useGetEmployeesForCompanyQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteUserMutation,
} = userSlice;
