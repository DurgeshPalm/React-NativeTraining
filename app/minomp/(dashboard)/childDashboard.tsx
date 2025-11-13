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
  const [duration, setDuration] = useState("0 min");
  const [minompTime, setMinompTime] = useState("0 min");

  const [openReward, setOpenReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [rewardItems, setRewardItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = safeStorage.getString("userid");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateDuration = (
    start: string,
    end: string,
    selectedDate: string
  ) => {
    if (!start || !end || !selectedDate) return;

    const startDateTime = new Date(`${selectedDate} ${start}:00`);
    const endDateTime = new Date(`${selectedDate} ${end}:00`);

    let diffMs = endDateTime.getTime() - startDateTime.getTime();

    // If end is next day (ex: 22:00 → 02:00)
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const durationText =
      (hours ? `${hours} hour${hours > 1 ? "s" : ""}` : "") +
      (hours && minutes ? " " : "") +
      (minutes ? `${minutes} min` : hours ? "" : "0 min");

    setDuration(durationText);
    const minompMinutes = Math.round(totalMinutes * 0.3);
    setMinompTime(`${minompMinutes} min`);
  };

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await api.get(`/proposals/getRewards?userid=${userId}`);
        if (res.data?.resp_code === "000") {
          const mapped = res.data.rewards.map((r: any) => ({
            label: r.reward_name,
            value: r.id,
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

  const handleCreateProposal = async () => {
    if (!startTime || !endTime || !date || !selectedReward) {
      Toast.show("Please fill all required fields", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    const start_datetime = `${date} ${startTime}:00`;
    const end_datetime = `${date} ${endTime}:00`;

    const payload = {
      proposal_name: "Proposal",
      reward_id: selectedReward,
      reward_name: "",
      start_datetime,
      end_datetime,
      userid: Number(userId),
      status: "pending",
    };

    try {
      setLoading(true);
      const res = await api.post("/proposals/create", payload);

      if (res.data?.resp_code === "000") {
        Toast.show("Proposal created successfully!", {
          position: Toast.positions.TOP,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });
      } else {
        Toast.show(res.data?.message || "Failed to create proposal", {
          position: Toast.positions.TOP,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error: any) {
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

        <Image
          source={require("../../../assets/Dashboardlogo.png")}
          style={styles.minompLogo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Image
            source={require("../../../assets/Proposal.png")}
            style={styles.sectionImage}
            resizeMode="contain"
          />

          {/* ROW 1 — Start / End / Date */}
          <View style={styles.row}>
            {/* START TIME */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Starts</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.inputText}>{startTime || "hh : mm"}</Text>
              </TouchableOpacity>
            </View>

            {/* END TIME */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Ends</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.inputText}>{endTime || "hh : mm"}</Text>
              </TouchableOpacity>
            </View>

            {/* DATE */}
            <View style={[styles.inputWrapper, { width: 110 }]}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={[styles.inputBox, { width: "100%" }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.inputText}>
                  {date ? date.split("-").reverse().join("/") : "dd/mm/yyyy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Pickers */}
          {showStartPicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={false}
              onChange={(e, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  const newStart = formatTime(selectedDate);
                  setStartTime(newStart);
                  calculateDuration(newStart, endTime, date);
                }
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
                if (selectedDate) {
                  const newEnd = formatTime(selectedDate);
                  setEndTime(newEnd);
                  calculateDuration(startTime, newEnd, date);
                }
              }}
            />
          )}

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const newDate = formatDate(selectedDate);
                  setDate(newDate);
                  calculateDuration(startTime, endTime, newDate);
                }
              }}
            />
          )}

          {/* Duration + Minomp Time */}
          <View style={styles.row}>
            {/* Duration */}
            <View style={{ width: "48%" }}>
              <Text style={styles.infoLabel}>Duration</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{duration}</Text>
              </View>
            </View>

            {/* Minomp Time */}
            <View style={{ width: "48%" }}>
              <Text style={styles.infoLabel}>Minomp Time</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{minompTime}</Text>
              </View>
            </View>
          </View>

          <Image
            source={require("../../../assets/Reward.png")}
            style={[styles.sectionImage, { alignSelf: "flex-start" }]}
            resizeMode="contain"
          />

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
  infoLabel: {
    fontFamily: "Fredoka_500Medium",
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "center",
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
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
  inputWrapper: {
    width: "30%",
  },

  inputLabel: {
    fontFamily: "Fredoka_500Medium",
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "center",
  },
});
