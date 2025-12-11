// EmailTemplate.tsx
import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from "@react-email/components";
import { EmailTemplateProps, TransactionData } from "@/types/email";
// import Papa from "papaparse";
// import { supabase } from "@/lib/supabase/supabaseConfig"; TODO change this

// Group data by warehouse
const groupByWarehouse = (
  data: TransactionData[]
): Record<string, TransactionData[]> => {
  return data.reduce(
    (acc, item) => {
      (acc[item.warehouse] ||= []).push(item);
      return acc;
    },
    {} as Record<string, TransactionData[]>
  );
};

// Email Template Component
export const EmailTemplate2: React.FC<Readonly<EmailTemplateProps>> = ({
  transactionData,
  isMultipleEntries,
}) => (
  <Html>
    <Head />
    <Body
      style={{
        backgroundColor: "#D5D5D5",
        padding: "20px",
        paddingTop: "50px",
      }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          borderRadius: "5px",
          width: "90%",
          maxWidth: "800px",
        }}
      >
        <Heading>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  letterSpacing: "-0.05em",
                  color: "#FFBC2A",
                  fontFamily: "Montserrat",
                }}
              >
                <span>X</span>
                <span style={{ opacity: 0.8, position: "relative" }}>Mon</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: "12px", fontWeight: "500", marginTop: "1rem" }}>
            平素より大変お世話になっております。
          </p>

          <div>
            {isMultipleEntries ? (
              <p style={{ fontSize: "12px", fontWeight: "500" }}>
                <b style={{ color: "#FF0000" }}>
                  昨日
                  {new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                </b>{" "}
                <b style={{ color: "#FF0000" }}>複数の倉庫</b>より
                新しい商品が複数{" "}
                <b style={{ color: "#FF0000" }}>入荷／出荷されました</b>
              </p>
            ) : (
              <p style={{ fontSize: "12px", fontWeight: "500" }}>
                <b style={{ color: "#FF0000" }}>
                  昨日
                  {new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                </b>{" "}
                <b style={{ color: "#FF0000" }}>
                  {transactionData[0].warehouse}
                </b>{" "}
                より 複数の新しい商品が{" "}
                <b style={{ color: "#FF0000" }}>
                  {transactionData[0].status === "stocked"
                    ? "入荷"
                    : transactionData[0].status === "shipped"
                      ? "出荷"
                      : transactionData[0].status}
                  されました
                </b>
              </p>
            )}
          </div>

          <p style={{ fontSize: "12px", fontWeight: "500", marginTop: "10px" }}>
            下記の表が挿入されたExcelファイルを添付しました。
          </p>

          {/* Table per warehouse */}
          {Object.entries(groupByWarehouse(transactionData)).map(
            ([warehouseName, transactions]) => (
              <div key={warehouseName} style={{ marginTop: "30px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Warehouse: {warehouseName}
                </p>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "30px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Product Code</th>
                      <th style={thStyle}>Stock No</th>
                      <th style={thStyle}>Lot No</th>
                      <th style={thStyle}>Description</th>
                      <th style={thStyle}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((item, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{item.status}</td>
                        <td style={tdStyle}>{item.productCode}</td>
                        <td style={tdStyle}>{item.stockNo}</td>
                        <td style={tdStyle}>{item.lotNo}</td>
                        <td style={tdStyle}>{item.description}</td>
                        <td style={tdStyle}>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          <p
            style={{
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "50px",
              paddingTop: "5px",
              paddingBottom: "5px",
              borderTop: "2px double black",
              borderBottom: "2px double black",
              textAlign: "center",
            }}
          >
            これはXMon外部倉庫監視システムからの自動送信されたメッセージです。
          </p>
        </Heading>
      </Container>

      <Text
        style={{
          fontSize: "10px",
          marginTop: "15px",
          textAlign: "center",
          color: "#666",
        }}
      >
        © XMon External Warehouse Monitoring System
      </Text>
    </Body>
  </Html>
);

// Table Styles
const thStyle = {
  border: "1px solid #000",
  padding: "5px",
  fontSize: "12px",
  textAlign: "center" as const,
};

const tdStyle = {
  border: "1px solid #000",
  padding: "5px",
  fontSize: "12px",
  textAlign: "center" as const,
};

// // Mock data for testing
// export const mockTransactionData: TransactionData[] = [
//   {
//     warehouse: "Warehouse1",
//     status: "Stocked",
//     productCode: "DG",
//     stockNo: "31379-0049_R01_NB",
//     lotNo: "01578560000001",
//     description: "【12V/18V/18T】タイロッド、架構",
//     quantity: 1000,
//   },
// ];

// Test data fetch
// export const fetchAllTransactionsByDate = async (): Promise<Transaction[]> => {
//   const today = new Date().toISOString().split("T")[0];

//   const { data: locationData, error: locationError } = await supabase
//     .from("parts_location")
//     .select("lot_no, warehouse_id");

//   if (locationError || !locationData || locationData.length === 0) {
//     return [];
//   }

//   const lotNumbers = locationData.map((item) => item.lot_no);
//   const warehouseMap = locationData.reduce(
//     (acc, item) => {
//       acc[item.lot_no] = item.warehouse_id;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   const { data: transactionData, error: transactionError } = await supabase
//     .from("transaction_history")
//     .select("*")
//     .in("lot_no", lotNumbers);

//   if (transactionError || !transactionData) {
//     return [];
//   }

//   const { data: inventoryData, error: inventoryError } = await supabase
//     .from("parts")
//     .select("*")
//     .in("lot_no", lotNumbers);

//   if (inventoryError || !inventoryData) {
//     return [];
//   }

//   const filteredByDate = transactionData.filter((item) => {
//     const transactionDate = new Date(item.created_at)
//       .toISOString()
//       .split("T")[0];
//     return transactionDate === today;
//   });

//   const conn = filteredByDate.map((item) => {
//     const data = inventoryData?.find((inv) => inv.lot_no === item.lot_no);
//     const formatted = {
//       id: item.id,
//       warehouse: data.warehouse,
//       product_code: data.product_code,
//       stock_no: data.stock_no,
//       description: data.description,
//       status: item.status,
//       lot_no: item.lot_no,
//       quantity: item.quantity,
//       created_at: data.created_at,
//     };
//     return data ? formatted : item;
//   });

//   // console.log("Conn", conn)

//   // Fetch warehouse names
//   const { data: warehousesData, error: warehousesError } = await supabase
//     .from("warehouse")
//     .select("id, warehouse");

//   if (warehousesError || !warehousesData) {
//     return [];
//   }

//   const warehouseIdToName = warehousesData.reduce(
//     (acc, item) => {
//       acc[item.id] = item.warehouse;
//       return acc;
//     },
//     {} as Record<number, string>
//   );

//   return conn.map((item) => ({
//     id: item.id,
//     lot_no: item.lot_no,
//     status: item.status,
//     product_code: item.product_code,
//     stock_no: item.stock_no,
//     description: item.description,
//     quantity: item.quantity,
//     warehouse:
//       warehouseIdToName[warehouseMap[item.lot_no]] ?? "Unknown Warehouse",
//     created_at: item.created_at,
//   }));
// };
