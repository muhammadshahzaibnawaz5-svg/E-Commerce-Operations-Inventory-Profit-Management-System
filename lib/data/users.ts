import type { User } from "@/lib/types";

export const users: User[] = [
  { id: "u_001", fullName: "Ayesha Khan", email: "owner@example.com", password: "demo1234", role: "Owner / Admin", status: "active" },
  { id: "u_002", fullName: "Bilal Ahmed", email: "manager@example.com", password: "demo1234", role: "Manager", status: "active" },
  { id: "u_003", fullName: "Sana Iqbal", email: "inventory@example.com", password: "demo1234", role: "Inventory", status: "active" },
  { id: "u_004", fullName: "Omar Farooq", email: "orders@example.com", password: "demo1234", role: "Order Processing", status: "active" },
  { id: "u_005", fullName: "Hina Raza", email: "finance@example.com", password: "demo1234", role: "Finance", status: "active" },
];

export const defaultUserEmail = "owner@example.com";