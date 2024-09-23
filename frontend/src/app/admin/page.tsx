"use client";

import { useState, useEffect } from "react";

import { AdminPageComponent } from "@/components/admin-page";

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminTokenFromStorage = localStorage.getItem("AdminToken");

      setAdminToken(adminTokenFromStorage);
    }
  }, []);

  if (adminToken) {
    window.location.href = "/admin/dashboard";
  }
  return (
    <div>
      <AdminPageComponent />
    </div>
  );
}
