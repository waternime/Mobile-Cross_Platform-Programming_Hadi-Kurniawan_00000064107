import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 12,
    display: "flex",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    maxWidth: 480,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111'
  },
  searchbar: {
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  // Paper-related styles
  cardCover: {
    height: 220,
  },
  cardPaper: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)'
  },
  modalImage: {
    width: '95%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  }
});

export default styles;