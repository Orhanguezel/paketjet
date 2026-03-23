import { apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { ContactFormData } from "./contact.type";

export function createContact(data: ContactFormData) {
  return apiPost(API.contacts.create, data);
}
