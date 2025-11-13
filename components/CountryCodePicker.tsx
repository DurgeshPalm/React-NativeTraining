import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import api from "../app/fetchapi";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
}

interface CountryCode {
  id: number;
  country_code: string;
  country_name: string;
}

export default function CountryCodePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // Fetch country codes
  const { data: countryCodes = [] } = useQuery({
    queryKey: ["countryCodes"],
    queryFn: async () => {
      const res = await api.get("/users/getCountryCode");
      return res.data;
    },
    select: (response) =>
      response?.data?.map((item: CountryCode) => ({
        label: `${item.country_code}`,
        value: item.id,
      })) || [],
  });

  return (
    <View style={{ width: 90 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={countryCodes}
        setOpen={setOpen}
        setValue={(callback) => {
          const newValue = callback(value);
          onChange(newValue);
        }}
        placeholder="+91"
        placeholderStyle={{
          color: "#fff",
          fontWeight: "500",
        }}
        labelStyle={{ color: "#fff" }}
        selectedItemLabelStyle={{ color: "#fff" }}
        ArrowDownIconComponent={() => (
          <Image
            source={require("../assets/dropdownarrow.png")}
            style={{
              width: 14,
              height: 8,
              tintColor: "#fff",
            }}
            resizeMode="contain"
          />
        )}
        style={styles.codePicker}
        dropDownContainerStyle={styles.codeDropdown}
        listItemLabelStyle={{ color: "#fff" }}
        zIndex={2000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  codePicker: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    height: 41,
    justifyContent: "center",
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
  },

  codeDropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
  },
});
