import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import NotFound from "@/components/Notfound";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/Dashboard/Dashboard";
import LoginPage from "@/Login/LoginPage";
import Items from "@/Items/Items";
import ItemsTable from "@/Items/ItemsTable";
import ItemsDetails from "@/Items/ItemsDetails";
import Vendors from "@/Vendors/Vendors";
import VendorsTable from "@/Vendors/VendorsTable";
import VendorsDetails from "@/Vendors/VendorsDetails";
import StockCount from "@/StockCount/StockCount";
import StockCountTable from "@/StockCount/StockCountTable";
import StockCountDetails from "@/StockCount/StockCountDetails";
import SplashScreen from "@/components/SplashScreen";
import Documents from "@/Documents/Documents";
import Requests from "@/Documents/Requests/Requests";
import { FinalDocuments } from "@/Documents/Final Documents/FinalDocuments";
import Purchase from "@/Documents/Requests/Purchase/Purchase";
import PurchaseTable from "@/Documents/Requests/Purchase/PurchaseTable";
import PurchaseDetails from "@/Documents/Requests/Purchase/PurchaseDetails";
import WhTransfer from "@/Documents/Requests/Warehouse Transfer/WhTransfer";
import WhTransferTable from "@/Documents/Requests/Warehouse Transfer/WhTransferTable";
import WhTransferDetails from "@/Documents/Requests/Warehouse Transfer/WhTransferDetails";
import SiteTransfer from "@/Documents/Requests/Sites Transfer/SiteTransfer";
import SiteTransferTable from "@/Documents/Requests/Sites Transfer/SiteTransferTable";
import SiteTransferDetails from "@/Documents/Requests/Sites Transfer/SiteTransferDetails";
import Return from "@/Documents/Requests/Return/Return";
import ReturnTable from "@/Documents/Requests/Return/ReturnTable";
import ReturnDetails from "@/Documents/Requests/Return/ReturnDetails";
import Waste from "@/Documents/Requests/Waste/Waste";
import WasteTable from "@/Documents/Requests/Waste/WasteTable";
import WasteDetails from "@/Documents/Requests/Waste/WasteDetails";
import GRPO from "@/Documents/Final Documents/GRPO/GRPO";
import GRPOTable from "@/Documents/Final Documents/GRPO/GRPOTable";
import GRPODetails from "@/Documents/Final Documents/GRPO/GRPODetails";
import WhsTransferFL from "@/Documents/Final Documents/Warehouse Transfer Final/WhsTransferFL";
import WhsTransferFLTable from "@/Documents/Final Documents/Warehouse Transfer Final/WhsTransferFLTable";
import WhsTransferFLDetails from "@/Documents/Final Documents/Warehouse Transfer Final/WhsTransferFLDetails";
import SiteTransferFL from "@/Documents/Final Documents/Sites Transfer Final/SiteTransferFL";
import SiteTransferFLTable from "@/Documents/Final Documents/Sites Transfer Final/SiteTransferFLTable";
import SiteTransferFLDetails from "@/Documents/Final Documents/Sites Transfer Final/SiteTransferFLDetails";
import ReturnFL from "@/Documents/Final Documents/Return Final/ReturnFL";
import ReturnFLTable from "@/Documents/Final Documents/Return Final/ReturnFLTable";
import ReturnFLDetails from "@/Documents/Final Documents/Return Final/ReturnFLDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
    errorElement: <NotFound />,
  },
  {
    path: "/rootumex",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate to="/rootumex/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "items",
        element: (
          <ProtectedRoute>
            <Items />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ItemsTable />,
          },
          {
            path: "details/:id",
            element: <ItemsDetails />,
          },
        ],
      },
      {
        path: "documents",
        element: (
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/rootumex/documents/requests" replace />,
          },
          {
            path: "requests",
            element: <Requests />,
            children: [
              {
                index: true,
                element: (
                  <Navigate
                    to="/rootumex/documents/requests/purchase"
                    replace
                  />
                ),
              },
              {
                path: "purchase",
                element: <Purchase />,
                children: [
                  {
                    index: true,
                    element: <PurchaseTable />,
                  },
                  {
                    path: "details/:id",
                    element: <PurchaseDetails />,
                  },
                ],
              },
              {
                path: "Wh-transfer",
                element: <WhTransfer />,
                children: [
                  {
                    index: true,
                    element: <WhTransferTable />,
                  },
                  {
                    path: "details/:id",
                    element: <WhTransferDetails />,
                  },
                ],
              },
              {
                path: "sites-transfer",
                element: <SiteTransfer />,
                children: [
                  {
                    index: true,
                    element: <SiteTransferTable />,
                  },
                  {
                    path: "details/:id",
                    element: <SiteTransferDetails />,
                  },
                ],
              },
              {
                path: "return",
                element: <Return />,
                children: [
                  {
                    index: true,
                    element: <ReturnTable />,
                  },
                  {
                    path: "details/:id",
                    element: <ReturnDetails />,
                  },
                ],
              },
              {
                path: "waste",
                element: <Waste />,
                children: [
                  {
                    index: true,
                    element: <WasteTable />,
                  },
                  {
                    path: "details/:id",
                    element: <WasteDetails />,
                  },
                ],
              },
            ],
          },
          {
            path: "final-docs",
            element: <FinalDocuments />,
            children: [
              {
                index: true,
                element: (
                  <Navigate to="/rootumex/documents/final-docs/grpo" replace />
                ),
              },
              {
                path: "grpo",
                element: <GRPO />,
                children: [
                  {
                    index: true,
                    element: <GRPOTable />,
                  },
                  {
                    path: "details/:id",
                    element: <GRPODetails />,
                  },
                ],
              },
              {
                path: "Wh-transfer-FL",
                element: <WhsTransferFL />,
                children: [
                  {
                    index: true,
                    element: <WhsTransferFLTable />,
                  },
                  {
                    path: "details/:id",
                    element: <WhsTransferFLDetails />,
                  },
                ],
              },
              {
                path: "sites-transfer-FL",
                element: <SiteTransferFL />,
                children: [
                  {
                    index: true,
                    element: <SiteTransferFLTable />,
                  },
                  {
                    path: "details/:id",
                    element: <SiteTransferFLDetails />,
                  },
                ],
              },
              {
                path: "return-final",
                element: <ReturnFL />,
                children: [
                  {
                    index: true,
                    element: <ReturnFLTable />,
                  },
                  {
                    path: "details/:id",
                    element: <ReturnFLDetails />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "vendors",
        element: (
          <ProtectedRoute>
            <Vendors />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <VendorsTable />,
          },
          {
            path: "details/:id",
            element: <VendorsDetails />,
          },
        ],
      },
      {
        path: "stock-count",
        element: (
          <ProtectedRoute>
            <StockCount />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <StockCountTable />,
          },
          {
            path: "details/:id",
            element: <StockCountDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    errorElement: <NotFound />,
    element: <LoginPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
