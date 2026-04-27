import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;
if (!secret) {
  // In production, we want to ensure this is set. 
  // We'll use a fallback only if explicitly allowed, but better to fail loud.
  if (process.env.NODE_ENV === 'production') {
    throw new Error("JWT_SECRET environment variable is not set");
  }
}

const key = new TextEncoder().encode(secret || "dev_only_secret_change_me_in_production");

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    email && email === process.env.ADMIN_EMAIL &&
    password && password === process.env.ADMIN_PASSWORD
  ) {
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const session = await encrypt({ email, expires });

    (await cookies()).set("session", session, { 
      expires, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return true;
  }
  return false;
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}
