import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = ({ rows, columns, onSelectionChange, autoHeight, sx }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      checkboxSelection
      autoHeight={autoHeight}
      onRowSelectionModelChange={(newSelectionModel) => {
        onSelectionChange(newSelectionModel);
      }}
      pageSizeOptions={[10, 25, 50, 100]} // ตัวเลือก Rows per page
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 }, // เริ่มต้นที่ 10 rows per page
        },
      }}
      sx={{
        ...sx, // รวม sx ที่ส่งเข้ามา
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "white", // กำหนดพื้นหลัง Footer
          borderTop: "1px solid #ddd", // เส้นขอบด้านบน
        },
      }}
    />
  );
};

export default DataTable;
