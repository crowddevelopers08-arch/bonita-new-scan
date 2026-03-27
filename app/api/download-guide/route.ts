import { NextRequest, NextResponse } from "next/server"

type Section = { heading: string; items: string[] }

interface Guide {
  title: string
  subtitle: string
  sections: Section[]
  disclaimer: string
}

const guides: Record<string, Guide> = {
  acne: {
    title: "Complete Acne Treatment Guide",
    subtitle: "Personalised skincare protocol for acne-prone skin",
    sections: [
      {
        heading: "Understanding Acne",
        items: [
          "Acne occurs when hair follicles become clogged with oil and dead skin cells.",
          "It can appear as whiteheads, blackheads, or pimples.",
        ],
      },
      {
        heading: "Morning Routine",
        items: [
          "1. Cleanse with a gentle salicylic acid-based cleanser (2%)",
          "2. Apply a lightweight, oil-free moisturiser",
          "3. Apply SPF 30+ sunscreen (non-comedogenic)",
        ],
      },
      {
        heading: "Evening Routine",
        items: [
          "1. Remove makeup with micellar water or oil-free remover",
          "2. Double cleanse if wearing makeup",
          "3. Apply benzoyl peroxide (2.5–5%) to active breakouts",
          "4. Apply oil-free moisturiser",
        ],
      },
      {
        heading: "Weekly Treatments",
        items: [
          "Clay mask 1–2× per week for deep pore cleansing",
          "Chemical exfoliant with salicylic acid 2–3× per week",
        ],
      },
      {
        heading: "Product Recommendations",
        items: [
          "Cleanser: CeraVe Salicylic Acid Cleanser",
          "Moisturiser: Neutrogena Oil-Free Moisturiser",
          "Spot Treatment: La Roche-Posay Effaclar Duo",
          "Sunscreen: EltaMD UV Clear SPF 46",
        ],
      },
      {
        heading: "Lifestyle Tips",
        items: [
          "Change pillowcases every 2–3 days",
          "Avoid touching your face throughout the day",
          "Stay hydrated — 8 glasses of water daily",
          "Maintain a balanced diet low in processed sugars",
          "Manage stress through exercise or meditation",
        ],
      },
      {
        heading: "When to See a Dermatologist",
        items: [
          "Severe or cystic acne",
          "Acne not responding to OTC treatments after 8 weeks",
          "Acne leaving scars",
          "Sudden onset of adult acne",
        ],
      },
    ],
    disclaimer:
      "This guide is for informational purposes only and does not constitute medical advice. Please consult a dermatologist for a personalised treatment plan.",
  },

  pigmentation: {
    title: "Pigmentation Recovery Protocol",
    subtitle: "Targeted brightening routine for hyperpigmentation",
    sections: [
      {
        heading: "Understanding Pigmentation",
        items: [
          "Hyperpigmentation occurs when excess melanin forms deposits in the skin.",
          "Common types include melasma, sun spots, and post-inflammatory hyperpigmentation.",
        ],
      },
      {
        heading: "Morning Routine",
        items: [
          "1. Gentle pH-balanced cleanser",
          "2. Vitamin C serum (15–20% L-ascorbic acid)",
          "3. Lightweight moisturiser with niacinamide",
          "4. SPF 50+ broad-spectrum sunscreen (ESSENTIAL)",
        ],
      },
      {
        heading: "Evening Routine",
        items: [
          "1. Double cleanse to remove sunscreen",
          "2. Apply retinol (start at 0.25%, gradually increase)",
          "3. Hydrating serum with hyaluronic acid",
          "4. Rich moisturiser",
        ],
      },
      {
        heading: "Key Active Ingredients",
        items: [
          "Vitamin C — inhibits melanin production",
          "Niacinamide — reduces melanin transfer",
          "Arbutin — gentle melanin inhibitor",
          "Kojic Acid — natural skin brightener",
          "Azelaic Acid — anti-inflammatory brightener",
          "Retinoids — increases cell turnover",
        ],
      },
      {
        heading: "Product Recommendations",
        items: [
          "Vitamin C: SkinCeuticals C E Ferulic",
          "Niacinamide: The Ordinary Niacinamide 10%",
          "Retinol: Paula's Choice Clinical 1% Retinol",
          "Sunscreen: La Roche-Posay Anthelios SPF 50+",
        ],
      },
      {
        heading: "Sun Protection Protocol",
        items: [
          "Apply SPF 50+ every morning, even on cloudy days",
          "Reapply every 2 hours when outdoors",
          "Wear wide-brimmed hats and sunglasses",
          "Seek shade during peak hours (10 am – 4 pm)",
        ],
      },
      {
        heading: "Professional Treatments",
        items: [
          "Chemical Peels (glycolic, TCA)",
          "Laser Therapy (IPL, fractional)",
          "Microneedling",
          "Prescription hydroquinone (short-term use)",
        ],
      },
    ],
    disclaimer:
      "This guide is for informational purposes only and does not constitute medical advice. Please consult a dermatologist for a personalised treatment plan.",
  },

  "hair-loss": {
    title: "Hair Restoration Guide",
    subtitle: "Comprehensive protocol for thinning hair & hair loss",
    sections: [
      {
        heading: "Understanding Hair Loss",
        items: [
          "Hair loss can result from genetics, hormonal changes, medical conditions, or stress.",
          "The most common type is androgenetic alopecia (pattern baldness).",
        ],
      },
      {
        heading: "Hair Growth Cycle",
        items: [
          "Anagen (Growth Phase): 2–7 years",
          "Catagen (Transition Phase): 2–3 weeks",
          "Telogen (Resting Phase): 3 months",
        ],
      },
      {
        heading: "Daily Hair Care Routine",
        items: [
          "Wash 2–3× per week with lukewarm water",
          "Apply sulfate-free shampoo; massage scalp gently for 2–3 min",
          "Condition ends only — avoid the scalp",
          "Air-dry when possible; use heat protectant if blow-drying",
          "Avoid tight hairstyles (ponytails, braids)",
        ],
      },
      {
        heading: "Scalp Massage Technique",
        items: [
          "Use fingertips (not nails) with gentle circular pressure",
          "Cover entire scalp: hairline, crown, sides, back",
          "5–10 minutes daily on dry hair or with scalp oil",
        ],
      },
      {
        heading: "Topical Treatments",
        items: [
          "Minoxidil 5% (FDA approved) — apply to dry scalp twice daily; results after 4–6 months",
          "Rosemary Oil — mix with jojoba/coconut oil, massage in, leave 30 min before washing",
        ],
      },
      {
        heading: "Recommended Supplements",
        items: [
          "Biotin: 2500–5000 mcg daily",
          "Iron: if deficient (check with doctor)",
          "Vitamin D: 1000–2000 IU daily",
          "Zinc: 15–30 mg daily",
          "Omega-3 fatty acids",
        ],
      },
      {
        heading: "Diet for Healthy Hair",
        items: [
          "Protein — eggs, fish, lean meats",
          "Iron-rich foods — spinach, lentils",
          "Vitamin C — citrus, berries",
          "Omega-3s — salmon, walnuts",
          "Biotin — eggs, nuts, whole grains",
        ],
      },
      {
        heading: "Professional Treatments",
        items: [
          "PRP Therapy (Platelet-Rich Plasma)",
          "Low-Level Laser Therapy",
          "Hair Transplant Surgery",
          "Prescription Finasteride (consult doctor)",
        ],
      },
    ],
    disclaimer:
      "This guide is for informational purposes only and does not constitute medical advice. Please consult a dermatologist or trichologist for a personalised treatment plan.",
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const problem = searchParams.get("problem")

  if (!problem || !guides[problem]) {
    return NextResponse.json({ error: "Invalid problem type" }, { status: 400 })
  }

  return NextResponse.json(guides[problem])
}
