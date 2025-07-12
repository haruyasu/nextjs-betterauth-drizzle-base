import { generateImage, videoGenerationFunction } from "@/inngest"
import { inngest } from "@/lib/inngest"
import { serve } from "inngest/next"

// Export all inngest functions here
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateImage, videoGenerationFunction],
})
