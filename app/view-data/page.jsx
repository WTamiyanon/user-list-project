"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterForm from "./components/FilterForm";
import DataTable from "./components/DataTable";
import Navbar from "./components/Navbar";
import "../globals.css";

const ViewDataPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportSnackbar, setExportSnackbar] = useState(false);
  const [exportLink, setExportLink] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [imageOpen, setImageOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [copySnackbar, setCopySnackbar] = useState(false);
  const [filterState, setFilterState] = useState({
    name: "",
    gender: "",
    country: "",
    jobTitle: "",
  });
  const [filteredRows, setFilteredRows] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/google-sheets");
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

          const result = await response.json();

          if (result.data?.length > 0) {
            const firstRow = result.data[0];
            setColumns(
              Object.keys(firstRow).map((key) => {
                if (key === "id") {
                  return {
                    field: key,
                    headerName: "ID",
                    width: 60,
                    sortable: true,
                  };
                }
                if (key === "photo") {
                  return {
                    field: key,
                    headerName: "Photo",
                    flex: 1,
                    sortable: false,
                    renderCell: (params) => (
                      <Button
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageOpen(params.value);
                        }}
                        style={{ textTransform: "none", color: "#4CAF50" }}
                      >
                        View Photo
                      </Button>
                    ),
                  };
                }
                if (key === "email") {
                  return {
                    field: key,
                    headerName: "Email",
                    flex: 1,
                    sortable: true,
                    renderCell: (params) => (
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(params.value);
                        }}
                        sx={{
                          cursor: "pointer",
                          textAlign: "left",
                          color: "#007bff",
                          textDecoration: "underline",
                        }}
                      >
                        {params.value}
                      </Box>
                    ),
                  };
                }
                return {
                  field: key,
                  headerName: key.charAt(0).toUpperCase() + key.slice(1),
                  flex: 1,
                  sortable: true,
                };
              })
            );
            setRows(result.data.map((row, index) => ({ id: index.toString(), ...row })));
            setFilteredRows(result.data.map((row, index) => ({ id: index.toString(), ...row })));

            const uniqueGenders = Array.from(new Set(result.data.map((row) => row.gender))).filter(
              (gender) => gender
            );
            setGenderOptions(uniqueGenders);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status, router]);

  useEffect(() => {
    const filtered = rows.filter((row) => {
      const searchQuery = filterState.name.toLowerCase();
      const matchesFirstName = row.first_name?.toLowerCase().includes(searchQuery);
      const matchesLastName = row.last_name?.toLowerCase().includes(searchQuery);
      const matchesEmail = row.email?.toLowerCase().includes(searchQuery);

      const matchesGender =
        !filterState.gender || row.gender?.toLowerCase() === filterState.gender.toLowerCase();
      const matchesCountry =
        !filterState.country || row.country?.toLowerCase().includes(filterState.country.toLowerCase());
      const matchesJobTitle =
        !filterState.jobTitle || row.jobTitle?.toLowerCase().includes(filterState.jobTitle.toLowerCase());

      return (
        (matchesFirstName || matchesLastName || matchesEmail) &&
        matchesGender &&
        matchesCountry &&
        matchesJobTitle
      );
    });

    setFilteredRows(filtered);
  }, [filterState, rows]);

  const handleExportToGoogleSheet = async () => {
    try {
      setExportLoading(true);
      const filteredData = rows.filter((row) => selectedRows.includes(row.id));
      if (filteredData.length === 0) return;

      const response = await fetch("/api/export-to-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filteredData }),
      });

      if (!response.ok) throw new Error("Failed to export data");

      const result = await response.json();
      setExportLink(result.url);
      setExportModalOpen(true);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleImageOpen = (imageUrl) => {
    if (imageUrl) {
      setCurrentImage(imageUrl);
      setImageOpen(true);
    } else {
      console.error("Image URL is missing");
    }
  };

  const handleImageClose = () => setImageOpen(false);

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopySnackbar(true);
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar userEmail={session?.user?.email} userName={session?.user?.name} onLogout={() => signOut({ callbackUrl: "/login" })} />
      <Grid
        container
        spacing={3}
        sx={{
          padding: "40px 80px",
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", color: "#111928", mb: 2 }}>
            User Data Table
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FilterForm
                filterState={filterState}
                setFilterState={setFilterState}
                rows={rows}
                genderOptions={genderOptions}
              />
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 5px 5px 0px #00000012",
                  padding: 2,
                  margin: "0 auto",
                  maxWidth: "100%",
                }}
              >
                <DataTable
                  rows={filteredRows}
                  columns={columns}
                  onSelectionChange={(ids) => setSelectedRows(ids)}
                  autoHeight
                  sx={{
                    "& .MuiDataGrid-row": {
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#e8f5e9",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleExportToGoogleSheet}
                  disabled={selectedRows.length === 0 || exportLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    color: "white",
                    bgcolor: "#4CAF50",
                    "&:hover": {
                      bgcolor: "#388E3C",
                    },
                  }}
                  startIcon={exportLoading && <CircularProgress size={20} color="inherit" />}
                >
                  Export Selected to Google Sheet
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>

      <Dialog open={exportModalOpen} onClose={() => setExportModalOpen(false)}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}>
          Export Successful
          <IconButton onClick={() => setExportModalOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography sx={{ mb: 2 }}>Your data has been exported!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(exportLink, "_blank")}
            sx={{
              mt: 3,
              mb: 2,
              textTransform: "none",
              color: "white",
              bgcolor: "#4CAF50",
              "&:hover": {
                bgcolor: "#388E3C",
              },
            }}
          >
            Open Exported Google Sheet
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={imageOpen}
        onClose={handleImageClose}
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "unset",
            width: "auto",
            position: "relative",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          View Photo
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="User Photo"
              style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px" }}
            />
          ) : (
            <Typography color="error">Image not available</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={copySnackbar} autoHideDuration={3000} onClose={() => setCopySnackbar(false)}>
        <Alert onClose={() => setCopySnackbar(false)} severity="info">
          Email copied
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewDataPage;
