import { readJotformConfig, submitToJotform } from "@/lib/jotform";
import { handleWaitlist } from "@/lib/waitlist-handler";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleWaitlist(request, {
    config: readJotformConfig(process.env),
    submit: (value, config) => submitToJotform(value, config),
  });
}
