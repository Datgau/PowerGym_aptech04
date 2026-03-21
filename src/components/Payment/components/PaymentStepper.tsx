import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';

interface PaymentStepperProps {
  activeStep: number;
  steps: string[];
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({
  activeStep,
  steps
}) => {
  return (
    <Box sx={{ px: 3, pb: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PaymentStepper;