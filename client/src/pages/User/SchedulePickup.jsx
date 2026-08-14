import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pickupAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function SchedulePickup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eWasteType: "Laptop",
    quantity: "1",
    pickupDate: "",
    pickupTime: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      await pickupAPI.createRequest(formData);
      setMessage({
        type: "success",
        text: "E-Waste pickup scheduled successfully! We will contact you soon.",
      });
      setTimeout(() => {
        navigate(user ? "/my-requests" : "/");
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to schedule pickup. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <h1>Schedule E-Waste Pickup</h1>

      {message.text && (
        <div
          style={{
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      <form className="pickup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select name="eWasteType" value={formData.eWasteType} onChange={handleChange}>
          <option value="Laptop">Laptop</option>
          <option value="Mobile Phone">Mobile Phone</option>
          <option value="Computer">Computer Desktop</option>
          <option value="Printer">Printer / Scanner</option>
          <option value="Television">Television / Monitor</option>
          <option value="Batteries">Batteries & Power Supplies</option>
          <option value="Other">Other Electronic Waste</option>
        </select>

        <input
          type="text"
          name="quantity"
          placeholder="Quantity / Item details (e.g. 2 Laptops, 1 Printer)"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
        />

        <input
          type="time"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Pickup Address"
          rows="4"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Pickup"}
        </button>
      </form>
    </div>
  );
}

export default SchedulePickup;