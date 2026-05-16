import { Controller } from "react-hook-form";
import { View } from "react-native";

import AppInput from "./AppInput";

export default function FormInput({
  control,
  name,
  rules,
  ...rest
}: any) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: {
          onChange,
          onBlur,
          value,
        },
        fieldState: { error },
      }) => {
        return (
          <View>
            <AppInput
              {...rest}
              value={value}
              selectedOptions={
                Array.isArray(value)
                  ? value
                  : []
              }
              onMultiSelect={(
                values: string[],
              ) => {
                onChange(values);
              }}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message}
            />
          </View>
        );
      }}
    />
  );
}