import Cookies from "js-cookie";
import { getBaseUrl } from "@/helpers/config/envConfig";

// Download invoice from the backend API (returns a PDF binary)
export async function downloadInvoiceFromApi(
  mongoId: string,
  orderId: string,
  type: "admin" | "user"
) {
  const token = Cookies.get("maggot_dashboard_accessToken") ?? "";
  try {
    const res = await fetch(`${getBaseUrl()}/orders/${mongoId}/invoice?type=${type}`, {
      headers: { token },
    });
    if (!res.ok) throw new Error("Failed to fetch invoice");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}-${type}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Invoice download failed:", err);
    throw err;
  }
}
