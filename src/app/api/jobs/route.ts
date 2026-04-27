import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const json = await req.json();
    
    // Explicit field selection to prevent mass assignment
    const { 
      title, 
      department, 
      location, 
      type, 
      description, 
      status, 
      questions, 
      requestForgUsername, 
      forgUsernameRequired,
      mustHaveSkills,
      experience,
      salaryRange,
      budget
    } = json;
    
    const job = await Job.create({
      title,
      department,
      location,
      type,
      description,
      status,
      questions,
      requestForgUsername,
      forgUsernameRequired,
      mustHaveSkills,
      experience,
      salaryRange,
      budget
    });
    
    revalidatePath("/");
    revalidatePath("/admin");
    
    return NextResponse.json(job);
  } catch (error: any) {
    console.error("Job creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error("Job fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
