import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const fetchFlow = (agentId) =>
  axios.get(`${BASE_URL}/flows/${agentId}`);

export const saveFlow = (flowData) =>
  axios.post(`${BASE_URL}/flows`, flowData);

export const updateFlow = (id, flowData) =>
  axios.put(`${BASE_URL}/flows/${id}`, flowData);

export const deleteFlow = (id) =>
  axios.delete(`${BASE_URL}/flows/${id}`);