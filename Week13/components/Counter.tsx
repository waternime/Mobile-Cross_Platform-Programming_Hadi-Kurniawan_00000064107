import { Button, StyleSheet, Text, View } from "react-native";

import { resetCounters } from "../store/counter.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Counter() {
  const dispatch = useAppDispatch();
  const counters = useAppSelector((state) => state.counter);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Redux counter</Text>
      <Text style={styles.summary}>
        {counters.totalSuccess} successful, {counters.totalFailed} unsuccessful
      </Text>

      <View style={styles.row}>
        <Text style={styles.name}>Supabase</Text>
        <Text style={styles.value}>
          {counters.supabase.success} success / {counters.supabase.failed} failed
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.name}>Notification</Text>
        <Text style={styles.value}>
          {counters.notification.success} success /{" "}
          {counters.notification.failed} failed
        </Text>
      </View>

      {counters.error && <Text style={styles.error}>{counters.error}</Text>}

      <View style={styles.button}>
        <Button title="RESET COUNTERS" onPress={() => dispatch(resetCounters())} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  summary: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  row: {
    marginTop: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },
  value: {
    marginTop: 2,
    fontSize: 15,
    color: "#0f172a",
  },
  error: {
    marginTop: 10,
    color: "#b91c1c",
  },
  button: {
    marginTop: 12,
  },
});
