import { safeStorage } from "@/app/store/storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ChildDashboard from "../(dashboard)/childDashboard"; // � Child UI screen
import ParentDashboard from "../(dashboard)/parentDashboard"; // 👨‍� Parent UI screen

export default function DashboardScreen() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Fetch role from MMKV
    const storedRole = safeStorage.getString("role");
    setRole(storedRole || "C"); // default to child
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6C5B8F" />
      </View>
    );
  }

  // ✅ Role-based rendering
  return role === "P" ? <ParentDashboard /> : <ChildDashboard />;
}
