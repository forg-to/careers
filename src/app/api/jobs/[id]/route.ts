import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const json = await req.json();

    // Explicit field selection
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
    
    const job = await Job.findByIdAndUpdate(
      id, 
      { 
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
      }, 
      { new: true, runValidators: true }
    );
    
    if (!job) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/jobs/${id}`);
    
    return NextResponse.json(job);
  } catch (error: any) {
    console.error("Job update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Job delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
