import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminRooms.css";

const AdminRoom = ({ onRoomAdded, onClose, formValues, onFormChange, isEditMode, onEditRoomSubmit }) => {
  const isControlled = !!formValues && !!onFormChange;
  const [localState, setLocalState] = useState({
    roomNumber: "",
    roomType: "",
    capacity: "",
    description: "",
    longDescription: "",
    price_per_night: "",
    amenities: "",
    image_url: "",
    weekendPrice: "",
    discount: "",
    reviews_rating: "",
    reviews_count: "",
    reviews_comment: "",
    total_units: ""
  });

  useEffect(() => {
    if (isControlled) return;
    setLocalState({
      roomNumber: "",
      roomType: "",
      capacity: "",
      description: "",
      longDescription: "",
      price_per_night: "",
      amenities: "",
      image_url: "",
      weekendPrice: "",
      discount: "",
      reviews_rating: "",
      reviews_count: "",
      reviews_comment: "",
      total_units: ""
    });
  }, [onClose, isControlled]);

  const getValue = (field) => (isControlled ? formValues[field] : localState[field]);
  const setValue = (field, value) => {
    if (isControlled) {
      onFormChange(field, value);
      return;
    }
    setLocalState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode && typeof onEditRoomSubmit === "function") {
      onEditRoomSubmit();
      return;
    }

    const roomData = {
      room_number: getValue("roomNumber") ? parseInt(getValue("roomNumber"), 10) : undefined,
      room_type: getValue("roomType"),
      capacity: getValue("capacity") ? parseInt(getValue("capacity"), 10) : undefined,
      description: getValue("description"),
      long_description: getValue("longDescription"),
      price_per_night: getValue("price_per_night") ? parseFloat(getValue("price_per_night")) : undefined,
      amenities: getValue("amenities").trim() ? getValue("amenities").split(",").map((a) => a.trim()) : [],
      image_url: getValue("image_url"),
      weekendPrice: getValue("weekendPrice"),
      discount: getValue("discount"),
      reviews: {
        rating: getValue("reviews_rating"),
        count: getValue("reviews_count"),
        comment: getValue("reviews_comment")
      },
      total_units: getValue("total_units") ? parseInt(getValue("total_units"), 10) : undefined
    };

    try {
      const response = await axios.post("http://localhost:5000/api/rooms", roomData);
      if (response.status === 201) {
        toast.success("Soba uspesno dodata!");
        if (onRoomAdded) onRoomAdded(response.data);
        if (onClose) onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Greska prilikom dodavanja sobe");
    }
  };

  return (
    <div className="admin-room-card">
      <h2 className="admin-room-title">{isEditMode ? "Izmeni sobu" : "Dodaj sobu"}</h2>

      <form className="admin-room-form" onSubmit={handleSubmit}>
        <div className="admin-room-grid">
          <label className="admin-room-field">
            <span>Broj sobe</span>
            <input
              className="admin-room-input"
              type="number"
              min="1"
              value={getValue("roomNumber")}
              onChange={(e) => setValue("roomNumber", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field">
            <span>Tip sobe</span>
            <input
              className="admin-room-input"
              type="text"
              value={getValue("roomType")}
              onChange={(e) => setValue("roomType", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field">
            <span>Kapacitet</span>
            <input
              className="admin-room-input"
              type="number"
              min="1"
              value={getValue("capacity")}
              onChange={(e) => setValue("capacity", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field">
            <span>Ukupan broj jedinica</span>
            <input
              className="admin-room-input"
              type="number"
              min="1"
              value={getValue("total_units")}
              onChange={(e) => setValue("total_units", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field">
            <span>Cena po noci</span>
            <input
              className="admin-room-input"
              type="number"
              min="0"
              step="0.01"
              value={getValue("price_per_night")}
              onChange={(e) => setValue("price_per_night", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field">
            <span>Cena za vikend</span>
            <input
              className="admin-room-input"
              type="number"
              min="0"
              step="0.01"
              value={getValue("weekendPrice")}
              onChange={(e) => setValue("weekendPrice", e.target.value)}
            />
          </label>

          <label className="admin-room-field admin-room-field-full">
            <span>URL slike</span>
            <input
              className="admin-room-input"
              type="text"
              value={getValue("image_url")}
              onChange={(e) => setValue("image_url", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field admin-room-field-full">
            <span>Kratak opis</span>
            <textarea
              className="admin-room-input admin-room-textarea"
              rows={3}
              value={getValue("description")}
              onChange={(e) => setValue("description", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field admin-room-field-full">
            <span>Duzi opis</span>
            <textarea
              className="admin-room-input admin-room-textarea"
              rows={5}
              value={getValue("longDescription")}
              onChange={(e) => setValue("longDescription", e.target.value)}
              required
            />
          </label>

          <label className="admin-room-field admin-room-field-full">
            <span>Sadrzaji (odvojeni zarezom)</span>
            <input
              className="admin-room-input"
              type="text"
              value={getValue("amenities")}
              onChange={(e) => setValue("amenities", e.target.value)}
            />
          </label>

          <label className="admin-room-field">
            <span>Popust</span>
            <input
              className="admin-room-input"
              type="text"
              value={getValue("discount")}
              onChange={(e) => setValue("discount", e.target.value)}
              placeholder="npr. 10% za 7+ noci"
            />
          </label>

          <label className="admin-room-field">
            <span>Ocena</span>
            <input
              className="admin-room-input"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={getValue("reviews_rating")}
              onChange={(e) => setValue("reviews_rating", e.target.value)}
            />
          </label>

          <label className="admin-room-field">
            <span>Broj recenzija</span>
            <input
              className="admin-room-input"
              type="number"
              min="0"
              value={getValue("reviews_count")}
              onChange={(e) => setValue("reviews_count", e.target.value)}
            />
          </label>

          <label className="admin-room-field">
            <span>Komentar recenzije</span>
            <input
              className="admin-room-input"
              type="text"
              value={getValue("reviews_comment")}
              onChange={(e) => setValue("reviews_comment", e.target.value)}
            />
          </label>
        </div>

        <button className="admin-room-submit" type="submit">
          {isEditMode ? "Sacuvaj izmene" : "Dodaj sobu"}
        </button>
      </form>
    </div>
  );
};

export default React.memo(AdminRoom);
