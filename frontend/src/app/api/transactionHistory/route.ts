import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const address = url.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is missing" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.tokenisation.gcp-hub.com.au/transaction-history/${address}`
    );
    const data = response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}
