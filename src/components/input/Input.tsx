import { Input as BaseInput, InputProps } from "@mui/base/Input";
import React from "react";
import { TextareaElement } from "../textAreaElement/TextAreaElement";
import { styled } from "@mui/material";

const RootDiv = styled("div")`
display: flex;
max-width: 100%;
`;

export const Input = React.forwardRef(function CustomInput(
    props: InputProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <BaseInput
        slots={{
          root: RootDiv,
          input: "input",
          textarea: TextareaElement,
        }}
        {...props}
        ref={ref}
      />
    );
  });