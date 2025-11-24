import React, { useMemo } from "react";
import { FormControl, Select, MenuItem, TextField, Button } from "@mui/material";
import { customMenuProps } from "../../../utils/CustomMenuProps";

/**
 * TherapyRow - small reusable row component for therapy entries.
 *
 * Props:
 *  - details: object (therapy row data)
 *  - index: number
 *  - allTherapyMaster: array of lookup options
 *  - onChange: (index, field, value) => void
 *  - onRemove: (index) => void    [optional]
 *  - showRemove: boolean          [optional]
 */
export default function TherapyRow({
  details = {},
  index,
  allTherapyMaster = [],
  onChange,
  onRemove,
  showRemove = false,
}) {
  // Accept either string id or object { _id, lookup_value }
  const therapyValue = useMemo(() => {
    if (!details) return "";
    if (typeof details.TherapyName === "object" && details.TherapyName !== null) {
      return details.TherapyName._id || "";
    }
    return details.TherapyName || "";
  }, [details]);

  const patientResponse = details?.PatientResponse || "";

  const lookupLabel = (id) => {
    if (!id) return null;
    return allTherapyMaster?.find((t) => t._id === id)?.lookup_value || null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
      <FormControl fullWidth size="small">
        <label className="form-label">Therapy Name</label>
        <Select
          labelId={`therapy-name-${index}`}
          name="TherapyName"
          value={therapyValue}
          onChange={(e) => onChange(index, "TherapyName", e.target.value)}
          displayEmpty
          MenuProps={customMenuProps}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#9ca3af" }}>Therapy Name</span>;
            }
            return lookupLabel(selected) || selected;
          }}
        >
          <MenuItem value="">
            <em>Therapy Name</em>
          </MenuItem>
          {allTherapyMaster?.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.lookup_value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <label className="form-label">Patient’s Response</label>
        <TextField
          type="text"
          placeholder="Patient Response"
          name="PatientResponse"
          size="small"
          value={patientResponse}
          onChange={(e) => onChange(index, "PatientResponse", e.target.value)}
        />
      </FormControl>

      {showRemove && (
        <div className="col-span-2 flex justify-end mt-2">
          <Button variant="outlined" color="error" onClick={() => onRemove?.(index)}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
