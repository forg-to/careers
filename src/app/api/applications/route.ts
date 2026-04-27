import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const application = await Application.create(body);
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
