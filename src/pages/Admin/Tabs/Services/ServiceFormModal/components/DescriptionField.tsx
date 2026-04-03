import React from 'react';
import { Box, Typography } from '@mui/material';
import { MAX_DESCRIPTION_LENGTH, MIN_EDITOR_HEIGHT } from '../constants';
import RichTextEditor from "../../../../../../components/Common/RichTextEditor.tsx";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
  value,
  onChange,
  loading
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Detailed Description
      </Typography>
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder="Describe the service in detail, benefits, process..."
        disabled={loading}
        maxLength={MAX_DESCRIPTION_LENGTH}
        minHeight={MIN_EDITOR_HEIGHT}
        helperText="Use rich text to create an engaging description"
      />
    </Box>
  );
};

export default DescriptionField;
