// imports
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase env vars
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // must be service role
);

// Start function
serve(async (req) => {
  try {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "user"); // or include all roles

    if (error) {
      console.error("Error fetching users:", error.message);
      return new Response("Error fetching users", { status: 500 });
    }

    let tasksCreated = 0;

    for (const user of users) {
      const { error: insertError } = await supabase.from("tasks").insert({
        title: "Daily Standup",
        description: "Team sync call",
        status: "pending",
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        is_recurring: true,
        recurrence_pattern: "daily",
        owner_id: user.id,
      });

      if (insertError) {
        console.error(`Error inserting task for user ${user.id}:`, insertError.message);
      } else {
        tasksCreated++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Recurring tasks inserted successfully", 
        tasksCreated,
        totalUsers: users.length 
      }), 
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});