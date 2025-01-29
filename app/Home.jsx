import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getExpenses, addExpense } from "../services/expenseService";
import { MaterialIcons } from "@expo/vector-icons";

export default function ExpenseScreen() {
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    merchant: "",
    currency: "",
  });

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      console.log(data);
      setExpenses(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      if (!newExpense.amount || !newExpense.merchant || !newExpense.currency) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      await addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });

      setModalVisible(false);
      setNewExpense({ amount: "", merchant: "", currency: "" });
      fetchExpenses();
      Alert.alert("Success", "Expense added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add expense");
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount || 0),
    0
  );

  // const renderExpenseItem = ({ item }) => (
  //   <View style={styles.expenseItem}>
  //     <View>
  //       <Text style={styles.expenseDescription}>{item.description}</Text>
  //       <Text style={styles.expenseCategory}>{item.category}</Text>
  //     </View>
  //     <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
  //   </View>
  // );

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View>
        <Text style={styles.merchantName}>{item.merchant}</Text>
        <Text style={styles.currencyText}>{item.currency}</Text>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>
        {item.currency === 'Rupee' ? '₹' : '$'}{parseFloat(item.amount).toFixed(2)}
      </Text>
    </View>
  );


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Expenses</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Expenses:</Text>
          <Text style={styles.totalAmount}>₹{totalExpenses.toFixed(2)}</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.expense_id}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) =>
                setNewExpense({ ...newExpense, amount: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Merchant"
              value={newExpense.description}
              onChangeText={(text) =>
                setNewExpense({ ...newExpense, merchant: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Currency"
              value={newExpense.category}
              onChangeText={(text) =>
                setNewExpense({ ...newExpense, currency: text })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddExpense}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    color: "#666",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066cc",
  },
  list: {
    flex: 1,
  },
  expenseItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "500",
  },
  expenseCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0066cc",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  merchantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  currencyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: '#0066cc',
  },
});
