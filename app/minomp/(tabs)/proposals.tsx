import { safeStorage } from "@/app/store/storage";
import { useQuery } from "@tanstack/react-query"; // ✅ Tanstack import
import React, { useState } from "react";
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

export default function ProposalsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );
  const userId = safeStorage.getString("userid");
  const role = safeStorage.getString("role");
  const titleText = role === "C" ? "MY PROPOSALS" : "PROPOSALS";

  // ✅ Fetch function for useQuery
  const fetchProposals = async () => {
    const payload = {
      userid: Number(userId),
      role: role,
      proposal_status: activeTab === "pending" ? "pending" : "accepted",
      page: 1,
      rows: 10,
    };

    const res = await api.post("/proposals/proposal_list", payload);
    const data = res.data;
    // console.log(payload);

    if (data?.resp_code === "000") {
      return data.data;
    } else {
      Toast.show(data?.resp_message || "Failed to fetch proposals", {
        position: Toast.positions.TOP,
        backgroundColor: "#FF6B6B",
      });
      return [];
    }
  };

  // ✅ TanStack useQuery hook
  const {
    data: proposals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["proposals", activeTab],
    queryFn: fetchProposals,
  });

  // ✅ Format date/time
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

  // ✅ Proposal Card
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
        {/* Left turquoise card */}
        <View style={styles.iconCard}>
          <Image
            source={require("../../../assets/Ice Cream png 1.png")}
            style={styles.rewardIcon}
            resizeMode="contain"
          />

          {/* Status text (only for completed) */}
          {activeTab === "completed" && (
            <Text
              style={[
                styles.statusBadge,
                {
                  color: item.reward_received_status ? "#00EAD3" : "#FF6B6B",
                },
              ]}
            >
              {item.reward_received_status ? "SUCCESS !" : "NOT THIS TIME"}
            </Text>
          )}
        </View>

        {/* Right purple card */}
        <View style={styles.infoCard}>
          <Text style={styles.proposalName}>{item.proposal_name}</Text>
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
        <Text style={styles.title}>{titleText}</Text>

        {/* Tabs */}
        {role === "C" && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "pending" && styles.activeTab,
              ]}
              onPress={() => {
                setActiveTab("pending");
                refetch();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "pending" && styles.activeTabText,
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "completed" && styles.activeTab,
              ]}
              onPress={() => {
                setActiveTab("completed");
                refetch();
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "completed" && styles.activeTabText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* List */}
        {isLoading ? (
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
          <Text style={styles.emptyText}>No proposals found</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  title: {
    fontSize: 25,
    fontFamily: "Fredoka_700Bold",
    color: "#4D4264",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#4D4264",
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 20,
    height: 45,
    width: 284,
    alignSelf: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  tabText: {
    fontFamily: "Fredoka_500Medium",
    color: "#6C5B8F",
    fontSize: 18,
    fontWeight: "500",
  },
  activeTab: {
    backgroundColor: "#40E0D0",
    borderColor: "#4D4264",
    borderWidth: 1,
  },
  activeTabText: {
    color: "#6C5B8F",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  iconCard: {
    backgroundColor: "#40E0D0",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    width: 100,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  rewardIcon: {
    width: 60,
    height: 60,
  },
  statusBadge: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 12,
    marginTop: 5,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#A15CFF",
    height: 130,
    marginLeft: 5,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  proposalName: {
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
    marginVertical: 2,
  },
  boldText: {
    fontFamily: "Fredoka_700Bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontFamily: "Fredoka_500Medium",
    color: "#4D4264",
  },
});
