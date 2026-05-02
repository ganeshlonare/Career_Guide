import React, { useState, useMemo, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

interface CollegeSelectProps {
  colleges: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
}

const StyledPopper = styled("div")({
  "& .MuiAutocomplete-listbox": {
    maxHeight: "250px",
    overflowY: "auto",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const CollegeSelect: React.FC<CollegeSelectProps> = ({
  colleges,
  value,
  onChange,
  placeholder = "Search colleges...",
  label = "College",
  error = false,
  helperText = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter colleges based on search term (case-insensitive)
  const filteredColleges = useMemo(() => {
    if (!debouncedSearchTerm) return colleges.slice(0, 50);

    const searchLower = debouncedSearchTerm.toLowerCase();
    return colleges
      .filter((college) => college.toLowerCase().includes(searchLower))
      .slice(0, 50);
  }, [colleges, debouncedSearchTerm]);

  return (
    <Autocomplete
      freeSolo
      options={filteredColleges}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue || "");
      }}
      onInputChange={(_, newInputValue) => {
        setSearchTerm(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          fullWidth
        />
      )}
      PopperComponent={StyledPopper}
      noOptionsText="No colleges found"
      ListboxProps={{
        style: {
          maxHeight: "250px",
          overflow: "auto",
        },
      }}
    />
  );
};

export default CollegeSelect;
