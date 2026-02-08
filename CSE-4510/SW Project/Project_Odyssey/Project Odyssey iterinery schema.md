// ItineraryResponseSchema (JSON Schema)
const ItineraryResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    itineraryPreview: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "integer", minimum: 1 },
              items: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    placeId: { type: ["string", "null"] },
                    name: { type: "string" },
                    category: {
                      type: "string",
                      enum: ["nature", "history", "museum", "urban"],
                    },
                    visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
                    time: { type: "string", enum: ["morning", "afternoon", "evening"] },
                  },
                  required: ["placeId", "name", "category", "visitDurationMin", "time"],
                },
              },
            },
            required: ["day", "items"],
          },
        },
        estimatedTotalCost: { type: "number", minimum: 0 },
      },
      required: ["days", "estimatedTotalCost"],
    },
  },
  required: ["reply", "itineraryPreview"],
};
