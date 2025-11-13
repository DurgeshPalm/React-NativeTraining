import { safeStorage } from "@/app/store/storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import api from "../../fetchapi";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);

  const userId = safeStorage.getString("userid");
  const token = safeStorage.getString("token");

  // ✅ Fetch parent proposals
  const fetchProposals = async () => {
    try {
      setLoading(true);

      const payload = {
        userid: Number(userId),
        role: "P",
        proposal_status: "", // ignored for parent
        page: 1,
        rows: 10,
      };

      const res = await api.post("/proposals/proposal_list", payload);
      const data = res.data;

      if (data?.resp_code === "000") {
        // Filter proposals by mapping_status = 'pending'
        const pendingProposals = data.data.filter(
          (p: any) => p.mapping_status === "pending"
        );
        setProposals(pendingProposals);
      } else {
        Toast.show(data?.resp_message || "Failed to load proposals", {
          position: Toast.positions.TOP,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error) {
      console.error("Fetch Proposals Error:", error);
      Toast.show("Something went wrong while loading proposals", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept / Reject Proposal
  const handleAction = async (
    proposal_id: number,
    proposal_status: "accepted" | "rejected"
  ) => {
    try {
      setLoading(true);
      const payload = {
        userid: Number(userId),
        proposal_id,
        proposal_status,
      };

      const res = await axios.put(
        `${
          process.env.EXPO_PUBLIC_API_URL || api.defaults.baseURL
        }/proposals/accept-reject`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data?.resp_code === "000") {
        Toast.show(`Proposal ${proposal_status} successfully`, {
          position: Toast.positions.TOP,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });
        // Refresh list
        fetchProposals();
      } else {
        Toast.show(data?.resp_message || "Failed to update proposal", {
          position: Toast.positions.TOP,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error) {
      console.error("Accept/Reject Error:", error);
      Toast.show("Something went wrong while updating proposal", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // ✅ Formatters
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderProposalCard = ({ item }: { item: any }) => {
    const start = formatTime(item.start_datetime);
    const end = formatTime(item.end_datetime);

    const durationMs =
      new Date(item.end_datetime).getTime() -
      new Date(item.start_datetime).getTime();
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const durationText = `${
      hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""
    }${hours > 0 && minutes > 0 ? " " : ""}${
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""
    }`;

    return (
      <View style={styles.cardContainer}>
        {/* Left turquoise box with icon */}
        <View style={styles.iconCard}>
          <Image
            source={require("../../../assets/Ice Cream png 1.png")}
            style={styles.rewardIcon}
            resizeMode="contain"
          />
        </View>

        {/* Right info box */}
        <View style={styles.infoCard}>
          <Text style={styles.childName}>{item.createdby}</Text>
          <Text style={styles.dateText}>
            {formatDate(item.start_datetime)} |{" "}
            {new Date(item.start_datetime).toLocaleDateString("en-GB", {
              weekday: "long",
            })}
          </Text>

          <Text style={styles.infoText}>
            From : <Text style={styles.boldText}>{`${start} - ${end}`}</Text>
          </Text>
          <Text style={styles.infoText}>
            Duration : <Text style={styles.boldText}>{durationText}</Text>
          </Text>
          <Text style={styles.infoText}>
            Reward : <Text style={styles.boldText}>{item.reward_name}</Text>
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#00EAD3" }]}
              onPress={() => handleAction(item.proposal_id, "rejected")}
            >
              <Text style={styles.actionText}>REJECT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#00EAD3" }]}
              onPress={() => handleAction(item.proposal_id, "accepted")}
            >
              <Text style={styles.actionText}>ACCEPT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
        {proposals.length > 0 && (
          <Text style={styles.subtitle}>
            Nice, you’ve got a new proposal...
          </Text>
        )}
        {/* <Text style={styles.subtitle}>Nice, you’ve got a new proposal...</Text> */}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6C5B8F"
            style={{ marginTop: 50 }}
          />
        ) : proposals.length > 0 ? (
          <FlatList
            data={proposals}
            keyExtractor={(item) => item.proposal_id.toString()}
            renderItem={renderProposalCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/noproposals.png")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>No New Proposals</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 55 },
  dashboardTitle: {
    fontSize: 25,
    fontFamily: "Fredoka_700Bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Fredoka_500Medium",
    color: "#4D4264",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
    backgroundColor: "#40E0D0",
    borderRadius: 15,
  },
  iconCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: "#EBEBEB",
    borderWidth: 1,
    width: 100,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardIcon: { width: 55, height: 55 },
  infoCard: {
    flex: 1,
    backgroundColor: "#4C637D",
    height: 150,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    padding: 15,
    marginLeft: 5,
    borderColor: "#EBEBEB",
    borderWidth: 1,
  },
  childName: {
    fontFamily: "Fredoka_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  dateText: {
    fontFamily: "Fredoka_500Medium",
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "Fredoka_500Medium",
    color: "#FFFFFF",
    fontSize: 13,
    marginVertical: 1,
  },
  boldText: { fontFamily: "Fredoka_700Bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    width: "65%",
    height: 35,
    // borderRadius: 10,
    marginLeft: -15,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },
  emptyText: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 30,
    color: "#000000",
    textAlign: "center",
  },
});
