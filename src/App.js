import React, { useState, useEffect } from "react";
import { Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  IconButton,
} from "@mui/material";

const App = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth + 1, 20);
  const twentiethDay = new Date(currentYear, currentMonth, 20);

  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState(
    twentiethDay.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    startOfMonth.toISOString().split("T")[0]
  );
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    // Load saved expenses from local storage
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(savedExpenses);
    updateTotal(savedExpenses);
  }, []);

  useEffect(() => {
    // Update total when expenses or date range change
    updateTotal(expenses);
  }, [expenses, startDate, endDate]);

  const updateTotal = (expenseList) => {
    const filteredExpenses = expenseList.filter((expense) =>
      isWithinDateRange(expense.date, startDate, endDate)
    );

    const totalAmount = filteredExpenses.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
    setTotal(totalAmount);
  };

  const isWithinDateRange = (dateToCheck, start, end) => {
    const currentDate = new Date(dateToCheck);
    const rangeStart = start ? new Date(start) : null;
    const rangeEnd = end ? new Date(end) : null;

    return (
      (!rangeStart || currentDate >= rangeStart) &&
      (!rangeEnd || currentDate <= rangeEnd)
    );
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const addExpense = () => {
    // Create a new expense object
    const newExpense = {
      name,
      amount,
      date,
    };

    // Update state with the new expense
    setExpenses([...expenses, newExpense]);

    // Save expenses to local storage
    localStorage.setItem("expenses", JSON.stringify([...expenses, newExpense]));

    // Clear input fields
    setName("");
    setAmount("");
    setDate("");
    setShowForm(false); // Hide the form after adding an expense

    // Show a snackbar notification
    setSnackbarOpen(true);
  };

  const deleteExpense = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (isConfirmed) {
      const updatedExpenses = [...expenses];
      updatedExpenses.splice(index, 1);
      setExpenses(updatedExpenses);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Expense Tracker</h2>

      {/* Toggle Form Button */}
      <ToggleButtonGroup>
        <ToggleButton
          onClick={toggleForm}
          style={{
            backgroundColor: showForm ? "#e74c3c" : "#2ecc71",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showForm ? "Hide Form" : "Show Form"}
        </ToggleButton>
      </ToggleButtonGroup>

      {showForm && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "75%", marginBottom: "10px" }}
          />

          <TextField
            label="Amount"
            variant="outlined"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "75%", marginBottom: "10px" }}
          />

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: "75%", marginBottom: "10px" }}
          />

          <Button
            onClick={addExpense}
            variant="contained"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Add Expense
          </Button>
        </div>
      )}

      {/* Date Range Filter */}
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "10px" }}>Filter by Date Range:</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <label style={{ marginRight: "10px" }}>Start Date:</label>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "10px" }}>End Date:</label>
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
      </div>

      {/* Total Display */}
      <div style={{ marginTop: "20px" }}>
        <h3>Total: ₹{total}</h3>
      </div>

      {/* Expenses List */}
      <div style={{ marginTop: "20px" }}>
        <h3>Expenses:</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses
              .filter((expense) =>
                isWithinDateRange(expense.date, startDate, endDate)
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((expense, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px" }}>{expense.name}</td>
                  <td style={{ padding: "8px" }}>₹{expense.amount}</td>
                  <td style={{ padding: "8px" }}>{expense.date}</td>
                  <td style={{ padding: "8px" }}>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteExpense(index)}
                      variant="outlined"
                      size="small"
                      style={{ color: "#e74c3c", border: "1px solid #e74c3c" }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Snackbar for notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Expense added successfully!"
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={handleSnackbarClose}
            >
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default App;
