import { db } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { PlanType } from "@/contexts/AuthContext";

export interface LicenseKey {
  key: string;
  plan: PlanType;
  active: boolean;
  createdAt: number;
  createdBy: string;
  validityDays: number;
  expiresAt: number;
  usedBy?: string;
  usedAt?: number;
  lastMessageReset?: number;
}

export async function generateLicenseKey(
  plan: PlanType,
  adminUid: string,
  validityDays: number,
): Promise<string> {
  const key = `LICENSE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const expiresAt = Date.now() + validityDays * 24 * 60 * 60 * 1000;

  const licenseData: LicenseKey = {
    key,
    plan,
    active: true,
    createdAt: Date.now(),
    createdBy: adminUid,
    validityDays,
    expiresAt,
  };

  await setDoc(doc(db, "licenses", key), licenseData);
  return key;
}

export async function getAllLicenses(adminUid: string): Promise<LicenseKey[]> {
  const licensesRef = collection(db, "licenses");
  const q = query(licensesRef, where("createdBy", "==", adminUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as LicenseKey);
}

export async function deactivateLicense(key: string): Promise<void> {
  await updateDoc(doc(db, "licenses", key), { active: false });
}

export async function markLicenseAsUsed(
  key: string,
  userUid: string,
): Promise<void> {
  await updateDoc(doc(db, "licenses", key), {
    usedBy: userUid,
    usedAt: Date.now(),
  });
}
