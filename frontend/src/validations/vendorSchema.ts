import { z } from "zod";

export const vendorSchema = z.object({
  vendorName: z
    .string()
    .min(3, "Vendor name must be at least 3 characters"),

  vendorCode: z
    .string()
    .min(2, "Vendor code is required"),

  gstNumber: z
    .string()
    .min(15, "GST Number must be 15 characters")
    .max(15, "GST Number must be 15 characters"),

  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN Number"
    ),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "Phone number must be 10 digits"
    ),

  country: z
    .string()
    .min(2, "Country is required"),

  status: z.enum([
    "Active",
    "Inactive",
    "Awaiting Approval",
  ]),
});