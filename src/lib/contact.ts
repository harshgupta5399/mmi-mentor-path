import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";
import { confirmationEmail, adminNotificationEmail } from "./email-templates";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  // accepts optional phone: digits, spaces, +, -, (), min 7 digits
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[+\d][\d\s\-().]{5,19}$/.test(v), "Invalid phone number"),
  country: z.string().optional(),
  program: z.string().optional(),
  message: z.string().optional(),
});

type ContactInput = z.infer<typeof schema>;

function getEnv(): Record<string, string> {
  // Cloudflare Workers runtime (production)
  const cfEnv = (globalThis as unknown as { __env__?: Record<string, string> }).__env__;
  if (cfEnv) return cfEnv;
  // Node / Vite dev server — vars loaded from .env via dotenv or wrangler .dev.vars
  if (typeof process !== "undefined" && process.env) return process.env as Record<string, string>;
  return {};
}

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }: { data: ContactInput }) => {
    const env = getEnv();

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

    const { error: dbError } = await supabase.from("enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      country: data.country ?? null,
      program: data.program ?? null,
      message: data.message ?? null,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      throw new Error("Failed to save enquiry");
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // Confirmation email to the user
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: data.email,
      subject: "We received your enquiry — MMI Educator",
      html: confirmationEmail({
        name: data.name,
        program: data.program,
        message: data.message,
      }),
    });

    // Notification email to admin
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: env.ADMIN_EMAIL,
      subject: `New Enquiry from ${data.name}`,
      html: adminNotificationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: data.program,
        message: data.message,
      }),
    });

    return { ok: true };
  });
