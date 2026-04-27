import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const json = await req.json();
    
    // Explicit field selection to prevent mass assignment
    const { jobId, name, email, answers, forgUsername } = json;

    // Verify job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      return NextResponse.json({ error: "This position is no longer accepting applications" }, { status: 400 });
    }

    const application = await Application.create({
      jobId,
      name,
      email,
      answers,
      forgUsername,
      status: 'pending' // Force default status
    });
    
    return NextResponse.json({ success: true, id: application._id });
  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
