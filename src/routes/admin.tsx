import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  program: string | null;
  message: string | null;
  created_at: string;
};

function getEnv(): Record<string, string> {
  const cfEnv = (globalThis as unknown as { __env__?: Record<string, string> }).__env__;
  if (cfEnv) return cfEnv;
  if (typeof process !== "undefined" && process.env) return process.env as Record<string, string>;
  return {};
}

const verifyPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { password: string })
  .handler(async ({ data }) => {
    const env = getEnv();
    return { ok: data.password === env.ADMIN_PASSWORD };
  });

const fetchEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  const env = getEnv();
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Enquiry[];
});

export const Route = createFileRoute("/admin")({
  loader: () => fetchEnquiries(),
  component: AdminPage,
});

const SESSION_KEY = "admin_auth";

function AdminPage() {
  const enquiries = Route.useLoaderData();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { ok } = await verifyPassword({ data: { password } });
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-white border rounded-2xl p-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-navy">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the admin password to continue.</p>
          </div>
          <div>
            <Label htmlFor="pwd">Password</Label>
            <Input
              id="pwd"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking…" : "Login"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-navy">Enquiries</h1>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }}
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
        <p className="text-muted-foreground mb-8">{enquiries.length} total submissions</p>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Date", "Name", "Email", "Phone", "Program", "Message"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{e.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${e.email}`} className="text-blue-600 hover:underline">
                      {e.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    {e.program ? (
                      <span className="inline-block bg-gold/15 text-gold text-xs font-semibold px-2 py-0.5 rounded-full">
                        {e.program}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-muted-foreground" title={e.message ?? ""}>
                    {e.message ?? "—"}
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
