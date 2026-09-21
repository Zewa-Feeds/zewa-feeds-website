/**
 * A snapshot of real reviews, for when the API cannot be reached.
 *
 * These are GENUINE Amazon reviews, copied from the database — the same rows
 * `/reviews/featured` serves. They are here so a transient API failure degrades
 * to slightly stale truth rather than deleting the whole section from the home
 * page, which is what happened when the fetch simply returned null.
 *
 * NOT a licence to invent. Every field below traces to a real review; the file
 * exists because a review that was true last week is still true today. The live
 * endpoint is always preferred, and the section credits Amazon either way.
 *
 * Regenerate from the database when the reviews change materially.
 */
export const FALLBACK_REVIEWS = [
    {
      "author": "Deroots",
      "rating": 5,
      "title": "Good slow sinking fish feed",
      "body": "Good food quality and the fishes like it. These are slow sinking so good for the fishes and doesn't pollute the tank.",
      "product": "Zewa Feeds Cichlid Bites C4",
      "source": "Amazon"
    },
    {
      "author": "subir das",
      "rating": 5,
      "title": "Definitely worth the price!",
      "body": "My guppies absolutely loved this food! The high-quality ingredients make it a healthy and nutritious choice for them. Definitely worth the price and highly recommended!",
      "product": "Zewa Feeds Guppy Bites G2",
      "source": "Amazon"
    },
    {
      "author": "soumya",
      "rating": 5,
      "title": "Must buy - guppies colour and grow big size",
      "body": "Must buy for guppy fish. Excellent color and growth results.",
      "product": "Zewa Feeds Guppy Bites G2",
      "source": "Amazon"
    },
    {
      "author": "Sebastian",
      "rating": 5,
      "title": "Ideal food for premium cherry red ornamental shrimps",
      "body": "This is ideal for premium cherry red, blue and yellow ornamental shrimps. They are eating it like crazy and growth is great so far with my small ones.",
      "product": "Zewa Feeds Shrimp Grazers S5",
      "source": "Amazon"
    },
    {
      "author": "Ananthu",
      "rating": 5,
      "title": "My flowerhorn is absolutely loving this!",
      "body": "I have an 8 inch FH and he was used to some of best imported feeds since a child. Thought he wouldn't take natural food but he is now all over it. Visible difference in activity and colours. But he took a bit of time to adjust though, around 3-4 days had to give in parallel with other foods. But now he is not touching any old foods.",
      "product": "Zewa Feeds Monster Sticks A10",
      "source": "Amazon"
    },
    {
      "author": "Kapil Choudhary",
      "rating": 5,
      "title": "Good one",
      "body": "My betta is only eating live feed so he is not eating this or any other fish food but my guppies and Molly fishes loving it.",
      "product": "Zewa Feeds Betta Bites F3",
      "source": "Amazon"
    },
    {
      "author": "Aswin",
      "rating": 5,
      "title": "Food quality",
      "body": "Value for money. Fish enjoying their meal. Difference are visible before and after the food. But it takes 3-4 weeks.",
      "product": "Zewa Feeds Betta Bites F3",
      "source": "Amazon"
    },
    {
      "author": "ravi kant",
      "rating": 5,
      "title": "About zewa betta",
      "body": "Nice but rate is very high. Fish is healthy but colour is not very good. Size is very good.",
      "product": "Zewa Feeds Betta Bites F3",
      "source": "Amazon"
    },
    {
      "author": "Nihar Ranjan Paltasingh",
      "rating": 5,
      "title": "Beta fish eats happily",
      "body": "After one week I can say, my beta fish is eating them. Impact is under study.",
      "product": "Zewa Feeds Betta Bites F3",
      "source": "Amazon"
    },
    {
      "author": "Ramesh",
      "rating": 5,
      "title": "Best in the market",
      "body": "Excellent Quality and Service from Zewa Feeds. I've been using Zewa Feeds for a while now, and I can confidently say their products are top-notch. The feed is always fresh, consistent in quality, and has made a noticeable difference in the health and productivity of my livestock. Highly recommended for anyone looking for premium feeds nutrition!",
      "product": "Zewa Feeds Guppy Bites G2",
      "source": "Amazon"
    },
    {
      "author": "HARSHA P P",
      "rating": 5,
      "title": "Best feed for cichlids",
      "body": "Ideal for wide ranges of cichlids. Great for colours and keeps water quality.",
      "product": "Zewa Feeds Cichlid Bites C4",
      "source": "Amazon"
    },
    {
      "author": "Praveen",
      "rating": 5,
      "title": "One of the best",
      "body": "One of the best granular feed for Malawi Cichlids. They are somewhat slow sinking, keeps fishes healthy and colourful.",
      "product": "Zewa Feeds Cichlid Bites C5",
      "source": "Amazon"
    }
  ];

/** The range-wide figure at the time of the snapshot. */
export const FALLBACK_RATING = { average: 4.5, count: 468 };
