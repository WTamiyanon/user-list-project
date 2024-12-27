import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

const FilterForm = ({
  filterState,
  setFilterState,
  rows,
  genderOptions,
}) => {
  const uniqueOptions = (field) =>
    [...new Set(rows.map((row) => row[field]))].filter(Boolean);

  const textFieldStyles = {
    backgroundColor: "white",
    "& .MuiInputLabel-root": {
      color: "#888",
      "&.Mui-focused": {
        color: "#388E3C",
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ccc",
      },
      "&:hover fieldset": {
        borderColor: "#388E3C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#388E3C",
      },
    },
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      {/* Search by Name */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={filterState.name}
          onChange={(e) =>
            setFilterState({ ...filterState, name: e.target.value })
          }
          sx={textFieldStyles}
        />
      </Grid>

      {/* Filter by Gender */}
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth sx={textFieldStyles}>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            value={filterState.gender || ""}
            onChange={(e) =>
              setFilterState({ ...filterState, gender: e.target.value })
            }
            label="Gender"
          >
            <MenuItem value="">All</MenuItem>
            {genderOptions.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Filter by Country */}
      <Grid item xs={12} sm={6} md={3}>
        <Autocomplete
          options={uniqueOptions("country")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              variant="outlined"
              sx={textFieldStyles}
            />
          )}
          value={filterState.country || ""}
          onInputChange={(_, value) =>
            setFilterState({ ...filterState, country: value })
          }
          onChange={(_, value) =>
            setFilterState({ ...filterState, country: value || "" })
          }
        />
      </Grid>

      {/* Filter by Job Title */}
      <Grid item xs={12} sm={6} md={3}>
        <Autocomplete
          options={uniqueOptions("jobTitle")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Job Title"
              variant="outlined"
              sx={textFieldStyles}
            />
          )}
          value={filterState.jobTitle || ""}
          onInputChange={(_, value) =>
            setFilterState({ ...filterState, jobTitle: value })
          }
          onChange={(_, value) =>
            setFilterState({ ...filterState, jobTitle: value || "" })
          }
        />
      </Grid>
    </Grid>
  );
};

export default FilterForm;
