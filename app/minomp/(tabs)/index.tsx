import { safeStorage } from "@/app/store/storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-root-toast";
import api from "../../fetchapi";

export default function DashboardScreen() {
  const router = useRouter();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("8 Hrs");
  const [minompTime, setMinompTime] = useState("30 min");

  const [openReward, setOpenReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [rewardItems, setRewardItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = safeStorage.getString("userid");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ✅ Fetch Rewards
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get(`/proposals/getRewards?userid=${userId}`);
        if (res.data?.resp_code === "000") {
          const mapped = res.data.rewards.map((r: any) => ({
            label: r.reward_name,
            value: r.id, // ✅ Use actual reward ID from backend
            icon: () => (
              <Image
                source={require("../../../assets/Ice Cream png 1.png")}
                style={{ width: 20, height: 20 }}
              />
            ),
          }));
          setRewardItems(mapped);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
        Toast.show("Failed to load rewards", {
          position: Toast.positions.TOP,
          backgroundColor: "#FF6B6B",
        });
      }
    };
    fetchRewards();
  }, []);

  // ✅ Formatters
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // ✅ Handle Create Proposal
  const handleCreateProposal = async () => {
    if (!startTime || !endTime || !date || !selectedReward) {
      Toast.show("Please fill all required fields", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    // 🕒 Convert to "YYYY-MM-DD HH:mm:ss" format
    const start_datetime = `${date} ${startTime}:00`;
    const end_datetime = `${date} ${endTime}:00`;

    const payload = {
      proposal_name: "Study Time",
      reward_id: selectedReward,
      reward_name: "",
      start_datetime,
      end_datetime,
      userid: Number(userId),
      status: "pending",
    };

    console.log("🟢 Create Proposal Payload:", payload);

    try {
      setLoading(true);
      const res = await api.post("/proposals/create", payload);
      const data = res.data;

      console.log("🟣 Create Proposal Response:", data);

      if (data?.resp_code === "000") {
        Toast.show("Proposal created successfully!", {
          position: Toast.positions.TOP,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });
      } else {
        Toast.show(data?.message || "Failed to create proposal", {
          position: Toast.positions.TOP,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error: any) {
      console.error("Create Proposal Error:", error.response?.data || error);
      Toast.show("Something went wrong!", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/minompback.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.06 }}
    >
      <View style={styles.container}>
        <Text style={styles.dashboardTitle}>DASHBOARD</Text>

        {/* ✅ Minomp Logo above card */}
        <Image
          source={require("../../../assets/Dashboardlogo.png")}
          style={styles.minompLogo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          {/* ✅ Proposal Label Image */}
          <Image
            source={require("../../../assets/Proposal.png")}
            style={styles.sectionImage}
            resizeMode="contain"
          />

          {/* Start / End / Date */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.inputText}>{startTime || "hh : mm"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.inputText}>{endTime || "hh : mm"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.inputBox, { width: 110 }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>
                {date ? date.split("-").reverse().join("/") : "dd/mm/yyyy"}
              </Text>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              onChange={(e, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartTime(formatTime(selectedDate));
              }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              onChange={(e, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndTime(formatTime(selectedDate));
              }}
            />
          )}
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(formatDate(selectedDate));
              }}
            />
          )}

          {/* Duration & Minomp Time */}
          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{duration}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Minomp Time</Text>
              <Text style={styles.infoValue}>{minompTime}</Text>
            </View>
          </View>

          {/* ✅ Reward Label Image */}
          <Image
            source={require("../../../assets/Reward.png")}
            style={[styles.sectionImage, { alignSelf: "flex-start" }]}
            resizeMode="contain"
          />

          {/* Reward Dropdown */}
          <DropDownPicker
            open={openReward}
            value={selectedReward}
            items={rewardItems}
            setOpen={setOpenReward}
            setValue={setSelectedReward}
            placeholder="Select Reward"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleCreateProposal}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#6C5B8F" />
            ) : (
              <Text style={styles.buttonText}>SEND TO PARENT</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// ⚙️ Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  dashboardTitle: {
    fontSize: 25,
    fontFamily: "Fredoka_600SemiBold",
    color: "#4D4264",
    textTransform: "uppercase",
    letterSpacing: 1.75,
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  minompLogo: { width: 180, height: 60, marginBottom: 10 },
  card: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  sectionImage: {
    width: 120,
    height: 30,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 8,
    gap: 3,
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 75,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    fontFamily: "Fredoka_500Medium",
    color: "#6C5B8F",
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "48%",
    padding: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: "Fredoka_500Medium",
    color: "#6C5B8F",
    fontSize: 12,
  },
  infoValue: {
    fontFamily: "Fredoka_700Bold",
    color: "#6C5B8F",
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    marginVertical: 10,
  },
  dropdownContainer: { borderColor: "#A15CFF", borderRadius: 8 },
  button: {
    width: 180,
    height: 45,
    backgroundColor: "#00EAD3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 15,
    letterSpacing: 1,
  },
});
