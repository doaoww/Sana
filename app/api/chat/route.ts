import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { supabase } from "@/lib/supabase";

type NearbyProduct = {
  name: string;
  category: string | null;
  discounted_price: number | null;
  original_price: number | null;
  quantity: number | null;
  vendor_name: string | null;
  distance: number | null;
};

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export async function POST(req: Request) {
  const { messages, userLocation, budget } = await req.json();

  const lat = asNumber(userLocation?.lat, 43.222);
  const lng = asNumber(userLocation?.lng, 76.8512);

  let products: NearbyProduct[] = [];

  const rpcResult = await supabase.rpc("nearby_products", {
    user_lat: lat,
    user_lng: lng,
    radius_meters: 2000,
  });

  if (!rpcResult.error && rpcResult.data) {
    products = rpcResult.data as NearbyProduct[];
  } else {
    const fallback = await supabase
      .from("products")
      .select("name, category, discounted_price, original_price, quantity, vendor_name")
      .gt("quantity", 0)
      .gt("expiry_time", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(5);

    if (!fallback.error && fallback.data) {
      products = (fallback.data as Omit<NearbyProduct, "distance">[]).map((p) => ({
        ...p,
        distance: null,
      }));
    }
  }

  const inventoryText =
    products && products.length > 0
      ? products
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} (${p.category ?? "Other"}) — ${p.discounted_price ?? 0}₸ (was ${p.original_price ?? 0}₸), ${p.distance !== null ? `${Math.round(p.distance)}m away` : "distance unavailable"}, Qty: ${p.quantity ?? 0}, Vendor: ${p.vendor_name ?? "Unknown"}`
          )
          .join("\n")
      : "No nearby items available at the moment.";

  const systemPrompt = `You are Sana, a friendly AI assistant for a sustainable food marketplace in Almaty, Kazakhstan.

The user is located at: ${lat}, ${lng}.
Their budget is: ${budget ? budget + "₸" : "not specified"}.

Nearby available items (within 2km):
${inventoryText}

Your job:
1. Recommend specific items from the nearby list that fit their budget.
2. If relevant, suggest a simple recipe using the item.
3. Always mention the vendor name, price in ₸, and distance.
4. Be warm, concise, and helpful. Never recommend items not in the list.
5. Respond in the same language the user writes in (Kazakh, Russian, or English).
6. Keep responses short and scannable.`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: Array.isArray(messages) ? messages : [],
  });

  return result.toTextStreamResponse();
}